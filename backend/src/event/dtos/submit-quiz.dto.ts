import { IsArray, ValidateNested } from 'class-validator';
import { Answer } from './take-assignment.dto';
import { Transform, Type } from 'class-transformer';

export class SubmitQuizDto {
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Answer)
  answers: Answer[];
}
