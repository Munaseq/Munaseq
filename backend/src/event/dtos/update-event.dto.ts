// src/event/dtos/create-event.dto.ts
import { Gender } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDate,
  IsInt,
  IsArray,
  IsEnum,
  IsBoolean,
} from 'class-validator';

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  categories?: string[];

  @IsString()
  @IsOptional()
  location?: string;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  startDateTime?: Date;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  endDateTime?: Date;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  seatCapacity?: number;

  @IsOptional()
  @IsBoolean()
  isOnline?: boolean;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsEnum(Gender)
  @IsNotEmpty()
  gender?: Gender;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  price?: number;
}
