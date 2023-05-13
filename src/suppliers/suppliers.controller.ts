import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SupplierService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-suppliers.dto';

@ApiTags('Suppliers')
@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplier: SupplierService) {}

  @Post()
  async create(@Body() createsupplierDto: CreateSupplierDto) {
    return await this.supplier.create(createsupplierDto);
  }

  @Get()
  async findAll(@Query('search') search: string) {
    return await this.supplier.findAll(search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.supplier.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() createSupplierDto: CreateSupplierDto,
  ) {
    return await this.supplier.update(id, createSupplierDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.supplier.remove(id);
  }
}
