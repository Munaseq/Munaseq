import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UpdateAssignmentQuestionDTO } from './update-assignment-question.dto';

export class UpdateAssignment {
  @IsArray()
  @IsOptional()
  @IsNotEmpty({ each: true })
  @Type(() => UpdateAssignmentQuestionDTO)
  questions?: UpdateAssignmentQuestionDTO[];

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  endDate?: Date;
}
