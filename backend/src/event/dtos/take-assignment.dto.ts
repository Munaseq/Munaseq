import { IsJSON, IsObject, IsOptional, IsString } from 'class-validator';

export class TakeAssigmentDTO {
  @IsObject()
  answers: object;
}
