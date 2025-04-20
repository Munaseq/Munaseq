import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class SeacrhUser {
  @IsOptional()
  @Type(() => Number) // Automatically transforms query string to number
  @IsInt() // Ensures the value is an integer
  pageNumber?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  pageSize?: number;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsBoolean()
  highestRated?: boolean;
}
