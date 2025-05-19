import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UpdateAssignmentQuestionDTO } from './update-assignment-question.dto';
import * as moment from 'moment-timezone';

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
  @Transform(({ value }) => {
    const localDate = new Date(value); // Parse the input date
    const utcDate = new Date(
      localDate.getTime() - localDate.getTimezoneOffset() * 60000,
    ); // Convert to UTC
    return utcDate;
  })
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => {
    const localDate = new Date(value); // Parse the input date
    const utcDate = new Date(
      localDate.getTime() - localDate.getTimezoneOffset() * 60000,
    ); // Convert to UTC
    return utcDate;
  })
  endDate?: Date;
}
