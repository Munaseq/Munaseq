import {
  IsOptional,
  IsInt,
  IsArray,
  ValidateNested,
  IsDate,
  IsString,
} from 'class-validator';
import { UpdateQuestionDto } from './update-question.dto';
import { Transform, Type } from 'class-transformer';
import * as moment from 'moment-timezone';

export class UpdateQuizDto {
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => {
    const localDate = new Date(value); // Parse the input date
    const utcDate = new Date(
      localDate.getTime() - localDate.getTimezoneOffset() * 60000,
    ); // Convert to UTC
    return utcDate;
  })
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => {
    const localDate = new Date(value); // Parse the input date
    const utcDate = new Date(
      localDate.getTime() - localDate.getTimezoneOffset() * 60000,
    ); // Convert to UTC
    return utcDate;
  })
  endDate?: Date;

  @IsString()
  @IsOptional()
  quizTitle?: string;

  @IsOptional()
  @IsInt()
  timeLimit?: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateQuestionDto)
  questions?: UpdateQuestionDto[];
}
