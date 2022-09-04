import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-categories.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
