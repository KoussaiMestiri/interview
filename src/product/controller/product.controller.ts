import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common'; // Common Imports
import { ProductService } from '../service/product.service'; // Service Imports
import { ProductDto } from '../dto/product.dto'; // DTO
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger'; // Swagger Imports
import { validate } from 'class-validator'; // Imports the validate function
import { FormattedProduct } from '../interface/product.interface'; // Interfaces
import { QueryValidationPipe } from '../pipes/query-validation.pipe'; // Custom pipes Imports

@Controller('products')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Post('/')
  @ApiCreatedResponse({
    type: ProductDto,
    description: 'Product created successfully',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async create(@Body() product: ProductDto): Promise<ProductDto> {
    try {
      await validate(product); // validate object before inserting to the DB
      return this.productsService.create(product);
    } catch (error) {
      throw new BadRequestException(error.message); // exception error based on the missing or not matched informations
    }
  }

  @Get('/annual_costs')
  @ApiQuery({ name: 'consumption', type: Number })
  @ApiResponse({
    status: 200,
    type: Array<FormattedProduct>,
    description: 'List of annual costs retrieved successfully',
  })
  @UsePipes(QueryValidationPipe) // pipes for validating consumption that should be a number
  findAll(@Query('consumption') consumption: number): Array<FormattedProduct> {
    return this.productsService.getAllProducts(consumption);
  }
}
