import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Length,
  IsBoolean,
  IsPositive,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  _id: number; // Randomly generated ID property

  @ApiProperty() // tariff_name with it's restrictions
  @IsNotEmpty({ message: 'Tariff name must not be empty' })
  @IsString({ message: 'Tariff name must be a string' })
  @Length(3, 255, { message: 'Tariff name must be at least 3 characters long' })
  readonly tariff_name: string;

  @ApiProperty() // base_costs with it's restrictions
  @IsPositive({ message: 'Base cost name must not be 0' })
  @IsNumber({}, { message: 'Base cost name must not be positive' })
  readonly base_costs: number = 0;

  @ApiProperty() // consumpotion_costs with it's restrictions
  @IsPositive({ message: 'Base cost name must not be 0' })
  @IsNumber({}, { message: 'Consumption costs must be a number' })
  readonly consumption_costs: number;

  @ApiProperty({ required: false, default: 0 }) // cap with it's restrictions intialized with 0
  @IsOptional()
  @IsNumber({}, { message: 'Cap must be a number' })
  readonly cap: number = 0;

  @ApiProperty({ required: false, default: false }) // is_cap with it's restrictions initialized with false
  @IsOptional()
  @IsBoolean()
  readonly is_cap: boolean = false;

  // Getters
  get getId(): number {
    return this._id;
  }
  get getTariffName(): string {
    return this.tariff_name;
  }
  get getBaseCosts(): number {
    return this.base_costs;
  }
  get getConsumptionCosts(): number {
    return this.consumption_costs;
  }
  get getCap(): number {
    return this.cap;
  }
  get getIsCap(): boolean {
    return this.is_cap;
  }

  // Constructor
  constructor(
    tariff_name: string,
    base_costs: number,
    consumption_costs: number,
    cap: number | undefined,
    is_cap: boolean | undefined,
  ) {
    this._id = Math.floor(Math.random() * 100000);
    this.tariff_name = tariff_name;
    this.base_costs = base_costs;
    this.consumption_costs = consumption_costs;
    this.cap = cap !== undefined && cap !== null ? cap : 0;
    this.is_cap = is_cap !== undefined && is_cap !== null ? is_cap : false;
  }
}
