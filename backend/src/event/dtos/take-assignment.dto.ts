import { IsJSON, IsOptional, IsString } from 'class-validator';

export class TakeAssigmentDTO {
  @IsOptional()
  @IsJSON()
  answers?: object;
}
