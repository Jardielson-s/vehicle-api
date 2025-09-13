import { IRepository, ListResponse } from 'src/shared/repositories.interface';
import { VehicleEntity } from '../entities/vehicle.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import { VehicleModel } from '../model/vehicle.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VehicleRepository
  implements IRepository<Partial<VehicleEntity>, VehicleEntity>
{
  constructor(
    @InjectModel('Vehicle')
    private readonly vehicleModel: Model<VehicleModel>,
  ) {}

  async create(input: Partial<VehicleEntity>): Promise<VehicleEntity> {
    const opertion = await this.vehicleModel.create(input);
    const data = await opertion.save();
    return new VehicleEntity({
      ...data,
    });
  }

  async update(
    id: string,
    input: Partial<VehicleEntity>,
  ): Promise<{ _id: string | undefined }> {
    const data = await this.vehicleModel.updateOne(
      { _id: id },
      { $set: { ...input } },
    );
    return { _id: data.upsertedId?._id.toString() };
  }

  async getOneByQuery(
    query: RootFilterQuery<VehicleEntity>,
  ): Promise<VehicleEntity | null> {
    const data = await this.vehicleModel.findOne(query);
    if (!data?._id) return null;
    return new VehicleEntity({
      _id: data._id,
      ano: data.ano,
      chassi: data.chassi,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
      marca: data.marca,
      modelo: data.modelo,
      placa: data.placa,
      renavam: data.renavam,
    });
  }

  async delete(id: string): Promise<void> {
    await this.vehicleModel.updateOne(
      { _id: id },
      { $set: { deletedAt: new Date() } },
    );
  }

  async list(
    query: { limit: number; page: number; search?: string },
    filters: RootFilterQuery<VehicleEntity>,
  ): Promise<ListResponse<VehicleEntity>> {
    const search = query.search
      ? {
          $or: [
            { chassi: query.search },
            { renavam: query.search },
            { placa: query.search },
          ],
        }
      : {};
    const filtersObj = {
      ...search,
      deletedAt: null,
    };

    const count = await this.vehicleModel.countDocuments(filters).exec();
    const pageTotal = Math.floor((count - 1) / query.limit) + 1;
    const data = await this.vehicleModel
      .find(filtersObj)
      .skip((query.page - 1) * query.limit)
      .limit(query.limit);

    return {
      data: data,
      pages: pageTotal,
      total: count,
      page: query.page,
    };
  }
}
