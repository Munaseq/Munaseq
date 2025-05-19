import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [ChatService],
})
export class ChatModule {}
