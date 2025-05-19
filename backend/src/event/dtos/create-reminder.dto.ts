import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateReminderDTO {
  @IsNumber()
  @IsNotEmpty()
  daysOffset: number;
}
