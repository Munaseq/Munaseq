import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
declare enum ChatCategory {
    Direct_Message_Chat = "Direct_Message_Chat",
    Group_Message_Chat = "Group_Message_Chat"
}
export declare class ChatService implements OnGatewayConnection, OnGatewayDisconnect {
    private prisma;
    private jwtService;
    private configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    onlineClientsCTU: Map<string, string>;
    onlineClientsUTC: Map<string, string>;
    onlineChats: Map<string, string[]>;
    server: Server;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleChatCreating(client: Socket, { receiverId }: {
        receiverId: string;
    }): Promise<void>;
    handleMessage(client: Socket, { message, chatId, category, }: {
        message: string;
        chatId: string;
        category: ChatCategory;
    }): Promise<void>;
    handleSelectChat(client: Socket, { chatId }: {
        chatId: string;
    }): Promise<void>;
    private handleErrors;
    private extractTokenFromHeader;
}
export {};
