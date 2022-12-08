import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateProviderDto {
  @ApiProperty({
    type: String,
    format: 'string',
    example: '1bb76949-18ef-499e-9a81-29edeed8b184',
  })
  @IsString()
  product: string;

  @ApiProperty({
    type: String,
    format: 'string',
    example: 'Description provide',
  })
  @IsString()
  description: string;

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
    example: '1bb76949-18ef-499e-9a81-29edeed8b184',
  })
  @IsString()
  provider: string;

  @ApiProperty({
    type: String,
    format: 'string',
    example: '1bb76949-18ef-499e-9a81-29edeed8b184',
  })
  @IsString()
  recipient: string;
}
