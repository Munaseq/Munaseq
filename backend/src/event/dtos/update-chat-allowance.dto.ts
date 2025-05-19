import { IsBoolean } from 'class-validator';

export class UpdateChatAllowanceDto {
  @IsBoolean()
  isAttendeesAllowed: boolean;
}
