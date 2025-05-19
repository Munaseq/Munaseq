import { Transform, Type } from 'class-transformer';
import { IsArray, IsObject, IsString, ValidateNested } from 'class-validator';

export class TakeAssigmentDTO {
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Answer)
  answers: Answer[];
}
export class Answer {
  @IsString()
  questionTitle: string;

  @IsString()
  answer: string;
}
