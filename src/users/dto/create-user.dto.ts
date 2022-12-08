import { ApiProperty } from '@nestjs/swagger';
import type { AccountStatus, Role } from '@prisma/client';
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

  @IsOptional()
  @IsString({ each: true })
  @ApiProperty({
    type: Array,
    format: 'string',
    example: 'ADMIN',
  })
  role: Role;

  status?: AccountStatus;
}
