import { ConflictException, Injectable } from '@nestjs/common';
import * as bycrypt from 'bcryptjs';
import { nanoid } from 'nanoid/async';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async register(createUserDto: CreateUserDto) {
    const {
      email,
      password,
      roles,
      avatar,
      firstName,
      lastName,
      phone,
      sex,
      promotion,
    } = createUserDto;
    const hashedPassword = await this.hashPassword(password);

    await this.checkIfEmailIsNotUsed(email);

    const confirmationCode = await nanoid();

    const connectPromotion = {
      promotion: {
        connect: {
          id: promotion,
        },
      },
    };

    const user = await this.prisma.user.create({
      data: {
        email,
        avatar: { connect: { id: avatar } },
        firstName,
        lastName,
        phone,
        sex,
        confirmationCode,
        password: hashedPassword,
        ...connectPromotion,
        roles: {
          create: roles.map((role) => ({
            ...connectPromotion,
            role: {
              connect: {
                id: role,
              },
            },
          })),
        },
      },
    });

    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
      include: {
        roles: { include: { role: true } },
        avatar: true,
        promotion: true,
        students: {
          where: {
            user: {
              email,
            },
          },
          include: {
            faculty: true,
            level: true,
          },
        },
      },
    });

    return {
      ...user,
      roles: user?.roles?.map((el) => el.role),
      students: undefined,
      student: user?.students[0],
    };
  }

  async findOneById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async getUsers() {
    return await this.prisma.user.findMany({
      include: {
        roles: {
          include: {
            promotion: true,
            role: true,
          },
        },
        promotion: true,
      },
    });
  }

  async hashPassword(pwd: string) {
    return await bycrypt.hash(pwd, 10);
  }

  async activateAccount(code: string) {
    return await this.prisma.user.update({
      where: { confirmationCode: code },
      data: {
        accountStatus: 'ACTIVE',
        confirmationCode: undefined,
      },
    });
  }

  async activateUser(id: string) {
    return await this.prisma.user.update({
      where: { id },
      data: {
        accountStatus: 'ACTIVE',
      },
    });
  }

  async disableAccount(id: string) {
    return await this.prisma.user.update({
      where: { id },
      data: {
        accountStatus: 'DISABLED',
      },
    });
  }

  async deleteAccount(id: string) {
    return await this.prisma.user.update({
      where: { id },
      data: {
        accountStatus: 'DELETED',
      },
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

  async sendConfirmationEmail(email: string) {}

  async sendResetPasswordEmail(email: string) {}

  async resetPassword(code: string, password: string) {}

  async sendWelcomeEmail(email: string) {}

  async sendGoodbyeEmail(email: string) {}

  async sendPasswordChangedEmail(email: string) {}

  async sendAccountDisabledEmail(email: string) {}

  async sendAccountDeletedEmail(email: string) {}

  async sendAccountEnabledEmail(email: string) {}

  async sendAccountPendingEmail(email: string) {}
}
