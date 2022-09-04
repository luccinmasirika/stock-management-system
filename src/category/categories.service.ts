import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-categories.dto';
import { UpdateProductDto } from './dto/update-categories.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createConfigurationDto: CreateProductDto) {
    const { name, description } = createConfigurationDto;
    return await this.prisma.category.create({
      data: {
        name,
        description,
      },
    });
  }

  async findAll() {
    return await this.prisma.category.findMany({
      orderBy: [{ createdAt: 'desc' }],
    });
  }

  async findOne(id: string) {
    return await this.prisma.category.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return await this.prisma.category.update({
      where: { id },
      data: { ...updateProductDto },
    });
  }

  async remove(id: string) {
    return await this.prisma.category.delete({ where: { id } });
  }
}
