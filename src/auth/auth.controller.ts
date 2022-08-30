import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getProfile(@Request() req) {
    const user = await this.userService.findOneByEmail(req.user.email);
    delete user.password;
    return user;
  }

  @Get('confirmation/:code')
  async confirmation(@Param('code') code: string) {
    try {
      const response = await this.userService.activateAccount(code);
      console.log(response);
      return 'Confirmation réussie';
    } catch (error: any) {
      console.log(error);
      throw new BadRequestException(error?.response?.message);
    }
  }
}
