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
import { CreateProductDto } from './dto/create-products.dto';
import { QueryBuilderDto } from './dto/query-builder.dto';
import { SupplyProductDto } from './dto/supply-product.dto';
import { ProductsService } from './products.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productsService.create(createProductDto);
  }

  @Get()
  async findAll(@Query('_q') query: QueryBuilderDto) {
    return await this.productsService.findAll(query);
  }

  @Get(':id/user-products')
  async findUserProducts(
    @Param('id') id: string,
    @Query('_q') query: QueryBuilderDto,
  ) {
    return await this.productsService.getUserProducts(id, query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() createProductDto: CreateProductDto,
  ) {
    return await this.productsService.update(id, createProductDto);
  }

  @Patch(':id/disable')
  async disable(@Param('id') id: string) {
    return await this.productsService.disable(id);
  }

  @Patch(':productId/supply')
  async supply(
    @Param('productId') productId: string,
    @Body() quantityDto: SupplyProductDto,
  ) {
    return await this.productsService.supply(productId, quantityDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.productsService.remove(id);
  }
}
