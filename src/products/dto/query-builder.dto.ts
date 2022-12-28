import { AccountStatus } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class QueryBuilderDto {
  @IsString()
  @IsOptional()
  date: string;

  @IsString()
  @IsOptional()
  status: AccountStatus;

  @IsString()
  @IsOptional()
  category: string;

  @IsString()
  @IsOptional()
  search: string;

  @IsString()
  @IsOptional()
  skip: string;

  @IsString()
  @IsOptional()
  page: string;
}
