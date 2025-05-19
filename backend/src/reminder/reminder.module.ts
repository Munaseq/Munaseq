import { Module } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({ providers: [ReminderService] })
export class ReminderModule {}
