import { InvitationType, RoleType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class SendInvitationDTO {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  receiverId: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(InvitationType)
  invitationType: InvitationType;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(RoleType)
  @IsString()
  roleType?: RoleType;
}
