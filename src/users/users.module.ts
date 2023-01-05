import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
