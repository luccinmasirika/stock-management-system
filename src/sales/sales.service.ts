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
    function getDateRange(startDate: string, endDate: string) {
      const startOfDay = new Date(startDate).setHours(0, 0, 0, 0);
      const endOfDay = new Date(endDate).setHours(23, 59, 59, 999);
      return {
        gte: new Date(startOfDay),
        lte: new Date(endOfDay),
      };
    }

    function buildWhereClause(query: QueryBuilderDto) {
      let whereClause: any = {};
      const { search, seller, status, category, startDate, endDate } = query;
      if (search) {
        whereClause.OR = [
          { facture: { reference: { contains: search } } },
          {
            facture: {
              products: {
                some: { product: { name: { contains: search } } },
              },
            },
          },
          { facture: { clientName: { contains: search } } },
          { seller: { firstName: { contains: search } } },
          { seller: { lastName: { contains: search } } },
          { facture: { clientPhone: { contains: search } } },
          { seller: { lastName: { contains: search } } },
        ];
      }
      if (seller) {
        whereClause.seller = { id: seller };
      }
      if (status) {
        whereClause.facture = {
          ...whereClause.facture,
          amountDue: status === 'paid' ? 0 : { gt: 0 },
        };
      }
      if (category) {
        whereClause.facture = {
          ...whereClause.facture,
          products: {
            some: { product: { category: { id: category } } },
          },
        };
      }

      if (startDate && endDate) {
        whereClause.createdAt = getDateRange(startDate, endDate);
      }

      return whereClause;
    }

    const whereClause = buildWhereClause(query);
    const { skip, page } = query;
    const sales = await this.prisma.sale.findMany({
      orderBy: [{ createdAt: 'desc' }],
      where: whereClause,
      skip: skip && page && +query.skip * +query.page,
      take: skip && +query.skip,
      include: {
        facture: {
          include: {
            products: { include: { product: { include: { category: true } } } },
            payment: true,
          },
        },
        seller: true,
      },
    });

    let meta = null;
    if (skip) {
      const count = await this.prisma.sale.count({
        where: whereClause,
      });
      meta = {
        pages: Math.ceil(count / +skip),
        count,
      };
    }

    return { data: { sales, meta } };
  }

  async paye(id: string, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException('Le montant doit être supérieur à 0');
    }

    const facture = await this.prisma.facture.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!facture) {
      throw new BadRequestException("La facture n'existe pas");
    }

    if (facture.amountDue === 0) {
      throw new BadRequestException('Facture déjà payée');
    }

    if (amount > facture.amountDue) {
      throw new BadRequestException(
        'Le montant payé ne peut pas dépasser le solde de la facture',
      );
    }

    const newAmountDue = facture.amountDue - amount;

    await this.prisma.facture.update({
      where: { id },
      data: {
        amountPaid: { increment: +amount },
        amountDue: newAmountDue,
        payment: {
          create: {
            amount,
          },
        },
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
