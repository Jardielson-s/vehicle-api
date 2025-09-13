/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import { Message } from '@aws-sdk/client-sqs';
import { VehicleService } from '../services/vehicle.service';
import { VehicleEntity } from '../entities/vehicle.entity';

@Injectable()
export class VehicleConsumerService {
  constructor(private readonly vehicleService: VehicleService) {}

  @SqsMessageHandler(process.env.SQS_QUEUE_NAME || 'vehicle-fifo', false)
  async handleMessage(message: Message): Promise<void> {
    const body = JSON.parse(String(message.Body)) as Partial<VehicleEntity>[];

    const vehicles = Array.isArray(body) ? body : [body];

    for (const vehicle of vehicles) {
      try {
        await this.vehicleService.create(vehicle as VehicleEntity);
      } catch (error) {
        console.error('Error to create vehicle: ', vehicle.placa, error);
      }
    }
  }
}
