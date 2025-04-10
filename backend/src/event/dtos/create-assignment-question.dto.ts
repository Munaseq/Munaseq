import { QuestionType } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsJSON,
  IsOptional,
} from 'class-validator';

export class CreateAssignmentQuestionDTO {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsEnum(QuestionType)
  @IsNotEmpty()
  questionType: QuestionType;

  @IsJSON()
  @IsOptional()
  options?: object;

  @IsString()
  @IsOptional()
  correctAnswer?: string;
}
