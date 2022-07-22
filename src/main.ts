import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SqsManagerService } from './sqs-manager/sqs-manager.service';

import 'dotenv/config';

(async () => {
  const port = +process.env.PORT;
  const app = await NestFactory.create(AppModule);

  await app.listen(port);

  const sqsService = app.get(SqsManagerService);

  sqsService
    .initQueue('testFIFO')
    .then(() => console.log(`\n\nApp initialized on port ${port}\n`))
    .catch((err) => {
      console.log(err);
      app.close();
    });
})();
