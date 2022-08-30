import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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

  @Get()
  async getUsers() {
    return this.usersService.getUsers();
  }

  @Patch(':id/disable')
  async disable(@Param('id') id: string) {
    await this.usersService.disableAccount(id);
    return 'Utilisateur désactivé avec succès';
  }

  @Patch(':id/activate')
  async activate(@Param('id') id: string) {
    await this.usersService.activateUser(id);
    return 'Utilisateur activé avec succès';
  }

  @Patch(':id/delete')
  async delete(@Param('id') id: string) {
    await this.usersService.deleteAccount(id);
    return 'Utilisateur supprimé avec succès';
  }
}
