import { PartialType } from '@nestjs/swagger';
import { CreateSupplierDto } from './create-suppliers.dto';

export class UpdateSupplierDto extends PartialType(CreateSupplierDto) {}
