import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { VehicleService } from '../services/vehicle.service';
import { CreateVehicleDto } from '../dtos/create-vehicle.dto';
import { FilterVehicleDto } from '../dtos/list-vihecle.dto';
import { VehicleRepository } from '../repository/vehicle.repository';
import { UpdateVehicleDto } from '../dtos/update-vehicle.dto';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehicleController {
  constructor(
    private readonly repository: VehicleRepository,
    private readonly service: VehicleService,
  ) {}

  // @Get('import/excel')
  // @HttpCode(HttpStatus.OK)
  // importFromExcel() {
  //   return this.service.importFromExcel();
  // }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateVehicleDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: FilterVehicleDto) {
    return this.repository.list(query, {});
  }

  @Get(':_id')
  findOne(@Param('_id') _id: string) {
    return this.service.findById(_id);
  }

  @Put(':_id')
  update(@Param('_id') _id: string, @Body() dto: UpdateVehicleDto) {
    console.log(_id);
    return this.service.update(_id, dto);
  }

  @Delete(':_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('_id') _id: string) {
    return this.repository.delete(_id);
  }
}
