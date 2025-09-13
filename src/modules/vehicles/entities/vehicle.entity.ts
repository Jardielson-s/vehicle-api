import { Types } from 'mongoose';

export class VehicleEntity {
  _id: string | Types.ObjectId;
  placa: string;
  chassi: string;
  renavam: string;
  modelo: string;
  marca: string;
  ano: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(input: VehicleEntity) {
    Object.assign(this, input);
  }

  static create(
    input: Pick<
      VehicleEntity,
      'ano' | 'chassi' | 'marca' | 'modelo' | 'placa' | 'renavam'
    >,
  ): VehicleEntity {
    return new VehicleEntity({
      ...input,
      _id: new Types.ObjectId().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
  }
}
