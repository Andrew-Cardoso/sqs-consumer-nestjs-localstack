import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SqsManagerService } from './sqs-manager.service';

@Module({
  imports: [HttpModule, PrismaModule],
  providers: [SqsManagerService],
  exports: [SqsManagerService],
})
export class SqsManagerModule {}
