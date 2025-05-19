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
import * as moment from 'moment-timezone';

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
  @Transform(({ value }) => {
    const localDate = new Date(value); // Parse the input date
    const utcDate = new Date(
      localDate.getTime() - localDate.getTimezoneOffset() * 60000,
    ); // Convert to UTC
    return utcDate;
  })
  startDateTime?: Date;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => {
    const localDate = new Date(value); // Parse the input date
    const utcDate = new Date(
      localDate.getTime() - localDate.getTimezoneOffset() * 60000,
    ); // Convert to UTC
    return utcDate;
  })
  endDateTime?: Date;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  seatCapacity?: number;

  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    if (typeof value === 'number') return value === 1;
    return false;
  })
  @IsOptional()
  @IsBoolean()
  isOnline?: boolean;

  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    if (typeof value === 'number') return value === 1;
    return false;
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsEnum(Gender)
  @IsNotEmpty()
  gender?: Gender;


}
