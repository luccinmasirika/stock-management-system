import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateProviderDto } from './dto/create-provider.dto';
import { QueryBuilderDto } from './dto/query-builder.dto';
import { ProvidersService } from './providers.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Providers')
@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createProviderDto: CreateProviderDto) {
    try {
      return this.providersService.provide(createProviderDto);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @Get()
  findAll(@Query('_q') query: QueryBuilderDto) {
    try {
      return this.providersService.findAll(query);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @Get(':id/user-provides')
  getUserProvides(
    @Param('id') id: string,
    @Query('_q') query: QueryBuilderDto,
  ) {
    try {
      return this.providersService.getUserProvides(id, query);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.providersService.findOne(id);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/accept')
  acceptProvide(@Param('id') id: string) {
    try {
      return this.providersService.acceptProvide(id);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/reject')
  rejectProvide(@Param('id') id: string) {
    try {
      return this.providersService.rejectProvide(id);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
