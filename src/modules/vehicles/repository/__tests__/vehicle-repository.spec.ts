/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VehicleModel } from '../../model/vehicle.schema';
import { VehicleRepository } from '../vehicle.repository';
import { VehicleEntity } from '../../entities/vehicle.entity';

describe('VehicleRepository', () => {
  let repository: VehicleRepository;
  let vehicleModel: Model<VehicleModel>;

  const mockVehicle = {
    _id: '1',
    placa: 'LWM7753',
    modelo: 'M-100 1.0 8v 5p',
    marca: 'EFFA',
    ano: 2024,
    chassi: '2TETFDAEYF89V8796',
    renavam: '84762336910',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockVehicleEntity = new VehicleEntity({
    ...mockVehicle,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleRepository,
        {
          provide: getModelToken('Vehicle'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockVehicle),
            constructor: jest.fn().mockResolvedValue(mockVehicle),
            create: jest.fn().mockResolvedValue({
              save: jest.fn().mockResolvedValue(mockVehicle),
            }),
            updateOne: jest
              .fn()
              .mockResolvedValue({ upsertedId: { _id: '1' } }),
            findOne: jest.fn().mockResolvedValue(mockVehicle),
            find: () => ({
              skip: () => ({
                limit: jest.fn().mockResolvedValue([mockVehicle]),
              }),
            }),
            countDocuments: jest.fn().mockResolvedValue(1),
          },
        },
      ],
    }).compile();

    repository = module.get<VehicleRepository>(VehicleRepository);
    vehicleModel = module.get<Model<VehicleModel>>(getModelToken('Vehicle'));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should create a new vehicle', async () => {
    const input = {
      placa: 'LWM7753',
      modelo: 'M-100 1.0 8v 5p',
      marca: 'EFFA',
      ano: 2024,
      chassi: '2TETFDAEYF89V8796',
      renavam: '84762336910',
    };

    const createdVehicle = await repository.create(input);

    expect(createdVehicle).toEqual(mockVehicleEntity);
    expect(vehicleModel.create).toHaveBeenCalledWith(input);
  });

  it('should update a vehicle', async () => {
    const input = {
      placa: 'LWM7753',
      modelo: 'M-100 1.0 8v 5p',
      marca: 'EFFA',
      ano: 2024,
      chassi: '2TETFDAEYF89V8796',
      renavam: '84762336910',
    };

    const updatedVehicle = await repository.update('1', input);

    expect(updatedVehicle).toEqual({ _id: '1' });
    expect(vehicleModel.updateOne).toHaveBeenCalledWith(
      { _id: '1' },
      { $set: input },
    );
  });

  it('should find a vehicle by query', async () => {
    const query = { placa: 'LWM7753' };

    const vehicle = await repository.getOneByQuery(query);

    expect(vehicle).toEqual(mockVehicleEntity);
    expect(vehicleModel.findOne).toHaveBeenCalledWith(query);
  });

  it('should mark a vehicle as deleted', async () => {
    await repository.delete('1');

    expect(vehicleModel.updateOne).toHaveBeenCalledWith(
      { _id: '1' },
      { $set: { deletedAt: expect.any(Date) } },
    );
  });

  it('should list vehicles with pagination and filters', async () => {
    const query = { limit: 10, page: 1, search: 'test' };
    const filters = { deletedAt: null };

    const response = await repository.list(query, filters);

    expect(response.data).toEqual([mockVehicleEntity]);
    expect(response.pages).toBe(1);
    expect(response.total).toBe(1);
    expect(vehicleModel.countDocuments).toHaveBeenCalledWith(filters);
  });

  it('should list vehicles with pagination and filters without search', async () => {
    const query = { limit: 10, page: 1 };
    const filters = { deletedAt: null };

    const response = await repository.list(query, filters);

    expect(response.data).toEqual([mockVehicleEntity]);
    expect(response.pages).toBe(1);
    expect(response.total).toBe(1);
    expect(vehicleModel.countDocuments).toHaveBeenCalledWith(filters);
  });
});
