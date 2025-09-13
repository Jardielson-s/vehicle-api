/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as XLSX from 'xlsx';
import { VehicleEntity } from '../entities/vehicle.entity';
import { VehicleRepository } from '../repository/vehicle.repository';
import { QueueService } from 'src/infra/aws/services/sqs.service';

@Injectable()
export class VehicleService {
  constructor(
    private readonly vehicleRepository: VehicleRepository,
    private readonly queueService: QueueService,
  ) {}

  async create(
    input: Pick<
      VehicleEntity,
      'ano' | 'chassi' | 'marca' | 'modelo' | 'placa' | 'renavam'
    >,
  ): Promise<VehicleEntity> {
    const alreadyExists = await this.vehicleRepository.getOneByQuery({
      $or: [
        { chassi: input.chassi },
        { renavam: input.renavam },
        { placa: input.placa },
      ],
    });
    if (alreadyExists?._id) {
      throw new BadRequestException('Placa, renavam or chassi already exists');
    }
    const data = VehicleEntity.create(input);
    return await this.vehicleRepository.create(data);
  }

  async findById(id: string): Promise<VehicleEntity> {
    const vehicle = await this.vehicleRepository.getOneByQuery({ _id: id });
    if (!vehicle?._id) {
      throw new NotFoundException('Vehicle not found');
    }
    return vehicle;
  }

  async update(
    _id: string,
    input: Partial<VehicleEntity>,
  ): Promise<{ _id: string | undefined }> {
    const vehicle = await this.vehicleRepository.getOneByQuery({
      _id,
    });
    if (!vehicle?._id) {
      throw new NotFoundException('Vehicle not found');
    }
    const alreadyExists = await this.vehicleRepository.getOneByQuery({
      $or: [
        { chassi: input.chassi },
        { renavam: input.renavam },
        { placa: input.placa },
      ],
    });
    if (alreadyExists?._id) {
      throw new BadRequestException('Placa, renavam or chassi already exists');
    }
    return await this.vehicleRepository.update(_id, input);
  }

  generateTemplate(): Promise<Buffer> {
    const header = ['Placa', 'Chassi', 'Renavam', 'Modelo', 'Marca', 'Ano'];

    const dataToExport = header.map((field) => ({
      [field]: '',
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport, { header });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

    return excelBuffer;
  }

  async processUploadedFile(fileBuffer: Buffer): Promise<VehicleEntity[]> {
    try {
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: '',
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, ...data] = jsonData;

      const messages = data.map((row: any) => ({
        placa: row[0],
        chassi: row[1],
        renavam: row[2],
        modelo: row[3],
        marca: row[4],
        ano: row[5],
      })) as VehicleEntity[];

      await this.queueService.sendMessage(messages);
      return messages;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
