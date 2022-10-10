import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';

@Injectable()
export class ProvidersService {
  constructor(private prisma: PrismaService) {}
  async create(createProviderDto: CreateProviderDto) {
    const { product, quantity, recipient } = createProviderDto;
    await this.prisma.provide.create({
      data: {
        ...createProviderDto,
      },
    });

    await this.prisma.myProduct.update({
      where: { id: product },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    });

    return await this.prisma.myProduct.upsert({
      where: {
        productId_userId: { productId: product, userId: recipient },
      },
      update: {
        stock: { increment: quantity },
      },
      create: {
        stock: quantity,
        product: { connect: { id: product } },
        user: { connect: { id: recipient } },
      },
      include: { product: true },
    });
  }

  findAll() {
    return `This action returns all providers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} provider`;
  }

  update(id: number, updateProviderDto: UpdateProviderDto) {
    return `This action updates a #${id} provider`;
  }

  remove(id: number) {
    return `This action removes a #${id} provider`;
  }

  decrementStock(productId: string, quantity: number) {
    return this.prisma.myProduct.update({
      where: { id: productId },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    });
  }
}
