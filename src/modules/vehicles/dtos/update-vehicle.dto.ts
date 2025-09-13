import { IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVehicleDto {
  @ApiProperty({ example: 'LWM-7753', description: 'Plate vehicle' })
  @IsString({ message: 'The plate must a string' })
  @IsOptional()
  @Matches(/^[A-Z]{3}(?:[0-9]{4}|[0-9][A-Z][0-9]{2})$/, {
    message: 'The plate format must follow the new and old mercosul format ',
  })
  placa: string;

  @ApiProperty({
    example: '2tetfDAEYF89v8796',
    description: 'Chassi number',
  })
  @IsOptional()
  @IsString({ message: 'The chassi must be a string' })
  @Matches(/^[A-HJ-NPR-Z0-9]{17}$/, {
    message: 'the chassi must have 17 caracters',
  })
  chassi: string;

  @ApiProperty({
    example: '84762336910',
    description: 'Renavam number must have 11 dígitos',
  })
  @IsOptional()
  @IsString({ message: 'The renavam number must be a string' })
  @Matches(/^\d{11}$/, {
    message: 'The Renavam number must has 11 digits',
  })
  renavam: string;
}
