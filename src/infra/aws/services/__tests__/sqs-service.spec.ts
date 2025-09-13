/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { SqsService } from '@ssut/nestjs-sqs';
import { ConfigService } from '@nestjs/config';
import { QueueService } from '../sqs.service';

const mockSqsService = {
  send: jest.fn(),
};

const mockConfigService = {
  get: jest.fn().mockReturnValue('vehicle-fifo'),
};

describe('QueueService', () => {
  let queueService: QueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueService,
        { provide: SqsService, useValue: mockSqsService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    queueService = module.get<QueueService>(QueueService);
  });

  it('should be defined', () => {
    expect(queueService).toBeDefined();
  });

  it('should send a message successfully', async () => {
    const message = 'Test message';
    mockSqsService.send.mockResolvedValueOnce(undefined); // Simula sucesso

    await expect(queueService.sendMessage(message)).resolves.not.toThrow();
    expect(mockSqsService.send).toHaveBeenCalledWith('vehicle-fifo', {
      id: expect.any(String),
      body: message,
    });
  });

  it('should throw an error when sending a message fails', async () => {
    const message = 'Test message';
    mockSqsService.send.mockRejectedValueOnce(new Error('SQS error'));

    await expect(queueService.sendMessage(message)).rejects.toThrow(
      'SQS error',
    );
    expect(mockSqsService.send).toHaveBeenCalledWith('vehicle-fifo', {
      id: expect.any(String),
      body: message,
    });
  });
});
