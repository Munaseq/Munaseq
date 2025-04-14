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
import {
  NotFoundError,
  PrismaClientKnownRequestError,
} from '@prisma/client/runtime/library';
import { EditUserInfoDto, userChangePasswordDto } from './dtos';
import { exec } from 'child_process';
import { join } from 'path';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async deleteUser(id: string) {
    await this.prisma.event.deleteMany({
      where: {
        eventCreatorId: id,
      },
    });
    return this.prisma.user.delete({
      where: {
        id: id,
      },
      omit: {
        password: true,
      },
    });
  }

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
      if (error instanceof NotFoundError) {
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
      if (error instanceof NotFoundError) {
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
    execludedUsers?: string[],
  ) {
    const skipedRecords = (pageNumber - 1) * pageSize;
    if (username) {
      return this.prisma.user.findMany({
        where: {
          id: {
            notIn: execludedUsers,
          },
          username: {
            contains: username,
          },
        },
        omit: {
          password: true,
        },
        take: pageSize,
        skip: skipedRecords,
      });
    } else {
      return this.prisma.user.findMany({
        where: {
          id: {
            notIn: execludedUsers,
          },
        },
        omit: {
          password: true,
        },
        take: pageSize,
        skip: skipedRecords,
      });
    }
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
    const result = await this.prisma.event.findMany({
      where: {
        eventCreatorId: userId,
      },
      select: {
        GivenFeedbacks: {
          select: {
            rating: true,
          },
        },
      },
    });
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        createdEvents: {
          select: {
            _count: { select: { GivenFeedbacks: true } },
            GivenFeedbacks: { select: { rating: true } },
          },
        },
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // Calculate the total number of ratings
    const numberOfRatings = user.createdEvents.reduce(
      (sum, curr) => sum + curr._count.GivenFeedbacks,
      0,
    );

    // Calculate the sum of all ratings
    const sumOfRating = result.reduce(
      (sum, curr) =>
        sum +
        curr.GivenFeedbacks.reduce(
          (ratingSum, feedback) => ratingSum + feedback.rating,
          0,
        ),
      0,
    );

    const avgRating = numberOfRatings > 0 ? sumOfRating / numberOfRatings : 0;

    return {
      avgRating,
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
}
