import { IsNotEmpty } from 'class-validator';
export class userChangePasswordDto {
  @IsNotEmpty()
  newpassword: string;

  @IsNotEmpty()
  oldpassword: string;
}
