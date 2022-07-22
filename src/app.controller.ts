import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { SqsManagerService } from './sqs-manager/sqs-manager.service';

@Controller()
export class AppController {
  constructor(private readonly sqsService: SqsManagerService) {}

  @Get()
  async getMessage(@Res() res: Response): Promise<Response> {
    const data = await this.sqsService.getNextMessage();
    return res.send(`
    <div style="width: 100vw; height: 100vh; position: fixed; top: 0; left: 0;">
      <main style="width: 100%; height: 100%; background: #222; display: grid; place-items: center">
        <article style="color: #FFF; font-size: 18px; font-family: monospace; display: flex; flex-flow: column; gap: 8px">
        ${
          typeof data === 'string'
            ? `<strong>${data}</strong>`
            : `
              <section><strong>Name :</strong> ${data.name}</section>
              <section><strong>Birth:</strong> ${data.birth_data}</section>
              <section><strong>Addr :</strong> ${data.address}</section>
            `
        }
        </article>
      </main>
    </div>
    `);
  }
}
