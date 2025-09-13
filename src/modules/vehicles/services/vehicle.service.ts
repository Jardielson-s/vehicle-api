import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { VehicleEntity } from '../entities/vehicle.entity';
import { VehicleRepository } from '../repository/vehicle.repository';

@Injectable()
export class VehicleService {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

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
}
