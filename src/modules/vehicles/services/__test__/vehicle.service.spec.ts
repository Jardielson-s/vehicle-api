import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { VehicleService } from '../vehicle.service';
import { VehicleRepository } from '../../repository/vehicle.repository';
import { VehicleEntity } from '../../entities/vehicle.entity';
import { ConfigService } from '@nestjs/config';
import { QueueService } from 'src/infra/aws/services/sqs.service';

describe('VehicleService', () => {
  let service: VehicleService;

  const mockSqsService = {
    send: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('vehicle-fifo'),
  };

  const mockVehicleEntity = new VehicleEntity({
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
  });

  const mockVehicleRepository = {
    create: jest.fn().mockResolvedValue(mockVehicleEntity),
    getOneByQuery: jest.fn(),
    update: jest.fn().mockResolvedValue({ _id: '1' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleService,
        { provide: VehicleRepository, useValue: mockVehicleRepository },
        { provide: QueueService, useValue: mockSqsService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new vehicle when no duplicate exists', async () => {
      const input = {
        ano: 2024,
        chassi: '2TETFDAEYF89V8796',
        marca: 'EFFA',
        modelo: 'M-100 1.0 8v 5p',
        placa: 'LWM7753',
        renavam: '84762336910',
      };

      mockVehicleRepository.getOneByQuery.mockResolvedValueOnce(null);

      const vehicle = await service.create(input);
      expect(vehicle).toEqual(mockVehicleEntity);
      expect(mockVehicleRepository.create).toHaveBeenCalledWith(
        expect.objectContaining(input),
      );
    });

    it('should throw BadRequestException when vehicle with the same placa, chassi or renavam exists', async () => {
      const input = {
        ano: 2024,
        chassi: '2TETFDAEYF89V8796',
        marca: 'EFFA',
        modelo: 'M-100 1.0 8v 5p',
        placa: 'LWM7753',
        renavam: '84762336910',
      };

      mockVehicleRepository.getOneByQuery.mockResolvedValueOnce(
        mockVehicleEntity,
      );

      await expect(service.create(input)).rejects.toThrow(BadRequestException);
      mockVehicleRepository.getOneByQuery.mockResolvedValueOnce(
        mockVehicleEntity,
      );
      await expect(service.create(input)).rejects.toThrow(
        'Placa, renavam or chassi already exists',
      );
    });
  });

  describe('findById', () => {
    it('should return the vehicle when found', async () => {
      const id = '1';
      mockVehicleRepository.getOneByQuery.mockResolvedValueOnce(
        mockVehicleEntity,
      );

      const vehicle = await service.findById(id);
      expect(vehicle).toEqual(mockVehicleEntity);
      expect(mockVehicleRepository.getOneByQuery).toHaveBeenCalled();
    });

    it('should throw NotFoundException when vehicle not found', async () => {
      const id = '1';
      mockVehicleRepository.getOneByQuery.mockResolvedValueOnce(null);

      await expect(service.findById(id)).rejects.toThrow(NotFoundException);
      await expect(service.findById(id)).rejects.toThrow('Vehicle not found');
    });
  });

  describe('update', () => {
    it('should update the vehicle when found and no duplicate exists', async () => {
      const id = '1';
      const input = {
        placa: 'LWM7753',
        modelo: 'M-100 1.0 8v 5p',
        marca: 'EFFA',
        ano: 2024,
        chassi: '2TETFDAEYF89V8796',
        renavam: '84762336910',
      };

      mockVehicleRepository.getOneByQuery.mockResolvedValueOnce(
        mockVehicleEntity,
      );
      mockVehicleRepository.getOneByQuery.mockResolvedValueOnce(null);

      const updatedVehicle = await service.update(id, input);
      expect(updatedVehicle).toEqual({ _id: '1' });
      expect(mockVehicleRepository.update).toHaveBeenCalledWith(id, input);
    });

    it('should throw NotFoundException when vehicle not found', async () => {
      const id = '1';
      const input = {
        placa: 'LWM7753',
        modelo: 'M-100 1.0 8v 5p',
        marca: 'EFFA',
        ano: 2024,
        chassi: '2TETFDAEYF89V8796',
        renavam: '84762336910',
      };

      mockVehicleRepository.getOneByQuery.mockResolvedValueOnce(null);

      await expect(service.update(id, input)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.update(id, input)).rejects.toThrow(
        'Vehicle not found',
      );
    });

    it('should throw BadRequestException when vehicle with the same placa, chassi or renavam exists', async () => {
      const id = '1';
      const input = {
        placa: 'LWM7753',
        modelo: 'M-100 1.0 8v 5p',
        marca: 'EFFA',
        ano: 2024,
        chassi: '2TETFDAEYF89V8796',
        renavam: '84762336910',
      };

      mockVehicleRepository.getOneByQuery.mockResolvedValueOnce(
        mockVehicleEntity,
      );
      mockVehicleRepository.getOneByQuery.mockResolvedValueOnce(
        mockVehicleEntity,
      );

      await expect(service.update(id, input)).rejects.toThrow(
        BadRequestException,
      );

      mockVehicleRepository.getOneByQuery.mockResolvedValueOnce(
        mockVehicleEntity,
      );
      mockVehicleRepository.getOneByQuery.mockResolvedValueOnce(
        mockVehicleEntity,
      );

      await expect(service.update(id, input)).rejects.toThrow(
        'Placa, renavam or chassi already exists',
      );
    });
  });
});
