import { IsOptional, IsString, IsEnum, IsArray } from 'class-validator';
import { QuestionType } from '@prisma/client';

export class UpdateAssignmentQuestionDTO {
  @IsString()
  @IsOptional()
  text?: string;

  @IsEnum(QuestionType)
  @IsOptional()
  questionType?: QuestionType;

  @IsArray()
  @IsOptional()
  options?: object;

  @IsString()
  @IsOptional()
  correctAnswer?: string;
}
