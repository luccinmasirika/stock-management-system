import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { CreateProductDto } from './dto/create-products.dto';
import { QueryBuilderDto } from './dto/query-builder.dto';
import { SupplyProductDto } from './dto/supply-product.dto';
import { UpdateProductDto } from './dto/update-products.dto';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private userService: UsersService,
  ) {}

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
        status: 'ACTIVE',
        ...(query?.category && { category: { id: query.category } }),
        ...(query?.search && { name: { contains: query.search } }),
      },
      ...(query?.skip && query?.page && { skip: +query.skip * +query.page }),
      ...(query?.skip && { take: +query.skip }),
      include: { category: true, supplies: true },
    });

    const count = await this.prisma.product.count({
      where: {
        ...(query?.category && { category: { id: query.category } }),
        ...(query?.search && { name: { contains: query.search } }),
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
      include: { category: true },
    });
  }

  async remove(id: string) {
    return await this.prisma.product.delete({ where: { id } });
  }

  async supply(productId: string, quantityDto: SupplyProductDto) {
    const { quantity, description } = quantityDto;
    try {
      await this.prisma.supply.create({
        data: {
          product: { connect: { id: productId } },
          quantity,
          description,
        },
      });

      const product = await this.prisma.product.update({
        where: { id: productId },
        data: { stock: { increment: quantity } },
        include: { category: true },
      });

      const admin = await this.userService.getSuperAdmin();

      await this.prisma.myProduct.upsert({
        where: {
          productId_userId: { productId, userId: admin.id },
        },
        update: {
          stock: { increment: quantity },
        },
        create: {
          stock: quantity,
          product: { connect: { id: productId } },
          user: { connect: { id: admin.id } },
        },
      });

      return product;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async getUserProducts(userId: string, query: QueryBuilderDto) {
    const products = await this.prisma.myProduct.findMany({
      orderBy: [{ createdAt: 'desc' }],
      where: { user: { id: userId } },
      ...(query?.skip && query?.page && { skip: +query.skip * +query.page }),
      ...(query?.skip && { take: +query.skip }),
      include: { product: { include: { category: true, _count: true } } },
    });

    const count = await this.prisma.myProduct.count({
      where: {
        user: { id: userId },
        ...(query?.category && { category: { id: query.category } }),
        ...(query?.search && { name: { contains: query.search } }),
      },
    });

    const meta = {
      pages: Math.ceil(count / +query?.skip),
      count,
    };

    return { data: { products, meta } };
  }

  async disable(id: string) {
    return await this.prisma.product.update({
      where: { id },
      data: { status: 'DISABLED' },
    });
  }

  async getProductsInStock(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { supplies: true },
    });
    const supplies = product.supplies.map((el) => el.quantity);
    return this.getSumOfArrayNumbers(supplies);
  }

  getSumOfArrayNumbers(array: Array<number>) {
    return array.reduce((acc: number, current: number) => acc + current, 0);
  }
}
