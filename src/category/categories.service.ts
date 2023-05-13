import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-categories.dto';
import { UpdateCategoryDto } from './dto/update-categories.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createConfigurationDto: CreateCategoryDto) {
    const { name, description } = createConfigurationDto;
    return await this.prisma.category.create({
      data: {
        name,
        description,
      },
    });
  }

  async findAll(search?: string) {
    return await this.prisma.category.findMany({
      orderBy: [{ createdAt: 'desc' }],
      where: {
        ...(search && {
          name: {
            contains: search,
          },
        }),
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.category.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return await this.prisma.category.update({
      where: { id },
      data: { ...updateCategoryDto },
    });
  }

  async remove(id: string) {
    return await this.prisma.category.delete({ where: { id } });
  }
}
