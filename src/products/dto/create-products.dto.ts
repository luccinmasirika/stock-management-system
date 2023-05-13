import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    type: String,
    format: 'string',
    example: 'Product Name',
  })
  name: string;

  @ApiProperty({
    type: String,
    format: 'string',
    example: 'Product Description',
  })
  description: string;

  @ApiProperty({
    type: String,
    format: 'string',
    example: '200',
  })
  purchasedPrice: number;

  @ApiProperty({
    type: String,
    format: 'string',
    example: '230',
  })
  sellingPrice: number;

  @ApiProperty({
    type: String,
    format: 'string',
    example: 'iPhone',
  })
  category: string;

  @ApiProperty({
    type: String,
    format: 'string',
    example: 'Cedric ',
  })
  supplier: string;
}
