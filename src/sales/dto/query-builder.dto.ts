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
  status: 'paid' | 'pending';

  @IsString()
  @IsOptional()
  category: string;

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
