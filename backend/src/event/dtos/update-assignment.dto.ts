import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UpdateAssignmentQuestionDTO } from './update-assignment-question.dto';

export class UpdateAssignmentDTO {
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateAssignmentQuestionDTO)
  questions?: UpdateAssignmentQuestionDTO[];

  @IsOptional()
  @IsString()
  assignmentTitle?: string;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  endDate?: Date;
}
