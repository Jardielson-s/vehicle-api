import { IsString, IsInt, Min, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ValidateCurrentYearValidator } from 'src/utils/validate-current-year.validator';

export class CreateVehicleDto {
  @ApiProperty({ example: 'LWM7753', description: 'Plate vehicle' })
  @IsString({ message: 'The plate must a string' })
  @Matches(/^[A-Z]{3}(?:[0-9]{4}|[0-9][A-Z][0-9]{2})$/, {
    message: 'The plate format must follow the new and old mercosul format',
  })
  placa: string;

  @ApiProperty({
    example: '2TETFDAEYF89V8796',
    description: 'Chassi number',
  })
  @IsString({ message: 'The chassi must be a string' })
  @Matches(/^[A-Za-z0-9]{17}$/, {
    message: 'the chassi must have 17 caracters',
  })
  chassi: string;

  @ApiProperty({
    example: '84762336910',
    description: 'Renavam number must have 11 dígitos',
  })
  @IsString({ message: 'The renavam number must be a string' })
  @Matches(/^\d{11}$/, {
    message: 'The Renavam number must has 11 digits',
  })
  renavam: string;

  @ApiProperty({ example: 'M-100 1.0 8v 5p', description: 'Vehicle model' })
  @IsString({ message: 'The model must be a string' })
  modelo: string;

  @ApiProperty({ example: 'EFFA', description: 'Vehicle brand' })
  @IsString({ message: 'The brand must be a string' })
  marca: string;

  @ApiProperty({ example: 2024, description: 'Manufacture year' })
  @IsInt({ message: 'The manufacture year must be a integer' })
  @Min(1886, {
    message: 'The manufacture year must be equal or greater than 1886',
  })
  @ValidateCurrentYearValidator({
    message: 'The year do not be greater than current year',
  })
  ano: number;
}
