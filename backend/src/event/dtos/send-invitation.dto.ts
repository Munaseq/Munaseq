import { InvitationType, RoleType } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class SendInvitationDTO {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  receiverId: string;

  @IsString()
  @IsNotEmpty()
  invitationType: InvitationType;
  
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  roleType?: RoleType;
}
