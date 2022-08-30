import { ApiProperty } from '@nestjs/swagger';
import type { Sex as SexModel } from '@prisma/client';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({
    type: String,
    format: 'email',
    example: 'luccinmasirika@gmail.com',
  })
  email: string;

  @IsString()
  @ApiProperty({
    type: String,
    format: 'string',
    example: '/student-default-dc0d.jpg',
  })
  avatar: string;

  @IsString()
  @ApiProperty({
    type: String,
    format: 'string',
    example: 'Luccin',
  })
  firstName: string;

  @IsString()
  @ApiProperty({
    type: String,
    format: 'string',
    example: 'Masirika',
  })
  lastName: string;

  @IsString()
  @ApiProperty({
    type: String,
    format: 'string',
    example: '+243990312349',
  })
  phone: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    format: 'string',
    example: '1234',
  })
  password?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    format: 'string',
    example: 'cl654s67i0032owumik3cx5pi',
  })
  promotion?: string;

  @IsString()
  @ApiProperty({
    type: String,
    format: 'string',
    example: 'M',
  })
  sex: SexModel;

  @IsOptional()
  @IsString({ each: true })
  @ApiProperty({
    type: Array,
    format: 'string',
    example: ['cl6305aw90000ggumncw5qgcc'],
  })
  roles: string[];
}
