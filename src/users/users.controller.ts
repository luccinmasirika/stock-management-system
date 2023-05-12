import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccountStatus } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Patch(':id/update')
  editUser(@Param('id') id: string, @Body() createUserDto: CreateUserDto) {
    return this.usersService.editUser(id, createUserDto);
  }

  @Get(':id/profile')
  async getUser(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @Get('get/inventory')
  async getUserInventory(
    @Query('userId') userId: string,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('search') search: string,
    @Query('category') category: string,
  ) {
    return this.usersService.getUserInventory(userId, startDate, endDate, category, search);
  }

  @Get('get/inventory/all')
  async getUserInventoryAll(
    @Query('userId') userId: string,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('search') search: string,
    @Query('category') category: string,
    @Query('page') page: number,
    @Query('one') one: boolean,
  ) {
    return this.usersService.getUserInventoryAll(
      userId,
      search,
      +page,
      startDate,
      endDate,
      category,
      one,
    );
  }

  @Get()
  async getUsers() {
    return this.usersService.getUsers();
  }

  @Patch(':id/activate')
  async activate(
    @Param('id') id: string,
    @Body() data: { status: AccountStatus },
  ) {
    await this.usersService.accountStatus(id, data);
    return 'Utilisateur activé avec succès';
  }
}
