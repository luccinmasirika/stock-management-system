import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bycrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  private async hashMatch(pwd: string, hash: string): Promise<boolean> {
    return await bycrypt.compare(pwd, hash);
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException("Cet utilisateur n'existe pas");
    }
    if (!(await this.hashMatch(password, user.password))) {
      throw new ForbiddenException('Mot de passe incorrect');
    }
    if (user.status === 'DISABLED') {
      throw new ForbiddenException('Votre compte a été désactivé');
    }
    if (user.status === 'DELETED') {
      throw new NotFoundException("Cet utilisateur n'existe pas");
    }
    if (user.status === 'PENDING') {
      throw new ForbiddenException(
        'Vous devez activer votre compte avant de vous connecter',
      );
    }
    return user;
  }

  async login(user: any): Promise<any> {
    const payload = { email: user?.email, password: user?.password };
    const profile = await this.usersService.findOneByEmail(payload.email);
    delete profile.password;
    return {
      jwt: this.jwtService.sign(payload),
      user: profile,
    };
  }
}
