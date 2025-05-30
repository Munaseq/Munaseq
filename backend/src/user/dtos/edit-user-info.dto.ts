// src/user/dto/editUser.dto.ts

import { Gender } from '@prisma/client';
import { IsEmail, IsOptional, IsString, IsJSON, IsEnum } from 'class-validator';

export class EditUserInfoDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString({ each: true })
  categories?: string[]; // Array of interests

  @IsOptional()
  @IsString()
  description?: string; // Biography

  @IsOptional()
  @IsJSON()
  socialAccounts?: object; // JSON object for social media accounts
}
