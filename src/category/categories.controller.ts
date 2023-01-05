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
import { CreateCategoryDto } from './dto/create-categories.dto';
import { CategoriesService } from './categories.service';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly category: CategoriesService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.category.create(createCategoryDto);
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
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return await this.category.update(id, createCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.category.remove(id);
  }
}
