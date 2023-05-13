import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-suppliers.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { QueryBuilderDto } from './query-builder.dto';

@Injectable()
export class SupplierService {
  constructor(private prisma: PrismaService) {}

  async create(createSupplierDTO: CreateSupplierDto) {
    const { name, tel } = createSupplierDTO;
    return await this.prisma.supplier.create({
      data: {
        name,
        tel,
      },
    });
  }

  async findAll(query?: QueryBuilderDto) {
    const suppliers = await this.prisma.supplier.findMany({
      orderBy: [{ createdAt: 'desc' }],
      where: {
        ...(query?.search && {
          name: {
            contains: query?.search,
          },
        }),
      },
    });
    const count = await this.prisma.supplier.count({
      where: {
        ...(query?.search && { name: { contains: query?.search } }),
      },
    });

    const meta = {
      pages: Math.ceil(count / +query?.skip),
      count,
    };

    return { data: { suppliers, meta } };
  }

  async findOne(id: string) {
    return await this.prisma.supplier.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto) {
    return await this.prisma.supplier.update({
      where: { id },
      data: { ...updateSupplierDto },
    });
  }

  async remove(id: string) {
    return await this.prisma.supplier.delete({ where: { id } });
  }
}
