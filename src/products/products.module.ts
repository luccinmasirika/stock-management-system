import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
  imports: [UsersModule],
})
export class ProductsModule {}
