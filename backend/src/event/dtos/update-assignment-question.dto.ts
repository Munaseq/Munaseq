import {
  IsOptional,
  IsString,
  IsEnum,
  IsJSON,
  IsUUID,
  IsObject,
  IsArray,
} from 'class-validator';
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

  @IsArray()
  @IsOptional()
  options?: object;

  @IsString()
  @IsOptional()
  correctAnswer?: string;
}
