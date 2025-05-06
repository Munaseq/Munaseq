// src/auth/dtos/user-signup.dto.ts
import { Gender } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class userSignUpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @IsNotEmpty()
  @IsString({ each: true })
  categories?: string[]; // Array of interests

  @IsOptional()
  @IsString()
  description?: string; // Biography

  @IsOptional()
  @IsJSON()
  socialAccounts?: object; // JSON object for social media accounts
}
