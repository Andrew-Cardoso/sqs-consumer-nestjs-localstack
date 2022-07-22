import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { User } from '@prisma/client';
import { SQS } from 'aws-sdk';
import { InjectAwsService } from 'nest-aws-sdk';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SqsManagerService {
  private queueUrl: string;
  constructor(
    @InjectAwsService(SQS) private readonly sqs: SQS,
    private readonly http: HttpService,
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async initQueue(queueName: string) {
    return new Promise((res, rej) => {
      this.sqs.listQueues((err, data) => {
        if (err) return rej(err);

        const queue = data?.QueueUrls?.[0];
        if (queue) return res((this.queueUrl = queue));

        this.sqs.createQueue({ QueueName: queueName }, (err, data) =>
          err ? rej(err) : res((this.queueUrl = data.QueueUrl)),
        );
      });
    });
  }

  async getNextMessage(): Promise<User | string> {
    return new Promise((res, rej) =>
      this.sqs.receiveMessage({ QueueUrl: this.queueUrl }, (err, data) => {
        if (err) return rej(err);
        if (!data.Messages?.length) return res('No message');

        const user = JSON.parse(data.Messages[0].Body);

        this.eventEmitter.emit(
          'user.handled',
          data.Messages[0].ReceiptHandle,
          user,
        );

        res(user);
      }),
    );
  }

  @OnEvent('user.handled')
  removeFromQueue(receiptHandle: string) {
    console.log('handled remove');
    this.sqs.deleteMessage(
      {
        QueueUrl: this.queueUrl,
        ReceiptHandle: receiptHandle,
      },
      (err, data) => console.log(err ?? data),
    );
  }

  @OnEvent('user.handled')
  async saveInDatabase(receiptHandle: string, data: User) {
    console.log(data);
    await this.prisma.user.create({
      data,
    });
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async addQueueMessage() {
    try {
      const {
        data: { name, address, birth_data },
      } = await this.http.axiosRef.get('https://api.namefake.com/');

      const MessageBody = JSON.stringify({ name, address, birth_data });
      this.sqs.sendMessage(
        { MessageBody, QueueUrl: this.queueUrl },
        (err, data) => console.log(err ?? data),
      );
    } catch (err) {
      console.log(err);
    }
  }
}
