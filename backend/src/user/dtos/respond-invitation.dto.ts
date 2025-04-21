import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
export class RespondInvitationDto {
  @IsString()
  @IsNotEmpty()
  invitationId: string;

  @IsBoolean()
  decision: boolean;
}
