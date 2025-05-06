import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { EventModule } from './event/event.module';
import { UserController } from './user/user.controller';
import { EventController } from './event/event.controller';
import { UserService } from './user/user.service';
import { EventService } from './event/event.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ReminderService } from './reminder/reminder.service';
import { ReminderModule } from './reminder/reminder.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true, // This makes ConfigModule globally available
    }),
    ScheduleModule.forRoot(),
    UserModule,
    EventModule,
    AuthModule,
    ChatModule,
    ReminderModule,
  ],
  controllers: [AppController, UserController, EventController],
  providers: [AppService, UserService, EventService],
})
export class AppModule {}
