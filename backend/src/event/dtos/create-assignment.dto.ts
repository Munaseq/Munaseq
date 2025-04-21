import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { AssignmentQuestionDTO } from './create-assignment-question.dto';
export class CreateAssignment {
  @IsNotEmpty()
  @IsString()
  assignmentTitle: string;
  @IsArray()
  @IsNotEmpty({ each: true })
  @Type(() => AssignmentQuestionDTO)
  questions: AssignmentQuestionDTO[];
  @IsDate()
  @Transform(({ value }) => new Date(value))
  startDate: Date;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  endDate: Date;
}
