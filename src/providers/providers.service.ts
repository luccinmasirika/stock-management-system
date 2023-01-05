import { BadRequestException, Injectable } from '@nestjs/common';
import { ProvideStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { QueryBuilderDto } from './dto/query-builder.dto';

@Injectable()
export class ProvidersService {
  constructor(private readonly prisma: PrismaService) {}

  async provide(createProviderDto: CreateProviderDto) {
    const { product, quantity, recipient, provider, description } =
      createProviderDto;
    const userProvide = await this.decrementStock(product, provider, quantity);
    await this.provideReport(
      product,
      quantity,
      recipient,
      provider,
      description,
    );
    return userProvide;
  }

  async acceptProvide(provideId: string) {
    const { productId, recipientId, quantity } = await this.findOne(provideId);
    const acc = await this.increaseStock(productId, recipientId, quantity);
    await this.updateProvideStatus(provideId, 'ACCEPTED');
    return 'Accepted successfully';
  }

  async rejectProvide(provideId: string) {
    const { productId, providerId, quantity } = await this.findOne(provideId);
    await this.increaseStock(productId, providerId, quantity);
    await this.updateProvideStatus(provideId, 'REJECTED');
    return 'Rejected successfully';
  }

  async updateProvideStatus(provideId: string, status: ProvideStatus) {
    return await this.prisma.provide.update({
      where: { id: provideId },
      data: { status },
    });
  }

  async provideReport(
    product: string,
    quantity: number,
    recipient: string,
    provider: string,
    description: string,
    status?: ProvideStatus,
  ) {
    await this.prisma.provide.create({
      data: {
        product: { connect: { id: product } },
        quantity,
        recipient: { connect: { id: recipient } },
        provider: { connect: { id: provider } },
        description,
        status,
      },
    });
  }

  async findAll(query: QueryBuilderDto) {
    const provides = await this.prisma.provide.findMany({
      orderBy: [{ createdAt: 'desc' }],
      where: {
        ...(query?.category && {
          product: { category: { id: query.category } },
        }),
        ...(query?.search && { product: { name: { contains: query.search } } }),
        ...(query?.provider && { provider: { id: query.provider } }),
        ...(query?.recipient && { recipient: { id: query.recipient } }),
      },
      ...(query?.skip && query?.page && { skip: +query.skip * +query.page }),
      ...(query?.skip && { take: +query.skip }),
      include: {
        product: { include: { category: true } },
        provider: true,
        recipient: true,
      },
    });

    const count = await this.prisma.provide.count({
      where: {
        ...(query?.category && {
          product: { category: { id: query.category } },
        }),
        ...(query?.search && { product: { name: { contains: query.search } } }),
        ...(query?.provider && { provider: { id: query.provider } }),
        ...(query?.recipient && { recipient: { id: query.recipient } }),
      },
    });

    const meta = {
      pages: Math.ceil(count / +query?.skip),
      count,
    };

    return { data: { provides, meta } };
  }

  async getUserProvides(userId: string, query: QueryBuilderDto) {
    const provides = await this.prisma.provide.findMany({
      orderBy: [{ createdAt: 'desc' }],
      where: {
        ...(query?.category && {
          product: { category: { id: query.category } },
        }),
        ...(query?.search && { product: { name: { contains: query.search } } }),
        ...(query?.provider && { provider: { id: query.provider } }),
        OR: [{ recipient: { id: userId } }, { provider: { id: userId } }],
        status: 'PENDING',
      },
      ...(query?.skip && query?.page && { skip: +query.skip * +query.page }),
      ...(query?.skip && { take: +query.skip }),
      include: {
        product: { include: { category: true } },
        provider: true,
        recipient: true,
      },
    });

    const count = await this.prisma.provide.count({
      where: {
        ...(query?.category && {
          product: { category: { id: query.category } },
        }),
        ...(query?.search && { product: { name: { contains: query.search } } }),
        ...(query?.provider && { provider: { id: query.provider } }),
        recipient: { id: userId },
        status: 'PENDING',
      },
    });

    const meta = {
      pages: Math.ceil(count / +query?.skip),
      count,
    };

    return { data: { provides, meta } };
  }

  async findOne(id: string) {
    return await this.prisma.provide.findUnique({ where: { id } });
  }

  async findProductUser({
    productId,
    userId,
  }: {
    productId: string;
    userId: string;
  }) {
    return await this.prisma.myProduct.findFirst({
      where: {
        product: { id: productId },
        user: { id: userId },
      },
      include: { product: { select: { name: true } } },
    });
  }

  async increaseStock(productId: string, userId: string, quantity: number) {
    const product = await this.findProductUser({ productId, userId });
    if (product) {
      return await this.prisma.myProduct.update({
        where: { id: product.id },
        data: { stock: { increment: quantity } },
        include: { product: true },
      });
    }

    return await this.prisma.myProduct.create({
      data: {
        stock: quantity,
        product: { connect: { id: productId } },
        user: { connect: { id: userId } },
      },
      include: { product: { include: { category: true } } },
    });
  }

  async decrementStock(productId: string, userId: string, quantity: number) {
    const product = await this.findProductUser({ productId, userId });

    if (product.stock < quantity) {
      throw new BadRequestException(
        `Vous n'avez pas assez de: ${product.product.name}`,
      );
    }

    return await this.prisma.myProduct.update({
      where: { id: product.id },
      include: { product: { include: { category: true } } },
      data: { stock: { decrement: quantity } },
    });
  }
}
