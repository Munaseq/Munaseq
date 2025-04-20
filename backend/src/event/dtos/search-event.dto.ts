import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class SearchEvent {
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
  title?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsBoolean()
  highestRated?: boolean;
}
