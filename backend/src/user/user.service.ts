import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import * as argon2 from 'argon2';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { EditUserInfoDto, userChangePasswordDto } from './dtos';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  //test it, ecpecially update ALL events' ratings that have been rated by the user, also, update the creators' ratings as well

  async deleteUser(id: string) {
    // it's not necessary,since the event model has Cascade option with the delete option
    // await this.prisma.event.deleteMany({
    //   where: {
    //     eventCreatorId: id,
    //   },
    // });
    //Step 1: find the user and the needed data
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        GiveFeedback: {
          select: {
            Event: {
              select: {
                eventCreator: {
                  select: {
                    id: true,
                    createdEvents: {
                      select: {
                        id: true,
                        GivenFeedbacks: {
                          select: { rating: true },
                          where: { userId: { not: id } },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    //Step 2: check if the user exist
    if (!user) {
      throw new BadRequestException("The user doesn't exist ");
    }
    //Step 3:extract the info and put it into the related array
    let usersToBeUpdated: {
      userId: string;
      avgRating: number;
      Events: { eventId: string; avgRating: number }[];
    }[] = [];
    let updatedUserIds: string[] = [];
    user.GiveFeedback.forEach((item) => {
      const createdEvents = item.Event.eventCreator.createdEvents;
      const userId = item.Event.eventCreator.id;
      //check if the user is already updated
      if (updatedUserIds.length > 0) {
        const isExist = updatedUserIds?.find((id) => userId === id);
        if (!isExist) {
          return;
        }
      }
      //EC stnds for EventCreator
      let ECNumebrOfratings: number = 0;
      let ECSumOfratings: number = 0;

      const eventsToBeUpdated = createdEvents.map((event) => {
        const numberOfRatings = event.GivenFeedbacks.length;
        const sumOfRatings = event.GivenFeedbacks.reduce(
          (sum, curr) => sum + curr.rating,
          0,
        );

        ECNumebrOfratings += numberOfRatings;
        ECSumOfratings += sumOfRatings;
        return {
          eventId: event.id,
          avgRating: numberOfRatings === 0 ? 0 : sumOfRatings / numberOfRatings,
        };
      });
      const avgRating =
        ECNumebrOfratings === 0 ? 0 : ECSumOfratings / ECNumebrOfratings;

      usersToBeUpdated.push({
        userId,
        avgRating,
        Events: eventsToBeUpdated,
      });
      updatedUserIds.push(userId);
    });

    //Step 4: update the users and events ratings
    await Promise.all(
      usersToBeUpdated.map(async (user) => {
        // Update the user's average rating
        await this.prisma.user.update({
          where: { id: user.userId },
          data: { rating: user.avgRating },
        });

        // Update the events associated with the user
        await Promise.all(
          user.Events.map(async (event) => {
            await this.prisma.event.update({
              where: { id: event.eventId },
              data: { rating: event.avgRating },
            });
          }),
        );
      }),
    );
    // Step 5: delete the user
    return this.prisma.user.delete({
      where: {
        id: id,
      },
      omit: {
        password: true,
      },
    });
  }
  // this should be used only in the test environment
  async deleteAll() {
    try {
      const deletedUsers = await this.prisma.user.deleteMany();
      return { count: deletedUsers.count }; // Return the count of deleted users
    } catch (error) {
      throw new HttpException(
        'Error deleting users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: string) {
    try {
      return await this.prisma.user.findUniqueOrThrow({
        where: {
          id,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new HttpException(
          'No account with the provided id has been found',
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByEmail(email: string) {
    try {
      return await this.prisma.user.findUniqueOrThrow({
        where: {
          email,
        },
      });
    } catch (error) {
      // Catch specific errors when a record is not found
      if (error instanceof NotFoundException) {
        throw new HttpException(
          'No account with the provided email has been found',
          HttpStatus.NOT_FOUND,
        );
      }
      // Handle other known request error (if applicable)
      if (error instanceof PrismaClientKnownRequestError) {
        throw new HttpException('Database error', HttpStatus.BAD_REQUEST);
      }
      // For other unexpected errors, throw internal server error
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByUsername(username: string) {
    try {
      return await this.prisma.user.findUniqueOrThrow({
        where: {
          username,
        },
      });
    } catch (error) {
      // Catch specific error when a record is not found
      if (error instanceof NotFoundException) {
        throw new HttpException(
          'No account with the provided username has been found',
          HttpStatus.NOT_FOUND,
        );
      }
      // Handle other known request errors (if applicable)
      if (error instanceof PrismaClientKnownRequestError) {
        throw new HttpException('Database error', HttpStatus.BAD_REQUEST);
      }
      // For other unexpected errors, throw internal server error
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async editUserInfo(
    id: string,
    EditUserDto: EditUserInfoDto,
    cvUrl?,
    profilePictureUrl?,
    removeImage?: boolean,
    removeCV?: boolean,
  ) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      cvUrl = cvUrl ?? user.cvUrl;
      profilePictureUrl = profilePictureUrl ?? user.profilePictureUrl;
      //Check if the updated categrories exist, if so, it will ensure that the single value will be stored as an array (to avoid confilcting with Prisma model )

      if (EditUserDto.categories) {
        EditUserDto.categories = Array.isArray(EditUserDto.categories)
          ? EditUserDto.categories
          : [EditUserDto.categories];
      }

      return this.prisma.user.update({
        where: { id: id },
        data: {
          ...EditUserDto,
          profilePictureUrl: removeImage ? '' : profilePictureUrl,
          cvUrl: removeCV ? '' : cvUrl,
        },
        omit: {
          password: true,
        },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Invalid Information Provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // this should not return all the users information including password and such
  async findAllUsers(
    username?: string,
    pageNumber: number = 1,
    pageSize: number = 5,

    highestRated?: boolean,
    category?: string,
  ) {
    const skipedRecords = (pageNumber - 1) * pageSize;

    return this.prisma.user.findMany({
      where: {
        username: {
          contains: username,
        },
        ...(category && { categories: { has: category } }), // Apply category filter only if it's provided
      },
      omit: {
        password: true,
      },
      take: pageSize,
      skip: skipedRecords,
      ...(highestRated && { orderBy: { rating: 'desc' } }),
    });
  }
  async findUserRoles(userId: string) {
    const result = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        createdEvents: {
          select: {
            id: true,
          },
        },
        joinedEvents: {
          select: {
            id: true,
          },
        },
        moderatedEvents: {
          select: {
            id: true,
          },
        },
        presentedEvents: {
          select: {
            id: true,
          },
        },
      },
    });
    if (result) {
      return result;
    } else {
      throw new NotFoundException("The userId dosen't exist");
    }
  }
  async getUserRating(userId: string) {
    //step 1: retreive all event's created by the eventCreator with their ratings and number of ratings as well
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        createdEvents: {
          select: {
            _count: {
              select: {
                GivenFeedbacks: true,
              },
            },
          },
        },
        rating: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const numberOfRatings = user.createdEvents.reduce(
      (sum, event) => sum + event._count.GivenFeedbacks,
      0,
    );
    return {
      avgRating: user.rating,
      numberOfRatings,
    };
  }
  async changeUserPassword(
    passwordChangeDto: userChangePasswordDto,
    userId: string,
  ) {
    // Retrieve the user's current hashed password
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    // Verify the old password matches the stored hash
    const isOldPasswordValid = await argon2.verify(
      user.password,
      passwordChangeDto.oldpassword,
    );

    if (!isOldPasswordValid) {
      throw new HttpException(
        'Invalid Information Provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Hash the new password
    const hash = await argon2.hash(passwordChangeDto.newpassword);

    // Update the user's password
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hash,
      },
      omit: {
        password: true,
      },
    });
  }

  async getInvitation(userId: string) {
    //It can be more simpler if we send to queries to the database, though it will be less efficient in terms of performance and cost (Cloud provider may charge)
    const Invitations = await this.prisma.invitation.findMany({
      where: {
        OR: [{ sender_id: userId }, { receiver_id: userId }],
      },
      include: {
        Sender: {
          select: {
            id: true,
            username: true,
            profilePictureUrl: true,
          },
        },
        Receiver: {
          select: {
            id: true,
            username: true,
            profilePictureUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    let sentInvitations = [];
    let receivedInvitations = [];
    Invitations.forEach((invitation) => {
      if (invitation.sender_id === userId) {
        sentInvitations.push(invitation);
      } else {
        receivedInvitations.push(invitation);
      }
    });
    return { sentInvitations, receivedInvitations };
  }
  async resopndInvitation(
    userId: string,
    invitationId: string,
    decision: boolean,
  ) {
    const invitation = await this.prisma.invitation.findUnique({
      where: {
        id: invitationId,
      },
      include: {
        Event: {
          select: {
            id: true,
            isPublic: true,
            joinedUsers: true,
            moderators: true,
            presenters: true,
            eventCreatorId: true,
          },
        },
      },
    });
    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }
    if (invitation.receiver_id !== userId) {
      throw new ForbiddenException(
        'You are not authorized to respond to this invitation',
      );
    }
    if (invitation.status !== 'PENDING') {
      throw new BadRequestException(
        "you've already responded to this invitation ",
      );
    }

    const isSenderIsEventCreator =
      invitation.Event.eventCreatorId === invitation.sender_id;
    const isSenderIsPresenter = invitation.Event.presenters.some(
      (presenter) => presenter.id === invitation.sender_id,
    );
    const isSenderIsModerator = invitation.Event.moderators.some(
      (moderator) => moderator.id === invitation.sender_id,
    );
    const isSenderIsJoinedUser = invitation.Event.joinedUsers.some(
      (joinedUser) => joinedUser.id === invitation.sender_id,
    );
    if (
      !isSenderIsEventCreator &&
      !isSenderIsModerator &&
      !isSenderIsPresenter &&
      !isSenderIsJoinedUser
    ) {
      await this.prisma.invitation.update({
        where: {
          id: invitationId,
        },
        data: {
          status: 'CANCELED_BY_SYSTEM',
        },
      });
      throw new BadRequestException(
        "The invitation's sender is no longer authorized to send this invitation",
      );
    }
    if (decision) {
      if (invitation.invitationType === 'ROLE_INVITATION') {
        //check if the sender is still authorized to send the invitation
        if (!isSenderIsEventCreator && !isSenderIsModerator) {
          await this.prisma.invitation.update({
            where: {
              id: invitationId,
            },
            data: {
              status: 'CANCELED_BY_SYSTEM',
            },
          });
          throw new BadRequestException(
            "The invitation's sender is no longer authorized to send this invitation",
          );
        }
        const role =
          invitation.roleType === 'MODERATOR' ? 'moderators' : 'presenters';
        //check if the user is already in the desired role
        const isAlreadyInRole = invitation.Event[role].some(
          (user) => user.id === userId,
        );
        if (isAlreadyInRole) {
          //might be better to delete the invitation
          await this.prisma.invitation.update({
            where: {
              id: invitationId,
            },
            data: {
              status: 'CANCELED_BY_SYSTEM',
            },
          });
          throw new BadRequestException(
            `You are already in the ${invitation.roleType} role, and the invitation has been canceled`,
          );
        }
        // check if the user has other roles already, if so, override the role
        const isAlreadyJoinedUser = invitation.Event.joinedUsers.some(
          (user) => user.id === userId,
        );
        const isAlreadyPresenterUser = invitation.Event.presenters.some(
          (user) => user.id === userId,
        );
        const isAlreadyModeratorUser = invitation.Event.moderators.some(
          (user) => user.id === userId,
        );
        if (
          isAlreadyJoinedUser ||
          isAlreadyPresenterUser ||
          isAlreadyModeratorUser
        ) {
          let roleToRemove;
          if (isAlreadyJoinedUser) {
            roleToRemove = 'joinedUsers';
          } else if (isAlreadyPresenterUser) {
            roleToRemove = 'presenters';
          } else {
            roleToRemove = 'moderators';
          }
          // remove the user from the previous role
          await this.prisma.event.update({
            where: {
              id: invitation.event_id,
            },
            data: {
              [roleToRemove]: {
                disconnect: {
                  id: userId,
                },
              },
            },
          });
        }
        // connect the user to the new role
        await this.prisma.event.update({
          where: {
            id: invitation.event_id,
          },
          data: {
            [role]: {
              connect: {
                id: userId,
              },
            },
            EventChat: {
              update: { Users: { connect: { id: userId } } },
            },
          },
        });
        await this.prisma.invitation.update({
          where: {
            id: invitationId,
          },
          data: {
            status: 'ACCEPTED',
          },
        });
      } else {
        if (
          isSenderIsJoinedUser ||
          isSenderIsPresenter ||
          isSenderIsModerator ||
          isSenderIsEventCreator
        ) {
          //if the event is private, then, the sender must be the event creator or a moderator
          if (!invitation.Event.isPublic) {
            if (!isSenderIsEventCreator && !isSenderIsModerator) {
              throw new BadRequestException(
                "The invitation's sender is no longer authorized to send this invitation",
              );
            }
          }
        }
        const isAlreadyJoinedUser = invitation.Event.joinedUsers.some(
          (user) => user.id === userId,
        );
        if (isAlreadyJoinedUser) {
          await this.prisma.invitation.update({
            where: {
              id: invitationId,
            },
            data: {
              status: 'CANCELED_BY_SYSTEM',
            },
          });
          throw new BadRequestException(
            `You are already in the event, and the invitation has been canceled`,
          );
        }

        await this.prisma.event.update({
          where: {
            id: invitation.event_id,
          },
          data: {
            joinedUsers: {
              connect: {
                id: userId,
              },
            },
            EventChat: {
              update: { Users: { connect: { id: userId } } },
            },
          },
        });
        await this.prisma.invitation.update({
          where: {
            id: invitationId,
          },
          data: {
            status: 'ACCEPTED',
          },
        });
      }
    } else {
      //if the invitation is not accepted, then, it will be canceled
      await this.prisma.invitation.update({
        where: {
          id: invitationId,
        },
        data: {
          status: 'REJECTED',
        },
      });
    }
    return {
      message: 'Invitation has been responded successfully',
      status: decision ? 'ACCEPTED' : 'REJECTED',
      invitationId,
    };
  }
  //-----------------------------------------
  //Request
  //-----------------------------------------
  async getRequest(userId: string) {
    const requests = await this.prisma.request.findMany({
      where: { sender_id: userId },
      select: {
        id: true,
        status: true,
        requestType: true,
        roleType: true,
        Event: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
            eventCreator: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                profilePictureUrl: true,
              },
            },
          },
        },
      },
    });
    return requests;
  }
}
