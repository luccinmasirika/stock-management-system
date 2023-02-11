import { ProvideStatus } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class QueryBuilderDto {
  @IsString()
  @IsOptional()
  startDate: string;

  @IsString()
  @IsOptional()
  endDate: string;

  @IsString()
  @IsOptional()
  seller: string;

  @IsString()
  @IsOptional()
  status: ProvideStatus;

  @IsString()
  @IsOptional()
  category: string;

  @IsString()
  @IsOptional()
  provider: string;

  @IsString()
  @IsOptional()
  recipient: string;

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
