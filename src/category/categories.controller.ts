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
import { CreateProductDto } from './dto/create-categories.dto';
import { CategoriesService } from './categories.service';

@ApiTags('Categories')
@Controller('configurations/promotions')
export class CategoriesController {
  constructor(private readonly category: CategoriesService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.category.create(createProductDto);
  }

  @Get()
  async findAll() {
    return await this.category.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.category.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() createProductDto: CreateProductDto,
  ) {
    return await this.category.update(id, createProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.category.remove(id);
  }
}
