import { Module } from '@nestjs/common';
import { ProductController } from './controller/product.controller';
import { ProductService } from './service/product.service';
import { QueryValidationPipe } from './pipes/query-validation.pipe';

@Module({
  controllers: [ProductController],
  providers: [ProductService, QueryValidationPipe],
})
export class ProductsModule {}
