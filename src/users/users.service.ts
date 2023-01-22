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
    const { role, status, ...update } = updateUserDto;
    return await this.prisma.user.update({
      where: { id },
      data: {
        ...update,
        ...(role && { role }),
        ...(status && { status }),
        ...(updateUserDto.password && {
          password: await this.hashPassword(updateUserDto.password),
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
    period?: 'daily' | 'weekly' | 'monthly' | 'yearly',
  ) {
    let totalAmount = 0;
    let amountDue = 0;
    let amountPaid = 0;
    let provides = 0;
    let sales = 0;
    let stock = 0;

    interface Filters {
      createdAt?: {
        gte: Date;
      };
    }

    const filters: Filters = {};

    switch (period) {
      case 'daily':
        filters.createdAt = {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        };
        break;
      case 'weekly':
        filters.createdAt = {
          gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        };
        break;
      case 'monthly':
        filters.createdAt = {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        };
        break;
      case 'yearly':
        filters.createdAt = {
          gte: new Date(new Date().setDate(new Date().getDate() - 365)),
        };
        break;
    }

    const getProvides = this.prisma.provide.findMany({
      where: {
        ...filters,
        recipientId: userId,
        status: 'ACCEPTED',
      },
      select: {
        quantity: true,
      },
    });

    const getSales = this.prisma.sale.findMany({
      where: {
        ...filters,
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
              },
            },
          },
        },
      },
    });

    const getStocks = this.prisma.myProduct.findMany({
      where: {
        ...filters,
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

    salesData.forEach((el) => {
      totalAmount += el.facture.totalAmount;
      amountDue += el.facture.amountDue;
      amountPaid += el.facture.amountPaid;
      el.facture.products.forEach((el) => {
        sales += el.quantity;
      });
    });

    return {
      totalAmount,
      amountDue,
      amountPaid,
      provides,
      sales,
      stock,
    };
  }

  async getUserInventoryAll(
    userId: string,
    period?: 'daily' | 'weekly' | 'monthly' | 'yearly',
    search?: string,
    page?: number,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('Utilisateur introuvable');
    if (user.role === 'SELLER') throw new ForbiddenException('Accès interdit');

    const searchUser = {
      OR: [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
      ],
    };

    const users = await this.prisma.user.findMany({
      where: {
        ...(search && { ...searchUser }),
      },
      select: { id: true, firstName: true, lastName: true },
    });

    const data = await Promise.all(
      users.map(async (user) => {
        const inventory = await this.getUserInventory(user.id, period);
        return { ...user, ...inventory };
      }),
    );

    return {
      data: {
        meta: {
          count: data.length,
        },
        inventory: data.slice(page * 10, page * 10 + 10),
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
