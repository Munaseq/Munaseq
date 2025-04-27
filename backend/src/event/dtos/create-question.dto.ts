import { IsString, IsNotEmpty, IsEnum, IsArray, IsJSON } from 'class-validator';
import { QuestionType } from '@prisma/client';

export class QuizQuestionDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsEnum(QuestionType)
  @IsNotEmpty()
  questionType: QuestionType;

  @IsJSON()
  @IsNotEmpty()
  options: object;

  @IsString()
  @IsNotEmpty()
  correctAnswer: string;
}
