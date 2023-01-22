import { IsOptional, IsString } from 'class-validator';

export class QueryBuilderDto {
  @IsString()
  @IsOptional()
  date: string;

  @IsString()
  @IsOptional()
  status: 'paid' | 'pending';

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
