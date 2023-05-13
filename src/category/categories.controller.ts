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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-categories.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly category: CategoriesService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.category.create(createCategoryDto);
  }

  @Get()
  async findAll(@Query('search') search: string) {
    return await this.category.findAll(search);
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
