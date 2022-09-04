import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-products.dto';
import { ProductsService } from './products.service';

@ApiTags('Products')
@Controller('configurations/promotions')
export class ProductsController {
  constructor(private readonly promotionsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.promotionsService.create(createProductDto);
  }

  @Get()
  async findAll() {
    return await this.promotionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.promotionsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() createProductDto: CreateProductDto,
  ) {
    return await this.promotionsService.update(id, createProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.promotionsService.remove(id);
  }
}
