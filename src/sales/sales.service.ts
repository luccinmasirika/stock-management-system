import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProvidersService } from 'src/providers/providers.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { QueryBuilderDto } from './dto/query-builder.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';

@Injectable()
export class SalesService {
  constructor(
    private prisma: PrismaService,
    private providerService: ProvidersService,
  ) {}
  async create(createSaleDto: CreateSaleDto) {
    const { seller, products, ...rest } = createSaleDto;

    let i: number = 0;
    do {
      await this.providerService.decrementStock(
        products[i]?.product,
        seller,
        products[i]?.quantity,
      );
      i++;
    } while (products.length > i);

    // create facture
    const facture = await this.prisma.facture.create({
      data: { ...rest },
    });

    await this.prisma.factureProducts.createMany({
      data: products.map((el) => ({
        factureId: facture.id,
        productId: el?.product,
        quantity: el?.quantity,
        sellingPrice: +el?.sellingPrice,
      })),
    });

    await this.prisma.sale.create({
      data: {
        userId: seller,
        factureId: facture.id,
      },
    });

    return 'Payment with Success';
  }

  async findAll(query: QueryBuilderDto) {
    const sales = await this.prisma.sale.findMany({
      orderBy: [{ createdAt: 'desc' }],
      where: {
        ...(query?.search && {
          facture: { reference: { contains: query.search } },
        }),
        ...(query?.seller && { sale: { id: query.seller } }),
      },
      ...(query?.skip && query?.page && { skip: +query.skip * +query.page }),
      ...(query?.skip && { take: +query.skip }),
      include: {
        facture: { include: { products: { include: {product: { include: {category: true} }} } } },
        seller: true,
      },
    });

    const count = await this.prisma.sale.count({
      where: {
        ...(query?.search && {
          facture: { reference: { contains: query.search } },
        }),
        ...(query?.seller && { sale: { id: query.seller } }),
      },
    });

    const meta = {
      pages: Math.ceil(count / +query?.skip),
      count,
    };

    return { data: { sales, meta } };
  }

  findOne(id: number) {
    return `This action returns a #${id} sale`;
  }

  update(id: number, updateSaleDto: UpdateSaleDto) {
    return `This action updates a #${id} sale`;
  }

  remove(id: number) {
    return `This action removes a #${id} sale`;
  }
}
