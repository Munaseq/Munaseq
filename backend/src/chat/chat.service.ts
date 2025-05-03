import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';

import { Server, Socket } from 'socket.io';

//This an enum of the listened events by the user
enum ClientEvents {
  Chat = 'Chat', // retrieve a chat with its messages and users
  NewChat = 'NewChat', // to join certain chat
  JoinedChats = 'JoinedChats', // to view the joined rooms, means the current sockets' rooms
  Chats = 'Chats', // retrieve all chats in db
  Message = 'Message', // to retrieve a message
  server = 'server', // to listen to server messages -> it recommend that it appears as notification (similar to event creation notification)
  Error = 'Error', // to listen to errors
}
enum ChatCategory {
  Direct_Message_Chat = 'Direct_Message_Chat',
  Group_Message_Chat = 'Group_Message_Chat',
}

/* 
The system shall allow the event creator to make the generated messaging group can be only messaged by the event creator, presenter(s), and moderator(s).

*/

//TODO WHEN APPLYING INVITATION FEATURE ADD THE USER IF HE ACCEPTS

@WebSocketGateway()
@Injectable()
export class ChatService implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  //TODO -> online rooms and check if the available room for the user
  //Map of online users' info, where the key is clientId. CTU => Client To User
  onlineClientsCTU = new Map<string, string>();
  //Map of online users' info, where the key is userId. UTC => User To Client
  onlineClientsUTC = new Map<string, string>();
  //Map of online chats where the value is array of clientsId, it shows the online rooms(AKA chats) and their users
  onlineChats = new Map<string, string[]>();

  //socket.io server instance
  @WebSocketServer()
  server: Server;

  //Function that will listen to every new user connects to the websocket server
  async handleConnection(client: Socket) {
    let userId: string;
    const request = client.handshake;
    const token = this.extractTokenFromHeader(request);

    try {
      if (!token) {
        throw new UnauthorizedException('Please provide a token');
      }
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      userId = payload.sub;
      //check if the userId is valid
      await this.prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: { id: true },
      });
      // Terminate a connection that has the same userId, because the new connection will overwrite the clientId in the onlineClientsUTC therefore the old client will not receive any messages
      const existClientId = this.onlineClientsUTC.get(userId);
      //if there's an existing client, then terminate its connection
      if (existClientId) {
        const existClient = this.server.sockets.sockets.get(existClientId);
        this.handleDisconnect(existClient);
      }

      //Add the user's info to onlineClients maps
      this.onlineClientsCTU.set(client.id, userId);
      this.onlineClientsUTC.set(userId, client.id);

      //Retrieve all chats that user has, and order them based on the las
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

          Messages: { take: 1, orderBy: { createdAt: 'desc' } },
        }, //Retrieve the last message (same as whatsapp)
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

          Messages: { take: 1, orderBy: { createdAt: 'desc' } },
        },
        orderBy: { updatedAt: 'desc' },
      });
      //greeting message ---> REMOVE IT
      client.emit(
        ClientEvents.server,
        `Hello , you're connected successfully `,
      );
      const chats = {
        //group chats and direct chats are separated, because the direct chats are more important (similar to discord's approach )
        directChats,
        EventChats,
      };
      //check if there's a stored chats
      if (chats.directChats.length > 0 || chats.EventChats.length > 0) {
        //If so, send the chats to the client and register him with every online chats

        client.emit(ClientEvents.Chats, chats);
        chats.directChats.map((chat) => {
          const chatOnlineUsers = this.onlineChats.get(chat.id); //return the users of chat if the chat online, else, it will return undefined. NOTE that it's guranteed that every online chat has at least one online user(AKA client)
          if (chatOnlineUsers) {
            chatOnlineUsers.push(client.id); //add the user to the online clients of this chat
            client.join(chat.id);
            client.emit(
              ClientEvents.Chats,
              `You've joined the chat ${chat.id}`, //REMOVE it
            );
          }
        });
        chats.EventChats.map((chat) => {
          const chatOnlineUsers = this.onlineChats.get(chat.id);
          if (chatOnlineUsers) {
            chatOnlineUsers.push(client.id);
            client.join(chat.id);
            client.emit(
              ClientEvents.Chats,
              `You've joined the chat ${chat.id}`, //REMOVE it
            );
          }
        });
      } else {
        client.emit(ClientEvents.server, "You haven't any chat yet..");
      }
    } catch (err) {
      this.handleErrors(client, err, true);
    }
  }
  handleDisconnect(client: Socket) {
    const userId = this.onlineClientsCTU.get(client.id);
    //Dergister the user from every online chat
    this.onlineChats.forEach((onlineChatClientIds, chatId) => {
      //gives me the array of users of this chat and the chat id
      const userIndex = onlineChatClientIds.findIndex(
        (clientId) => clientId === client.id,
      ); //finding user index in this chat
      if (userIndex !== -1) {
        //check if the client is the only client of this chat
        if (onlineChatClientIds.length === 1) {
          //if so, deregister the whole chat
          this.onlineChats.delete(chatId);
          client.emit(ClientEvents.server, `the chat ${chatId} deleted`); //REMOVE IT
        } else {
          onlineChatClientIds.splice(userIndex, 1); //else, deregister the user from the chat users
        }
      }
    });
    this.onlineClientsUTC.delete(userId);
    this.onlineClientsCTU.delete(client.id); //deregister from client related maps

    client.disconnect(true);
  }

  //----------------------------__________-------------------------------------
  //============================| EVENTS |=====================================
  //____________________________----------_____________________________________

  //TODO Leaving rooms -> is it necessary ??

  //Make the client able to create a new chat with other user (Note that eventChats will be automatically created once the event have been created )
  @SubscribeMessage('NewChat')
  async handleChatCreating(
    client: Socket,
    { receiverId }: { receiverId: string },
  ) {
    try {
      //Extracting the senderId
      const senderId = this.onlineClientsCTU.get(client.id);
      let receiver = await this.prisma.user.findUnique({
        where: { id: receiverId },
      });
      if (!receiverId || senderId === receiverId || !receiver?.id) {
        throw new NotFoundException(
          'Please ensure that you provide a correct receiverId',
        );
      }

      //check if there's already a private chat between the users, if so, join both of them in it
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

      //if the users haven't a chat between them, then create a new one
      if (!room?.id) {
        //retrieve users'ids in order to connect them with the new PrivateChat
        const usersIds = await this.prisma.user.findMany({
          where: {
            id: {
              in: [senderId, receiverId],
            },
          },
          select: { id: true },
        });
        //creating a new Chat and connect users to it
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
      } else {
        throw new BadRequestException(
          'You already have a room with the respective receiver Or the rece',
        );
      }
      //add the chat to online chats' map

      //check if the room isn't registered yet
      if (!this.onlineChats.get(room.id)) {
        //register the room
        this.onlineChats.set(room.id, []);
      }
      const onlineClientsArray = this.onlineChats.get(room.id);

      ///TODO: make a online status that is handled by the front-end

      //joining the sender to the direct chat (i.e. room)
      client.join(room.id);
      //Telling the user that you've joined successfully -> REMOVE IT
      client.emit(
        ClientEvents.server,
        `You've joined the room with the id: "${room.id}" successfully`,
      );
      //check if the receiver is online
      const receiverClientId = this.onlineClientsUTC.get(receiverId);
      if (receiverClientId) {
        //joining the receiver to the room by getting its socket via server instance and join him
        const receiverClient =
          this.server.sockets.sockets.get(receiverClientId);
        receiverClient.join(room.id);
        receiverClient.emit(
          ClientEvents.server,
          `You've joined the room with the id: "${room.id}" successfully`,
        );
        onlineClientsArray.push(client.id, receiverClientId);
      } else {
        //only join the sender to the room
        onlineClientsArray.push(client.id);
      }
    } catch (err) {
      this.handleErrors(client, err);
    }
  }

  @SubscribeMessage('Message')
  async handleMessage(
    client: Socket,
    {
      message,
      chatId,
      category,
    }: { message: string; chatId: string; category: ChatCategory },
  ) {
    try {
      const senderId = this.onlineClientsCTU.get(client.id);
      if (!senderId) {
        throw new BadRequestException("the sender id doesn't exist");
      }

      //check if the chat exist and the user has joined it //note that the chat will never be online if its user(s) are offline
      const onlineClientsArray = this.onlineChats.get(chatId);
      if (!onlineClientsArray || !onlineClientsArray.includes(client.id)) {
        throw new BadRequestException(
          "The room isn't online or the sender isn't associated with it  ",
        );
      }
      //check if the messaging feature is allowed or not for the attendees
      if (category === ChatCategory.Group_Message_Chat) {
        const chat = await this.prisma.chat.findUnique({
          where: {
            id: chatId,
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
        //check if the attendees isn't allowed
        if (!chat.isAttendeesAllowed) {
          //if the attendees isn't allowed then check if the sender is assigned
          const isAssigned =
            chat.Event.eventCreatorId === senderId ||
            chat.Event.presenters.some(
              (presenter) => presenter.id === senderId,
            ) ||
            chat.Event.moderators.some(
              (moderator) => moderator.id === senderId,
            );
          //if the user is not assigned then throw an error
          if (!isAssigned) {
            throw new BadRequestException(
              'You are not allowed to send a message',
            );
          }
        }
      }
      // create a message, // This approach of creating through updating is beneficial because it will update "updateAt" attribute every time we create a new message; this is helpful when sorting the chats based on the latest chat that received a message
      await this.prisma.chat.update({
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
      });

      //emitting the message to the chat, the sender will also receive it (front end will check the chatId and senderId to arrange the message bubble to the right place )
      this.server.to(chatId).emit('Message', {
        chatId,
        senderId,
        content: message,
      });

      //check if the client has joined this room
    } catch (err) {
      client.emit(ClientEvents.Error, err.message);
    }
  }
  //If the chat is online, then no need to register the online users because the will be registered once the chat is selected(means the chat goes from offline to onlie)
  @SubscribeMessage('SelectChat')
  async handleSelectChat(client: Socket, { chatId }: { chatId: string }) {
    try {
      if (!chatId) {
        throw new BadRequestException('Please provide chatId');
      }
      const userId = this.onlineClientsCTU.get(client.id);
      if (!userId) {
        throw new BadRequestException("the sender id doesn't exist");
      }
      //retrieve chat messages and users (with execluding to the client)
      const chat = await this.prisma.chat.findUnique({
        where: {
          id: chatId,
          Users: {
            some: {
              id: userId, //ensure that the sender is among the chat's users
            },
          },
        },
        select: {
          id: true,
          Users: {
            //check for all events that the sender is execluded from the retrieved users. When previewing the members of an eventChat the sender's data will be added to the list by the frontend
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
            select: { content: true, sender_id: true, createdAt: true }, //you could also provide the full sender info. (e.g. image, name, etc..) to put it in every message (see suggested Figma design)
            orderBy: { createdAt: 'desc' }, //latest message first
          },
        },
      });
      if (!chat) {
        throw new NotFoundException("The chat doesn't exist");
      }
      const isChatOnline = this.onlineChats.get(chatId);
      if (!isChatOnline) {
        this.onlineChats.set(chatId, []);
        const chatUsersArray = this.onlineChats.get(chatId);
        //register the user first
        chatUsersArray.push(client.id);
        client.join(chatId);
        //joinning other users to the chat
        chat.Users.map((user) => {
          const currClientId = this.onlineClientsUTC.get(user.id);
          if (currClientId) {
            //Check if the user is online
            chatUsersArray.push(currClientId);
            const currSocket = this.server.sockets.sockets.get(currClientId);
            currSocket.join(chatId);
          }
        });
        this.server.emit(
          ClientEvents.server,
          `You now have joined the chat with the id: ${chatId}`,
        );
      }
      client.emit(ClientEvents.Chat, chat);
    } catch (err) {
      client.emit(ClientEvents.Error, err.message);
    }
  }

  // Helper methods
  //disconnecting is a little bit harsh, try to send an error that's handled by the front easily
  private handleErrors(
    client: Socket,

    error: HttpException,
    disconnect?: boolean,
  ) {
    client.emit(ClientEvents.Error, {
      name: error.name || 'Error',
      message: error.message,
    });
    if (disconnect) {
      this.handleDisconnect(client);
    }
  }
  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
//------------------------------

//creating a new event room and join the events's members
// } else {
//   //if the chat is group (means eventId has provided as an argument)

//   //check if there's already a private chat between the users, if so, join both of them in it
//   let room = await this.prisma.chat.findFirst({
//     where: {
//       category: ChatCategory.Group_Message_Chat,
//       Event: {
//         id: eventId,
//         OR: [
//           //will ensures that the sender does partcipate in the event
//           { eventCreatorId: senderId },
//           {
//             joinedUsers: {
//               some: {
//                 id: senderId,
//               },
//             },
//           },
//           {
//             moderators: {
//               some: { id: senderId },
//             },
//           },
//           { presenters: { some: { id: senderId } } },
//         ],
//       },
//     },
//     select: {
//       id: true,
//     },
//   });
//   //if the users haven't a chat between them, then create a new one
//   if (!room?.id) {
//     //retrieve users'ids in order to connect them with the new PrivateChat
//     const usersIds = await this.prisma.user.findMany({
//       where: {
//         id: {
//           in: [senderId, receiverId],
//         },
//       },
//       select: { id: true },
//     });
//     //creating a new PrivateChat and connect users to it
//     room = await this.prisma.chat.create({
//       data: {
//         Users: { connect: usersIds },
//         category: ChatCategory.Direct_Message_Chat,
//       },
//       select: {
//         id: true,
//       },
//     });
//   }
//   //add the chat to online chats' map
//   if (!this.onlineChats.get(room.id)) {
//     //check if the room isn't registered yet
//     this.onlineChats.set(room.id, []);
//     //register the room
//   }
//   ///TODO: make a online status that is handled by the front-end
//   //check if the receiver is online
//   const receiverClientId = this.onlineClientsUTC.get(receiverId);
//   if (receiverClientId) {
//     //joining the sender to the private chat (i.e. room)
//     client.join(room.id);
//     //Telling the user that you've joined successfully
//     client.emit(
//       ClientEvents.server,
//       `You've joined the room with the id: "${room.id}" successfully`,
//     );
//     //joining the receiver to the room by getting its socket via server and join
//     const receiverClient =
//       this.server.sockets.sockets.get(receiverClientId);
//     receiverClient.join(room.id);
//     receiverClient.emit(
//       ClientEvents.server,
//       `You've joined the room with the id: "${room.id}" successfully`,
//     );
//     const onlineClientsArray = this.onlineChats.get(room.id);
//     onlineClientsArray.push(client.id, receiverClientId);
//   } else {
//     //only join the sender to the room
//     client.join(room.id);
//     client.emit(
//       ClientEvents.server,
//       `You've joined the room with the id: "${room.id}" successfully`,
//     );
//     const onlineClientsArray = this.onlineChats.get(room.id);
//     onlineClientsArray.push(client.id);
//   }
//   ///TODO: try to make it generic, meaning that also the group logic is handled by this event
//   ///------------
// }
