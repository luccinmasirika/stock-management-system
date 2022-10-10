import { ConflictException, Injectable } from '@nestjs/common';
import { AccountStatus } from '@prisma/client';
import * as bycrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async register(createUserDto: CreateUserDto) {
    const { email, firstName, lastName } = createUserDto;
    const hashedPassword = await this.hashPassword('EbenShop');

    await this.checkIfEmailIsNotUsed(email);

    const user = await this.prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    return user;
  }

  async editUser(id: string, updateUserDto: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
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
    return this.prisma.user.findFirst({
      where: {
        role: 'SUPER_ADMIN',
      },
    });
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
