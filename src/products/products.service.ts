import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-products.dto';
import { QueryBuilderDto } from './dto/query-builder.dto';
import { UpdateProductDto } from './dto/update-products.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createConfigurationDto: CreateProductDto) {
    const { name, description, category, purchasedPrice, sellingPrice } =
      createConfigurationDto;
    return await this.prisma.product.create({
      data: {
        name,
        description,
        category: { connect: { id: category } },
        purchasedPrice,
        sellingPrice,
      },
      include: { category: true },
    });
  }

  async findAll(query: QueryBuilderDto) {
    const products = await this.prisma.product.findMany({
      orderBy: [{ createdAt: 'desc' }],
      where: {
        ...(query?.category && { category: { id: query.category } }),
        ...(query?.search && { matricule: { contains: query.search } }),
      },
      ...(query?.skip && query?.page && { skip: +query.skip * +query.page }),
      ...(query?.skip && { take: +query.skip }),
      include: { category: true },
    });

    const count = await this.prisma.product.count({
      where: {
        ...(query?.category && { category: { id: query.category } }),
        ...(query?.search && { matricule: { contains: query.search } }),
      },
    });

    const meta = {
      pages: Math.ceil(count / +query?.skip),
      count,
    };

    return { data: { products, meta } };
  }

  async findOne(id: string) {
    return await this.prisma.product.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { category } = updateProductDto;
    return await this.prisma.product.update({
      where: { id },
      data: {
        ...updateProductDto,
        ...(category && { category: { connect: { id: category } } }),
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.product.delete({ where: { id } });
  }
}
