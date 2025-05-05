import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import * as moment from 'moment-timezone';
import { sendEmailSendGrid } from 'src/utils/aws.uploading';

@Injectable()
export class ReminderService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(ReminderService.name);

  @Cron('00 00 12 * * *', { timeZone: 'Asia/Riyadh' })
  async handleCron() {
    this.logger.log('Running reminder cron job at 12 PM Riyadh time.');

    // Step 1: Get the current date in Riyadh timezone and normalize it to midnight
    const currentDate = moment.tz('Asia/Riyadh').startOf('day').toDate(); // Midnight of the current day
    const nextDate = moment
      .tz('Asia/Riyadh')
      .add(1, 'day')
      .startOf('day')
      .toDate(); // Midnight of the next day

    // Step 2: Retrieve all reminders where the reminderDate matches the current date
    const reminders = await this.prisma.reminder.findMany({
      where: {
        reminderDate: {
          gte: currentDate, // Greater than or equal to midnight of the current day
          lt: nextDate, // Less than midnight of the next day
        },
      },
      include: {
        User: {
          select: {
            firstName: true,
            email: true,
          },
        },
        Event: {
          select: {
            title: true,
            startDateTime: true,
            eventCreator: { select: { email: true } },
          },
        },
      },
    });
    reminders.forEach(async (reminder) => {
      this.logger.log(reminder);
    });
  }
}
