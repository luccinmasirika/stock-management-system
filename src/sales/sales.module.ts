import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { ProvidersModule } from 'src/providers/providers.module';

@Module({
  controllers: [SalesController],
  providers: [SalesService],
  imports: [ProvidersModule],
})
export class SalesModule {}
