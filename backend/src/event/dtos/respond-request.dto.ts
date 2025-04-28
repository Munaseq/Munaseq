import { IsBoolean, IsNotEmpty } from 'class-validator';

export class RespondRequestDto {
  @IsBoolean()
  @IsNotEmpty()
  decision: boolean;
}
