import { RequestType, RoleType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendRequestDTO {
  @IsString()
  @IsNotEmpty()
  @IsEnum(RequestType)
  requestType: RequestType;
  @IsOptional()
  @IsEnum(RoleType)
  @IsString()
  roleType?: RoleType;
}
