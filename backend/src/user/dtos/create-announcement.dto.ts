import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAnnouncementDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}
