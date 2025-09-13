import { Module } from '@nestjs/common';
import { VehiclesModule } from './vehicles/vehicle.module';

@Module({
  imports: [VehiclesModule],
})
export class Contexts {}
