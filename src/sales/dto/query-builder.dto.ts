import { AccountStatus, SaleStatus } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class QueryBuilderDto {
  @IsString()
  @IsOptional()
  date: string;

  @IsString()
  @IsOptional()
  status: SaleStatus;

  @IsString()
  @IsOptional()
  seller: string;

  @IsString()
  @IsOptional()
  facture: string;
  
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
