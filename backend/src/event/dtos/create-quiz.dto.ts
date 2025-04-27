import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsArray,
  IsString,
  IsDate,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { QuizQuestionDto } from './create-question.dto';

export class CreateQuizDto {
  @IsNotEmpty()
  @IsString()
  quizTitle: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  startDate: Date;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  endDate: Date;

  @IsNotEmpty()
  @IsInt()
  timeLimit: number;

  @IsArray()
  @IsNotEmpty({ each: true })
  @Type(() => QuizQuestionDto)
  questions: QuizQuestionDto[];
}
