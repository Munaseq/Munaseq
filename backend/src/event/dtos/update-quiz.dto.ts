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

export class UpdateQuizDto {
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
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
