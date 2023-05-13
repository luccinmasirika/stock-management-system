import { ApiProperty } from '@nestjs/swagger';

export class CreateSupplierDto {
  @ApiProperty({
    type: String,
    format: 'string',
    example: 'Product',
  })
  name: string;

  @ApiProperty({
    type: String,
    format: 'string',
    example: 'Supplie Description',
  })
  tel: string;
}
