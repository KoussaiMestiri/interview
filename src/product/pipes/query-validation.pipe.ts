import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class QueryValidationPipe implements PipeTransform<any> {
  transform(value: any) {
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) {
      throw new BadRequestException(
        'Consumption parameter should be a valid number.',
      );
    }

    return parsedValue;
  }
}
