import { ApiProperty } from '@nestjs/swagger';

export class CreateSaleDto {
  @ApiProperty({
    type: String,
    format: 'string',
    example: '0369fa79-2c1a-48eb-8414-6841b609ff10',
  })
  seller: string;
  @ApiProperty({
    type: String,
    format: 'string',
    example: '0369fa79-2c1a-48eb-8414-6841b609ff10',
  })
  reference: string;
  @ApiProperty({
    type: String,
    format: 'string',
    example: '0369fa79-2c1a-48eb-8414-6841b609ff10',
  })
  clientName: string;
  @ApiProperty({
    type: String,
    format: 'string',
    example: '0369fa79-2c1a-48eb-8414-6841b609ff10',
  })
  clientPhone: string;
  @ApiProperty({
    type: String,
    format: 'string',
    example: '',
  })
  description: string;
  @ApiProperty({
    type: Number,
    format: 'number',
    example: 12,
  })
  totalAmount: number;
  @ApiProperty({
    type: Number,
    format: 'number',
    example: 15,
  })
  amountPaid: number;
  @ApiProperty({
    type: Number,
    format: 'number',
    example: 150,
  })
  amountDue: number;
  @ApiProperty({
    type: Array,
    format: 'array',
    example: [],
  })
  products: Array<any>;
}
