import { IsOptional, IsString, IsEnum, IsJSON, IsUUID } from 'class-validator';
import { QuestionType } from '@prisma/client';

export class UpdateAssignmentQuestionDTO {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  text?: string;

  @IsEnum(QuestionType)
  @IsOptional()
  questionType?: QuestionType;

  @IsJSON()
  @IsOptional()
  options?: object;

  @IsString()
  @IsOptional()
  correctAnswer?: string;
}
