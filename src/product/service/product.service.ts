import { Injectable } from '@nestjs/common'; // Nest Common
import { ProductDto } from '../dto/product.dto'; // Dto
import { FormattedProduct } from '../interface/product.interface'; // Interfaces
import { centsToEuros } from '../helpers'; // Helpers
import * as fs from 'fs'; // File System Package

@Injectable()
export class ProductService {
  private readonly dbPath = 'products.json'; // DB path

  private products: ProductDto[] = this.getProductsFromDB(); // Product intialiazation

  // creatin func from a given product body (validated before inserting to the DB)
  create(product: ProductDto): ProductDto {
    const newProduct = new ProductDto(
      product.tariff_name,
      product.base_costs,
      product.consumption_costs,
      product.cap,
      product.is_cap,
    );
    this.products.push(newProduct);
    this.saveProductsToDB(this.products);
    return newProduct;
  }

  // Get all products service after executing costs calculation
  getAllProducts(consumption: number): Array<FormattedProduct> {
    const data = this.calculateAnnualCost(consumption);
    return data;
  }

  // reformate & calculate costs in addition to sorting before returning the new array
  private calculateAnnualCost(consumption: number): Array<FormattedProduct> {
    const annualProductsCosts = this.products.map((product) => {
      const formatted_column = this.calculateSingleProductAnnualCost(
        product,
        consumption,
      );
      return formatted_column;
    });

    return annualProductsCosts.sort(
      (first_item, second_item) =>
        first_item.annual_cost - second_item.annual_cost,
    );
  }

  // Calculate annual cost for a single product from a given consumption
  private calculateSingleProductAnnualCost(
    product: ProductDto,
    consumption: number,
  ): FormattedProduct {
    if (!consumption)
      return { tariff_name: product.tariff_name, annual_cost: 0 };
    if (product.is_cap) {
      const over_consumption =
        product.cap > consumption ? 0 : consumption - product.cap;
      const over_consumption_cost =
        over_consumption * product.consumption_costs;
      const annual_cost =
        centsToEuros(over_consumption_cost) + product.base_costs;
      return { tariff_name: product.tariff_name, annual_cost: annual_cost };
    }
    const base_annual_cost = 12 * product.base_costs;
    const varied_consumption_costs = consumption * product.consumption_costs;
    const annual_cost =
      base_annual_cost + centsToEuros(varied_consumption_costs);
    return { tariff_name: product.tariff_name, annual_cost: annual_cost };
  }

  // Custom read on DB
  private getProductsFromDB(): ProductDto[] {
    try {
      const data = fs.readFileSync(this.dbPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  // Custom write on DB
  private saveProductsToDB(packages: ProductDto[]): void {
    fs.writeFileSync(this.dbPath, JSON.stringify(packages, null, 2));
  }
}
