/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { SqsService } from '@ssut/nestjs-sqs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QueueService {
  private readonly queueName: string;

  constructor(
    private readonly sqsService: SqsService,
    private readonly configService: ConfigService,
  ) {
    this.queueName = this.configService.get<string>('SQS_QUEUE_NAME') as string;
  }

  async sendMessage(message): Promise<void> {
    try {
      await this.sqsService.send(this.queueName, {
        id: Date.now().toString(),
        body: message,
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
