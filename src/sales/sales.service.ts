import { BadRequestException, Injectable } from '@nestjs/common';
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

    for (let i = 0; i < products.length; i++) {
      await this.providerService.checkIfOutOfStock(
        products[i]?.product,
        seller,
        products[i]?.quantity,
      );
    }

    await Promise.all(
      products.map((el) => {
        this.providerService.decrementStock(el?.product, seller, el?.quantity);
      }),
    );

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
          OR: [
            {
              facture: { reference: { contains: query.search } },
            },
            {
              facture: {
                products: {
                  some: { product: { name: { contains: query.search } } },
                },
              },
            },
            {
              facture: {
                clientName: { contains: query.search },
              },
            },
            {
              seller: {
                firstName: { contains: query.search },
              }
            },
            {
              seller: {
                lastName: { contains: query.search },
              }
            },
            {
              facture: {
                clientPhone: { contains: query.search },
              },
            },
            {
              seller: {
                lastName: { contains: query.search },
              },
            },
          ],
        }),
        ...(query?.seller && { seller: { id: query.seller } }),
        ...(query.status && {
          facture: { amountDue: query.status === 'paid' ? 0 : { gt: 0 } },
        }),
      },
      ...(query?.skip && query?.page && { skip: +query.skip * +query.page }),
      ...(query?.skip && { take: +query.skip }),
      include: {
        facture: {
          include: {
            products: { include: { product: { include: { category: true } } } },
          },
        },
        seller: true,
      },
    });

    const count = await this.prisma.sale.count({
      where: {
        ...(query?.search && {
          OR: [
            {
              facture: { reference: { contains: query.search } },
            },
            {
              facture: {
                products: {
                  some: { product: { name: { contains: query.search } } },
                },
              },
            },
            {
              facture: {
                clientName: { contains: query.search },
              },
            },
            {
              seller: {
                firstName: { contains: query.search },
              }
            },
            {
              seller: {
                lastName: { contains: query.search },
              }
            },
            {
              facture: {
                clientPhone: { contains: query.search },
              },
            },
            {
              seller: {
                lastName: { contains: query.search },
              },
            },
          ],
        }),
        ...(query?.seller && { seller: { id: query.seller } }),
        ...(query.status && {
          facture: { amountDue: query.status === 'paid' ? 0 : { gt: 0 } },
        }),
      },
    });

    const meta = {
      pages: Math.ceil(count / +query?.skip),
      count,
    };

    return { data: { sales, meta } };
  }

  async paye(id: string, amount: number) {
    if (amount <= 0)  throw new BadRequestException('Le montant doit être supérieur à 0')

    const facture = await this.prisma.facture.findUnique({
      where: { id },
      include: { products: true },
    });

    const { totalAmount, amountDue } = facture;

    if (!facture) throw new BadRequestException('Facture not found');

    if (facture.amountDue === 0) throw new BadRequestException('Facture already paid');

    await this.prisma.facture.update({
      where: { id },
      data: {
        amountPaid: amount > amountDue ? totalAmount : { increment: +amount },
        amountDue: amount > amountDue ? 0 : { decrement: +amount },
      },
    });

    return await this.prisma.sale.findFirst({
      where: { factureId: id },
      include: {
        facture: {
          include: {
            products: { include: { product: { include: { category: true } } } },
          },
        },
        seller: true,
      },
    });
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
