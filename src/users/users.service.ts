import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AccountStatus } from '@prisma/client';
import * as bycrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async register(createUserDto: CreateUserDto) {
    const { email, firstName, lastName, status, role } = createUserDto;
    const hashedPassword = await this.hashPassword('EbenShop');

    await this.checkIfEmailIsNotUsed(email);

    const user = await this.prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        role,
        status,
      },
    });

    return user;
  }

  async editUser(id: string, updateUserDto: UpdateUserDto) {
    const { role, status, password, ...update } = updateUserDto;
    return await this.prisma.user.update({
      where: { id },
      data: {
        ...update,
        ...(role && { role }),
        ...(status && { status }),
        ...(password && {
          password: await this.hashPassword(password),
        }),
      },
    });
  }

  async findOneByEmail(email: string) {
    return await this.prisma.user.findFirst({
      where: { email },
    });
  }

  async findOneById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async getUsers() {
    return await this.prisma.user.findMany();
  }

  async getSuperAdmin() {
    const test = this.prisma.user.findFirst({
      where: {
        role: 'SUPER_ADMIN',
      },
    });

    return test;
  }

  async getUserInventory(
    userId: string,
    startDate: Date,
    endDate: Date,
    category: string,
    search: string,
  ) {
    let totalAmount = 0;
    let amountDue = 0;
    let amountPaid = 0;
    let provides = 0;
    let sales = 0;
    let stock = 0;
    let purchasedPrice = 0;
    let pa = 0;
    let pv = 0;

    interface Filters {
      createdAt?: {
        gte: Date;
        lte: Date;
      };
      product?: any;
      search?: any;
    }

    const filters: Filters = {};

    if (startDate && endDate) {
      filters.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    if (search) {
      filters.search = {
        product: {
          name: {
            contains: search,
          },
        },
      };
    }

    const getProvides = this.prisma.provide.findMany({
      where: {
        ...filters,
        ...(category && { product: { category: { id: category } } }),
        recipientId: userId,
        status: 'ACCEPTED',
      },
      select: {
        quantity: true,
        product: {
          select: {
            purchasedPrice: true,
            sellingPrice: true,
          },
        },
      },
    });

    const getSales = this.prisma.sale.findMany({
      where: {
        ...filters,
        ...(category && {
          facture: {
            products: {
              some: {
                product: {
                  category: {
                    id: category,
                  },
                },
              },
            },
          },
        }),
        userId,
      },
      select: {
        facture: {
          select: {
            totalAmount: true,
            amountDue: true,
            amountPaid: true,
            products: {
              select: {
                quantity: true,
                product: {
                  select: {
                    purchasedPrice: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const getStocks = this.prisma.myProduct.findMany({
      where: {
        ...filters,
        ...(category && { product: { category: { id: category } } }),
        userId,
      },
      select: {
        stock: true,
      },
    });

    const [providesData, salesData, stockData] = await Promise.all([
      getProvides,
      getSales,
      getStocks,
    ]);

    providesData.forEach((el) => {
      provides += el.quantity;
    });

    stockData.forEach((el) => {
      stock += el.stock;
    });

    providesData.forEach((el) => {
      pv += el.quantity * el.product.sellingPrice;
      pa += el.quantity * el.product.purchasedPrice;
    });

    salesData.forEach((el) => {
      totalAmount += el.facture.totalAmount;
      amountDue += el.facture.amountDue;
      amountPaid += el.facture.amountPaid;
      el.facture.products.forEach((el) => {
        sales += el.quantity;
        purchasedPrice += el.quantity * el.product.purchasedPrice;
      });
    });

    return {
      totalAmount,
      amountDue,
      amountPaid,
      provides,
      sales,
      stock,
      beneficiary: totalAmount - purchasedPrice,
      profit: pv - pa,
      pa,
      pv,
    };
  }

  async getUserInventoryAll(
    userId: string,
    search?: string,
    page?: number,
    startDate?: Date,
    endDate?: Date,
    category?: string,
    one?: boolean,
  ) {
    const searchUser = {
      OR: [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
      ],
    };

    if (one) {
      const inventory = await this.getUserInventory(
        userId,
        startDate,
        endDate,
        category,
        search,
      );

      return {
        data: {
          meta: null,
          inventory: [inventory],
        },
      };
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('Utilisateur introuvable');
    if (user.role === 'SELLER') throw new ForbiddenException('Accès interdit');

    const users = await this.prisma.user.findMany({
      where: {
        ...(search && { ...searchUser }),
      },
      select: { id: true, firstName: true, lastName: true },
    });

    const data = await Promise.all(
      users.map(async (user) => {
        const inventory = await this.getUserInventory(
          user.id,
          startDate,
          endDate,
          category,
          search,
        );
        return { ...user, ...inventory };
      }),
    );

    return {
      data: {
        meta: {
          count: data.length,
        },
        inventory: page ? data.slice(page * 10, page * 10 + 10) : data,
      },
    };
  }

  async hashPassword(pwd: string) {
    return await bycrypt.hash(pwd, 10);
  }

  async accountStatus(id: string, data: { status: AccountStatus }) {
    return await this.prisma.user.update({
      where: { id },
      data: { status: data.status },
    });
  }

  async checkIfEmailIsNotUsed(email: string) {
    const isExistingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (isExistingUser) {
      throw new ConflictException(
        'Cette adresse mail est déjà utilisée par un autre utilisateur',
      );
    }
  }

  async sendResetPasswordEmail(email: string) {}
}
