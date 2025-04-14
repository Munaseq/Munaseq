import { InvitationType, RoleType } from '@prisma/client';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class SendInvitationDTO {
  @IsString()
  @IsUUID()
  receiverId: string;
  @IsString()
  invitationType: InvitationType;
  @IsOptional()
  @IsString()
  roleType?: RoleType;
}
