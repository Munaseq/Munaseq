import { RequestType } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendRequestDTO {
  @IsString()
  @IsNotEmpty()
  requestType: RequestType;
}
