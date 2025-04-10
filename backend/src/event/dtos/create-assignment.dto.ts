import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateAssignmentQuestionDTO } from './create-assignment-question.dto';
export class CreateAssignment {
  @IsArray()
  @IsNotEmpty({ each: true })
  @Type(() => CreateAssignmentQuestionDTO)
  questions: CreateAssignmentQuestionDTO[];
  @IsDate()
  @Transform(({ value }) => new Date(value))
  startDate: Date;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  endDate: Date;
}
