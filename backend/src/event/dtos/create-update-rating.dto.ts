import { Type } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

export class CreateUpdateRating {
  @Type(() => Number)
  @Min(0)
  @Max(5)
  @IsNumber()
  rating: number;
}
