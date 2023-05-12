import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateSaleDto } from './dto/create-sale.dto';
import { QueryBuilderDto } from './dto/query-builder.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { SalesService } from './sales.service';

@ApiTags('Sales')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@Body() createSaleDto: CreateSaleDto) {
    try {
      return this.salesService.create(createSaleDto);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @Get()
  findAll(@Query('_q') query: QueryBuilderDto) {
    return this.salesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return this.salesService.update(+id, updateSaleDto);
  }

  @Patch('pay/:id/:amount')
  pay(@Param('id') id: string, @Param('amount') amount: number) {
    return this.salesService.paye(id, +amount);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesService.remove(+id);
  }
}
