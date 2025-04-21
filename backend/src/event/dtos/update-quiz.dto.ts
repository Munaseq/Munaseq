import { IsOptional, IsDateString, IsInt, IsArray } from 'class-validator';
import { UpdateQuestionDto } from './update-question.dto';

export class UpdateQuizDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsInt()
  timeLimit?: number;

  @IsOptional()
  @IsArray()
  questions?: UpdateQuestionDto[];
}
