/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { SqsModule } from '@ssut/nestjs-sqs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueService } from './services/sqs.service';

@Module({
  imports: [
    ConfigModule,
    SqsModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): SqsModule => ({
        SQS_QUEUE_NAME: configService.get<string>('SQS_QUEUE_NAME'),
        SQS_ENDPOINT: configService.get<string>('SQS_ENDPOINT'),
        consumers: [
          {
            name: configService.get<string>('SQS_QUEUE_NAME'),
            queueUrl: configService.get<string>('SQS_QUEUE_URL'),
            region: configService.get<string>('AWS_REGION'),
            credentials: {
              accessKeyId:
                configService.get<string>('AWS_ACCESS_KEY_ID') || 'localstack',
              secretAccessKey:
                configService.get<string>('AWS_SECRET_ACCESS_KEY') ||
                'localstack',
            },
            useQueueUrlAsEndpoint: true,
          },
        ],
        producers: [
          {
            name: configService.get<string>('SQS_QUEUE_NAME'),
            queueUrl: configService.get<string>('SQS_QUEUE_URL'),
            region: configService.get<string>('AWS_REGION'),
            credentials: {
              accessKeyId:
                configService.get<string>('AWS_ACCESS_KEY_ID') || 'localstack',
              secretAccessKey:
                configService.get<string>('AWS_SECRET_ACCESS_KEY') ||
                'localstack',
            },
            useQueueUrlAsEndpoint: true,
          },
        ],
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class AwsModule {}
