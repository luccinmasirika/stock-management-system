import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { PrismaService } from '../prisma/prisma.service';
import sizeOf from 'image-size';

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}
  async create(createFileDto: CreateFileDto) {
    const { name, url, mime, path, size } = createFileDto;

    if (this.fileIsImage(mime)) {
      const { width, height } = this.getImageSize(path);
      return await this.prisma.files.create({
        data: { name, url, mime, size, width, height },
      });
    }

    return await this.prisma.files.create({
      data: { name, url, mime, size },
    });
  }

  getImageSize(path: string) {
    const dimensions = sizeOf(path);
    return { width: dimensions.width, height: dimensions.height };
  }

  async multiCreate(createFileDto: CreateFileDto[]) {
    return Promise.all(
      createFileDto.map(async (file) => {
        return await this.create(file);
      }),
    );
  }

  findAll() {
    return `This action returns all files`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }

  fileIsImage(mime: string) {
    const imagesMines = ['image/png', 'image/jpeg', 'image/jpg'];
    return imagesMines.includes(mime);
  }
}
