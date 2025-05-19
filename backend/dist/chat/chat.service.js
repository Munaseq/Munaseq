"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const websockets_1 = require("@nestjs/websockets");
const jwt_1 = require("@nestjs/jwt");
const socket_io_1 = require("socket.io");
var ClientEvents;
(function (ClientEvents) {
    ClientEvents["Chat"] = "Chat";
    ClientEvents["NewChat"] = "NewChat";
    ClientEvents["Chats"] = "Chats";
    ClientEvents["Message"] = "Message";
    ClientEvents["Error"] = "Error";
})(ClientEvents || (ClientEvents = {}));
var ChatCategory;
(function (ChatCategory) {
    ChatCategory["Direct_Message_Chat"] = "Direct_Message_Chat";
    ChatCategory["Group_Message_Chat"] = "Group_Message_Chat";
})(ChatCategory || (ChatCategory = {}));
let ChatService = class ChatService {
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.onlineClientsCTU = new Map();
        this.onlineClientsUTC = new Map();
        this.onlineChats = new Map();
    }
    async handleConnection(client) {
        let userId;
        const request = client.handshake;
        const token = this.extractTokenFromHeader(request);
        try {
            if (!token) {
                throw new common_1.UnauthorizedException('Please provide a token');
            }
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
            userId = payload.sub;
            await this.prisma.user.findUniqueOrThrow({
                where: { id: userId },
                select: { id: true },
            });
            const existClientId = this.onlineClientsUTC.get(userId);
            if (existClientId) {
                const existClient = this.server.sockets.sockets.get(existClientId);
                this.handleDisconnect(existClient);
            }
            this.onlineClientsCTU.set(client.id, userId);
            this.onlineClientsUTC.set(userId, client.id);
            const directChats = await this.prisma.chat.findMany({
                where: {
                    Users: {
                        some: {
                            id: {
                                in: [userId],
                            },
                        },
                    },
                    category: 'Direct_Message_Chat',
                },
                select: {
                    id: true,
                    category: true,
                    Users: {
                        where: {
                            id: { not: userId },
                        },
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            username: true,
                            profilePictureUrl: true,
                        },
                    },
                    Messages: {
                        take: 1,
                        select: {
                            content: true,
                            createdAt: true,
                            Sender: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    username: true,
                                    profilePictureUrl: true,
                                },
                            },
                        },
                        orderBy: { createdAt: 'desc' },
                    },
                },
                orderBy: { updatedAt: 'desc' },
            });
            const EventChats = await this.prisma.chat.findMany({
                where: {
                    Users: {
                        some: {
                            id: {
                                in: [userId],
                            },
                        },
                    },
                    category: 'Group_Message_Chat',
                },
                select: {
                    id: true,
                    category: true,
                    isAttendeesAllowed: true,
                    Event: {
                        select: {
                            id: true,
                            title: true,
                            imageUrl: true,
                            eventCreator: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    username: true,
                                    profilePictureUrl: true,
                                },
                            },
                        },
                    },
                    Messages: {
                        take: 1,
                        select: {
                            content: true,
                            createdAt: true,
                            Sender: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    username: true,
                                    profilePictureUrl: true,
                                },
                            },
                        },
                        orderBy: { createdAt: 'desc' },
                    },
                },
                orderBy: { updatedAt: 'desc' },
            });
            let chats = {
                directChats: [],
                eventChats: [],
            };
            if (directChats.length > 0 || EventChats.length > 0) {
                directChats.forEach((chat) => {
                    const chatOnlineUsers = this.onlineChats.get(chat.id);
                    if (chatOnlineUsers) {
                        chatOnlineUsers.push(client.id);
                        client.join(chat.id);
                    }
                    if (chat.Messages.length > 0) {
                        chats.directChats.push(chat);
                    }
                });
                EventChats.forEach((chat) => {
                    const chatOnlineUsers = this.onlineChats.get(chat.id);
                    if (chatOnlineUsers) {
                        chatOnlineUsers.push(client.id);
                        client.join(chat.id);
                    }
                    chats.eventChats.push(chat);
                });
                client.emit(ClientEvents.Chats, chats);
            }
            else {
                client.emit(ClientEvents.Chats, chats);
            }
        }
        catch (err) {
            this.handleErrors(client, err, true);
        }
    }
    handleDisconnect(client) {
        const userId = this.onlineClientsCTU.get(client.id);
        this.onlineChats.forEach((onlineChatClientIds, chatId) => {
            const userIndex = onlineChatClientIds.findIndex((clientId) => clientId === client.id);
            if (userIndex !== -1) {
                if (onlineChatClientIds.length === 1) {
                    this.onlineChats.delete(chatId);
                }
                else {
                    onlineChatClientIds.splice(userIndex, 1);
                }
            }
        });
        this.onlineClientsUTC.delete(userId);
        this.onlineClientsCTU.delete(client.id);
        client.disconnect(true);
    }
    async handleChatCreating(client, { receiverId }) {
        try {
            const senderId = this.onlineClientsCTU.get(client.id);
            if (!receiverId || senderId === receiverId) {
                throw new common_1.NotFoundException('Please ensure that you provide a receiverId or correct receiverId');
            }
            let receiver = await this.prisma.user.findUnique({
                where: { id: receiverId },
            });
            if (!receiver) {
                throw new common_1.NotFoundException('Please ensure that you provide a correct receiverId');
            }
            let room = await this.prisma.chat.findFirst({
                where: {
                    category: ChatCategory.Direct_Message_Chat,
                    AND: [
                        {
                            Users: {
                                some: {
                                    id: senderId,
                                },
                            },
                        },
                        {
                            Users: {
                                some: {
                                    id: receiverId,
                                },
                            },
                        },
                    ],
                },
                select: {
                    id: true,
                },
            });
            if (!room?.id) {
                const usersIds = await this.prisma.user.findMany({
                    where: {
                        id: {
                            in: [senderId, receiverId],
                        },
                    },
                    select: { id: true },
                });
                room = await this.prisma.chat.create({
                    data: {
                        Users: { connect: usersIds },
                        category: ChatCategory.Direct_Message_Chat,
                    },
                    select: {
                        id: true,
                        Users: {
                            where: {
                                id: receiverId,
                            },
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                username: true,
                                profilePictureUrl: true,
                            },
                        },
                    },
                });
            }
            else {
                client.emit(ClientEvents.NewChat, { chatId: room.id });
                return;
            }
            if (!this.onlineChats.get(room.id)) {
                this.onlineChats.set(room.id, []);
            }
            const onlineClientsArray = this.onlineChats.get(room.id);
            client.join(room.id);
            client.emit(ClientEvents.NewChat, { chatId: room.id });
            const receiverClientId = this.onlineClientsUTC.get(receiverId);
            if (receiverClientId) {
                const receiverClient = this.server.sockets.sockets.get(receiverClientId);
                receiverClient.join(room.id);
                receiverClient.emit(ClientEvents.NewChat, { chatId: room.id });
                onlineClientsArray.push(client.id, receiverClientId);
            }
            else {
                onlineClientsArray.push(client.id);
            }
        }
        catch (err) {
            this.handleErrors(client, err);
        }
    }
    async handleMessage(client, { message, chatId, category, }) {
        try {
            const senderId = this.onlineClientsCTU.get(client.id);
            if (!senderId) {
                throw new common_1.BadRequestException("the sender id doesn't exist");
            }
            const onlineClientsArray = this.onlineChats.get(chatId);
            if (!onlineClientsArray || !onlineClientsArray.includes(client.id)) {
                throw new common_1.BadRequestException("The chat isn't online or the sender isn't associated with the chat");
            }
            if (category === ChatCategory.Group_Message_Chat) {
                const chat = await this.prisma.chat.findUnique({
                    where: {
                        id: chatId,
                        category,
                    },
                    select: {
                        category: true,
                        isAttendeesAllowed: true,
                        Event: {
                            select: {
                                eventCreatorId: true,
                                moderators: { select: { id: true } },
                                presenters: { select: { id: true } },
                            },
                        },
                    },
                });
                if (!chat) {
                    throw new common_1.NotFoundException("The chat does not exist, check if you've provided the correct chatId or category");
                }
                if (!chat.isAttendeesAllowed) {
                    const isAssigned = chat.Event.eventCreatorId === senderId ||
                        chat.Event.presenters.some((presenter) => presenter.id === senderId) ||
                        chat.Event.moderators.some((moderator) => moderator.id === senderId);
                    if (!isAssigned) {
                        throw new common_1.BadRequestException('You are not allowed to send a message');
                    }
                }
            }
            const updatedChat = await this.prisma.chat.update({
                where: {
                    id: chatId,
                },
                data: {
                    Messages: {
                        create: {
                            content: message,
                            sender_id: senderId,
                        },
                    },
                },
                select: {
                    Messages: {
                        orderBy: {
                            createdAt: 'desc',
                        },
                        take: 1,
                        select: {
                            content: true,
                            Sender: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    profilePictureUrl: true,
                                    username: true,
                                },
                            },
                            createdAt: true,
                        },
                    },
                },
            });
            const newMessage = updatedChat.Messages[0];
            this.server.to(chatId).emit(ClientEvents.Message, {
                chatId,
                message: newMessage,
            });
        }
        catch (err) {
            this.handleErrors(client, err);
        }
    }
    async handleSelectChat(client, { chatId }) {
        try {
            if (!chatId) {
                throw new common_1.BadRequestException('Please provide chatId');
            }
            const userId = this.onlineClientsCTU.get(client.id);
            if (!userId) {
                throw new common_1.BadRequestException("the sender id doesn't exist");
            }
            const chat = await this.prisma.chat.findUnique({
                where: {
                    id: chatId,
                    Users: {
                        some: {
                            id: userId,
                        },
                    },
                },
                select: {
                    id: true,
                    category: true,
                    isAttendeesAllowed: true,
                    Users: {
                        where: { id: { not: userId } },
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            username: true,
                            profilePictureUrl: true,
                        },
                    },
                    Messages: {
                        select: {
                            content: true,
                            Sender: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    profilePictureUrl: true,
                                    username: true,
                                },
                            },
                            createdAt: true,
                        },
                        orderBy: { createdAt: 'desc' },
                    },
                },
            });
            if (!chat) {
                throw new common_1.NotFoundException("The chat doesn't exist, create a new one");
            }
            const isChatOnline = this.onlineChats.get(chatId);
            if (!isChatOnline) {
                this.onlineChats.set(chatId, []);
                const chatUsersArray = this.onlineChats.get(chatId);
                chatUsersArray.push(client.id);
                client.join(chatId);
                chat.Users.map((user) => {
                    const currClientId = this.onlineClientsUTC.get(user.id);
                    if (currClientId) {
                        chatUsersArray.push(currClientId);
                        const currSocket = this.server.sockets.sockets.get(currClientId);
                        currSocket.join(chatId);
                    }
                });
            }
            client.emit(ClientEvents.Chat, chat);
        }
        catch (err) {
            this.handleErrors(client, err);
        }
    }
    handleErrors(client, error, disconnect) {
        client.emit(ClientEvents.Error, {
            name: error.name || 'Error',
            message: error.message,
        });
        if (disconnect) {
            this.handleDisconnect(client);
        }
    }
    extractTokenFromHeader(request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
};
exports.ChatService = ChatService;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatService.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('NewChat'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatService.prototype, "handleChatCreating", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('Message'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatService.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('SelectChat'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatService.prototype, "handleSelectChat", null);
exports.ChatService = ChatService = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: true,
            methods: ['GET', 'POST'],
            allowedHeaders: '*',
            credentials: true,
        },
    }),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], ChatService);
//# sourceMappingURL=chat.service.js.map