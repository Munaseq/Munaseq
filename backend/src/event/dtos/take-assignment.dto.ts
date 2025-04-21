import { IsObject } from 'class-validator';

export class TakeAssigmentDTO {
  @IsObject()
  answers: object;
}
