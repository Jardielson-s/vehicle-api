/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { VehicleController } from '../vehicle.controller';
import { VehicleService } from '../../services/vehicle.service';
import { VehicleRepository } from '../../repository/vehicle.repository';
import { CreateVehicleDto } from '../../dtos/create-vehicle.dto';
import { UpdateVehicleDto } from '../../dtos/update-vehicle.dto';

describe('VehicleController', () => {
  let controller: VehicleController;
  let service: VehicleService;
  let repository: VehicleRepository;

  const mockResponse = () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
    };
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleController],
      providers: [
        {
          provide: VehicleService,
          useValue: {
            generateTemplate: jest
              .fn()
              .mockResolvedValue(Buffer.from('excel data')),
            create: jest.fn().mockResolvedValue({}),
            processUploadedFile: jest.fn().mockResolvedValue(true),
            findById: jest.fn().mockResolvedValue({}),
            update: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: VehicleRepository,
          useValue: {
            list: jest.fn().mockResolvedValue([]),
            delete: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    controller = module.get<VehicleController>(VehicleController);
    service = module.get<VehicleService>(VehicleService);
    repository = module.get<VehicleRepository>(VehicleRepository);
  });

  describe('generateTemplate', () => {
    it('should generate an Excel template and send it as a response', async () => {
      const res = mockResponse();
      await controller.generateTemplate(res as any);

      expect(res.set).toHaveBeenCalledWith({
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': expect.any(String),
        'Content-Length': expect.any(Number),
      });
      expect(res.end).toHaveBeenCalledWith(expect.any(Buffer));
    });
  });

  describe('create', () => {
    it('should create a new vehicle', async () => {
      const createVehicleDto: CreateVehicleDto = {
        placa: 'ABC1234',
        chassi: '1234567890',
        renavam: '1234567890',
        modelo: 'Fusca',
        marca: 'Volkswagen',
        ano: 1990,
      };

      await controller.create(createVehicleDto);

      expect(service.create).toHaveBeenCalledWith(createVehicleDto);
    });
  });

  describe('uploadFile', () => {
    it('should return 400 if no file is provided', async () => {
      const res = mockResponse();
      await controller.uploadFile(null, res as any);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'File is required' });
    });

    it('should process the file and return 200', async () => {
      const file = { buffer: Buffer.from('file data') };
      const res = mockResponse();

      await controller.uploadFile(file, res as any);

      expect(service.processUploadedFile).toHaveBeenCalledWith(file.buffer);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'File processed successfully',
      });
    });

    //   const file = { buffer: Buffer.from('file data') };
    //   const res = mockResponse();
    //   const error = new Error('Processing error');
    //   service.processUploadedFile.mockRejectedValueOnce(error);

    //   await controller.uploadFile(file, res as any);

    //   expect(res.status).toHaveBeenCalledWith(500);
    //   expect(res.json).toHaveBeenCalledWith({
    //     message: 'Error processing file',
    //     error: error.message,
    //   });
    // });
  });

  describe('findAll', () => {
    it('should return an empty array when no vehicles found', async () => {
      const query = {};
      const result = await controller.findAll(query as any);

      expect(repository.list).toHaveBeenCalledWith(query, {});
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a vehicle by ID', async () => {
      const vehicleId = new Types.ObjectId().toString();
      await controller.findOne(vehicleId);

      expect(service.findById).toHaveBeenCalledWith(vehicleId);
    });
  });

  describe('update', () => {
    it('should update a vehicle by ID', async () => {
      const vehicleId = new Types.ObjectId().toString();
      const updateVehicleDto: UpdateVehicleDto = {
        placa: 'XYZ9876',
        chassi: '9876543210',
        renavam: '9876543210',
      };

      await controller.update(vehicleId, updateVehicleDto);

      expect(service.update).toHaveBeenCalledWith(vehicleId, updateVehicleDto);
    });
  });

  describe('remove', () => {
    it('should delete a vehicle by ID', async () => {
      const vehicleId = new Types.ObjectId().toString();
      await controller.remove(vehicleId);

      expect(repository.delete).toHaveBeenCalledWith(vehicleId);
    });
  });
});
