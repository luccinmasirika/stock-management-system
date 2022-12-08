import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class SupplyProductDto {
  @ApiProperty({
    type: Number,
    format: 'number',
    example: 23,
  })
  @IsInt()
  quantity: number;

  @ApiProperty({
    type: String,
    format: 'string',
    example: 'Supply from Ug',
  })
  @IsString()
  description: string;
}
