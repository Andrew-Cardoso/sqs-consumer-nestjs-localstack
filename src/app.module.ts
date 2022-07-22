import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AwsSdkModule } from 'nest-aws-sdk';
import { SQS } from 'aws-sdk';
import { SqsManagerModule } from './sqs-manager/sqs-manager.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    AwsSdkModule.forRoot({
      defaultServiceOptions: {
        endpoint: 'http://localhost:4566',
        region: 'us-east-1',
        credentials: {
          accessKeyId: 'test',
          secretAccessKey: 'test',
        },
      },
      services: [SQS],
    }),
    SqsManagerModule,
    PrismaModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
