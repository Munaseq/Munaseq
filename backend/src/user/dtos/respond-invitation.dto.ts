import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
export class RespondInvitationDto {
  @IsBoolean()
  @IsNotEmpty()
  decision: boolean;
}
