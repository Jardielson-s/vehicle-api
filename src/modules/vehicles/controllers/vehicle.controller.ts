/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VehicleService } from '../services/vehicle.service';
import { CreateVehicleDto } from '../dtos/create-vehicle.dto';
import { FilterVehicleDto } from '../dtos/list-vihecle.dto';
import { VehicleRepository } from '../repository/vehicle.repository';
import { UpdateVehicleDto } from '../dtos/update-vehicle.dto';
import { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehicleController {
  constructor(
    private readonly repository: VehicleRepository,
    private readonly service: VehicleService,
  ) {}

  @Get('/generate-template')
  async generateTemplate(@Res() res: Response): Promise<void> {
    const fileName = `vehicles_${new Types.ObjectId().toString()}.xlsx`;

    const excelBuffer = await this.service.generateTemplate();

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename=${fileName}`,
      'Content-Length': excelBuffer.length,
    });

    res.end(excelBuffer);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateVehicleDto) {
    return this.service.create(dto);
  }

  @Post('/upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload do arquivo Excel contendo os dados dos veículos',
    type: 'multipart/form-data',
  })
  @ApiResponse({
    status: 200,
    description: 'Arquivo processado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Arquivo não fornecido ou inválido',
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file, @Res() res: Response): Promise<any> {
    if (!file) {
      return res.status(400).json({ message: 'File is required' });
    }

    try {
      await this.service.processUploadedFile(file.buffer);
      return res.status(200).json({
        message: 'File processed successfully',
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error processing file',
        error: error.message,
      });
    }
  }

  @Get()
  findAll(@Query() query: FilterVehicleDto) {
    return this.repository.list(query, {});
  }

  @Get('/:_id')
  findOne(@Param('_id') _id: string) {
    return this.service.findById(_id);
  }

  @Put('/:_id')
  update(@Param('_id') _id: string, @Body() dto: UpdateVehicleDto) {
    return this.service.update(_id, dto);
  }

  @Delete('/:_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('_id') _id: string) {
    return this.repository.delete(_id);
  }
}
