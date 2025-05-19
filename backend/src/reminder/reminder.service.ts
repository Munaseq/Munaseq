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
    // Step 1: Get the current date in Riyadh timezone and normalize it to midnight
    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0); // Set time to midnight UTC

    // Step 2: Calculate the next date (midnight of the next day in UTC)
    const nextDate = new Date(currentDate);
    nextDate.setUTCDate(currentDate.getUTCDate() + 1); // Add one day
    nextDate.setUTCHours(0, 0, 0, 0); // Normalize to midnight UTC

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
            id: true,
            title: true,
            startDateTime: true,
            eventCreator: { select: { email: true } },
          },
        },
      },
    });
    reminders.forEach(async (reminder) => {
      const firstName = reminder.User.firstName;
      const eventTitle = reminder.Event.title;
      const userEmail = reminder.User.email;
      const startDate = reminder.Event.startDateTime.toLocaleDateString(
        'en-CA',
        {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        },
      );
      const eventCreatorEmail = reminder.Event.eventCreator.email;
      await sendEmailSendGrid(
        firstName,
        startDate,
        eventTitle,
        reminder.Event.id,
        userEmail,
        eventCreatorEmail,
      );
    });
  }
}
