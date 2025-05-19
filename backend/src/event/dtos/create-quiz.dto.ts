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
  @Transform(({ value }) => {
    const localDate = new Date(value); // Parse the input date
    const utcDate = new Date(
      localDate.getTime() - localDate.getTimezoneOffset() * 60000,
    ); // Convert to UTC
    return utcDate;
  })
  startDate: Date;

  @IsDate()
  @Transform(({ value }) => {
    const localDate = new Date(value); // Parse the input date
    const utcDate = new Date(
      localDate.getTime() - localDate.getTimezoneOffset() * 60000,
    ); // Convert to UTC
    return utcDate;
  })
  endDate: Date;

  @IsNotEmpty()
  @IsInt()
  timeLimit: number;

  @IsArray()
  @IsNotEmpty({ each: true })
  @Type(() => QuizQuestionDto)
  questions: QuizQuestionDto[];
}
