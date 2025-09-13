import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class VehicleModel extends Document<Types.ObjectId> {
  @Prop({ required: true, unique: true })
  placa: string;

  @Prop({ required: true, unique: true })
  chassi: string;

  @Prop({ required: true, unique: true })
  renavam: string;

  @Prop({ required: true })
  modelo: string;

  @Prop({ required: true })
  marca: string;

  @Prop({ required: true })
  ano: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const VehicleSchema = SchemaFactory.createForClass(VehicleModel);
