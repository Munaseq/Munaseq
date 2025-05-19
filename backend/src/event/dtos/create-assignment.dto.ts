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
}
