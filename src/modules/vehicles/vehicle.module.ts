import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VehicleSchema } from './model/vehicle.schema';
import { VehicleController } from './controllers/vehicle.controller';
import { VehicleService } from './services/vehicle.service';
import { VehicleRepository } from './repository/vehicle.repository';
import { InfraModule } from 'src/infra/infra.module';
import { VehicleConsumerService } from './consumers/vehicle.comsumer';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Vehicle', schema: VehicleSchema }]),
    InfraModule,
  ],
  providers: [VehicleRepository, VehicleService, VehicleConsumerService],
  controllers: [VehicleController],
})
export class VehiclesModule {}
