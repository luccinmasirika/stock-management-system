import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    type: String,
    format: 'string',
    example: 'Category Name',
  })
  name: string;

  @ApiProperty({
    type: String,
    format: 'string',
    example: 'Category Description',
  })
  description: string;
}
