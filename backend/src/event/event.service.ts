import { CreateQuizDto } from './dtos/create-quiz.dto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import {
  Answer,
  CreateAssignment,
  CreateEventDto,
  JoinEventDto,
  UpdateAssignmentDTO,
  UpdateEventDto,
  UpdateQuizDto,
} from './dtos';

import { InvitationType, RequestType, RoleType } from '@prisma/client';
import { PDFDocument, rgb } from 'pdf-lib';

import * as fs from 'fs';
import * as path from 'path';
import * as fontkit from '@pdf-lib/fontkit';
import * as ArabicReshaper from 'arabic-reshaper';
type TypeOfSubmisson = 'SUBMITTED' | 'SAVED_ANSWERS';
import * as AWS from 'aws-sdk';
import { uploadCertificate } from 'src/utils/multer.logic';
@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}
  //
  // ----------------------------------------------------------------------
  //THE FOLLOWING IS CREATING EVENT LOGIC
  //----------------------------------------------------------------------

  async createEvent(
    createEventDto: CreateEventDto,
    eventCreatorId: string,
    imageUrl: any,
  ) {
    if (!eventCreatorId) {
      throw new BadRequestException('Event creator ID is required');
    }
    const event = await this.prisma.event.create({
      data: {
        ...createEventDto,
        imageUrl,

        eventCreatorId,
      },

      omit: {
        eventCreatorId: true,
      },
      include: {
        eventCreator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePictureUrl: true,
            username: true,
            visibleName: true,
          },
        },
      },
    });
    const chat = await this.prisma.chat.create({
      data: {
        Event: { connect: { id: event.id } }, // Link the chat to the created event
        category: 'Group_Message_Chat',
        Users: { connect: { id: eventCreatorId } }, //Link the creator of the event to the chat
      },
    });
    return {
      ...event,
      chatId: chat.id,
    };
  }
  //--------------------------------------------------
  //THE FOLLOWING IS FOR UPDATING/DELETING AN EVENT LOGIC
  //--------------------------------------------------
  async updateEvent(
    userId: string,
    eventId: string,
    updateEventDto: UpdateEventDto,
    imageUrl?: any,
    removeImage?: boolean,
  ) {
    const eventIds = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: {
        eventCreatorId: true,
        moderators: { select: { id: true } },
      },
    });
    //Check wether the event exist or not
    if (!eventIds) {
      throw new NotFoundException(
        `Event not found with the following id: ${eventId}`,
      );
    }
    // Check if the userId matches any of the roles
    const isAuthorized =
      eventIds.eventCreatorId === userId ||
      eventIds.moderators.some((moderator) => moderator.id === userId);

    if (!isAuthorized) {
      throw new BadRequestException(
        'User is not authorized to update this event',
      );
    }

    if (imageUrl || removeImage) {
      return this.prisma.event.update({
        where: { id: eventId },
        data: { ...updateEventDto, imageUrl: imageUrl || '' },
        include: {
          eventCreator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profilePictureUrl: true,
              username: true,
              visibleName: true,
            },
          },
        },
        omit: {
          eventCreatorId: true,
        },
      });
    } else {
      return this.prisma.event.update({
        where: { id: eventId },
        data: { ...updateEventDto },
      });
    }
  }

  async delete(userId: string, eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: {
        eventCreator: {
          select: {
            id: true,
            createdEvents: {
              //select all events' ratings that've been created by the eventCreator expect the event that we want to delete
              where: {
                id: { not: eventId },
              },
              select: {
                rating: true,
                _count: { select: { GivenFeedbacks: true } },
              },
            },
          },
        },
      },
    });
    //Check wether the event exist or not
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    // Check if the userId matches any of the roles
    const isAuthorized = event.eventCreator.id === userId;

    if (!isAuthorized) {
      throw new BadRequestException(
        'User is not authorized to delete this event',
      );
    }
    const sumOfRatings = event.eventCreator.createdEvents.reduce(
      (sum, curr) => sum + curr._count.GivenFeedbacks * curr.rating,
      0,
    );
    const numberOfRatings = event.eventCreator.createdEvents.reduce(
      (sum, curr) => sum + curr._count.GivenFeedbacks,
      0,
    );
    const avgRating =
      numberOfRatings === 0 ? 0 : sumOfRatings / numberOfRatings;

    //delte update the eventCreator rating
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        rating: avgRating,
        createdEvents: {
          delete: {
            id: eventId,
          },
        },
      },
    });
    return {
      message: 'The event has been deleted successfully',
    };
  }

  //----------------------------------------------------------------------
  //THE FOLLOWING ARE SEARCH METHODS
  //----------------------------------------------------------------------

  //pageSize indicate how many number records the user wants to retreive
  //pageNumber is help the user to indicate how many records will be skipped. The following variable will calculate the number of skipped records
  // const skipedRecords = (pageNumber - 1) * pageSize;  if the pageNumber =1 (i.e. the user want the first elements) then the skipped records will equal 0*5(default pageSize) = 0

  getAllEvents(
    title?: string,
    pageNumber: number = 1,
    pageSize: number = 5,

    category?: string,
    highestRated?: boolean,
  ) {
    const skipedRecords = (pageNumber - 1) * pageSize;

    return this.prisma.event.findMany({
      where: {
        isPublic: true,
        title: {
          contains: title,
          mode: 'insensitive',
        },
        ...(category && { categories: { has: category } }), // Apply category filter only if it's provided
      },
      include: {
        eventCreator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePictureUrl: true,
            username: true,
            visibleName: true,
          },
        },
      },
      omit: {
        eventCreatorId: true,
      },
      take: pageSize,
      skip: skipedRecords,
      ...(highestRated && { orderBy: { rating: 'desc' } }),
    });
  }
  findAllCurrentUserEvents(
    eventCreatorId: string,
    title?: string,
    pageNumber: number = 1,
    pageSize: number = 5,
  ) {
    const skipedRecords = (pageNumber - 1) * pageSize;
    if (title) {
      return this.prisma.event.findMany({
        where: {
          eventCreatorId,
          title: {
            contains: title,
          },
        },
        include: {
          eventCreator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profilePictureUrl: true,
              username: true,
              visibleName: true,
            },
          },
        },
        omit: {
          eventCreatorId: true,
        },
        take: pageSize,
        skip: skipedRecords,
      });
    } else {
      return this.prisma.event.findMany({
        where: {
          eventCreatorId,
        },
        include: {
          eventCreator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profilePictureUrl: true,
              username: true,
              visibleName: true,
            },
          },
        },
        omit: {
          eventCreatorId: true,
        },
        take: pageSize,
        skip: skipedRecords,
      });
    }
  }

  async getById(eventId: string) {
    const result = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        eventCreator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePictureUrl: true,
            username: true,
            visibleName: true,
          },
        },
      },
      omit: {
        eventCreatorId: true,
      },
    });
    if (result) {
      return result;
    } else {
      throw new NotFoundException('Event not found');
    }
  }
  //Returns the joined events for certain user
  findJoinedEvents(
    userId,
    title?: string, //
    pageNumber: number = 1,
    pageSize: number = 5,
  ) {
    const skipedRecords = (pageNumber - 1) * pageSize;
    if (title) {
      return this.prisma.event.findMany({
        where: {
          joinedUsers: {
            some: {
              id: userId,
            },
          },
          title: {
            contains: title,
          },
        },
        include: {
          eventCreator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profilePictureUrl: true,
              username: true,
              visibleName: true,
            },
          },
        },
        omit: {
          eventCreatorId: true,
        },
        take: pageSize,
        skip: skipedRecords,
      });
    } else {
      return this.prisma.event.findMany({
        where: {
          joinedUsers: {
            some: {
              id: userId,
            },
          },
        },
        include: {
          eventCreator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profilePictureUrl: true,
              username: true,
              visibleName: true,
            },
          },
        },
        omit: {
          eventCreatorId: true,
        },
        take: pageSize,
        skip: skipedRecords,
      });
    }
  }
  //Retrieve all users of certain event
  async findAllUsersOfEvent(eventId: string) {
    const result = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        eventCreator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            profilePictureUrl: true,
          },
        },
        joinedUsers: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            profilePictureUrl: true,
          },
        },
        presenters: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            profilePictureUrl: true,
          },
        },
        moderators: {
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
    if (result) {
      return result;
    } else {
      throw new NotFoundException("The event doesn't exist");
    }
  }
  //Return all users that have the specified role in certain event
  async findUsersParticipateInEvent(
    eventId: string,
    role: string,
    username?: string, //to enable search by username
    pageNumber: number = 1,
    pageSize: number = 5,
  ) {
    const skipedRecords = (pageNumber - 1) * pageSize;
    if (username) {
      const result = await this.prisma.event.findMany({
        where: {
          id: eventId,
        },
        select: {
          [role]: {
            where: {
              username: {
                contains: username,
              },
            },
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profilePictureUrl: true,
              username: true,
            },
            take: pageSize,
            skip: skipedRecords,
          },
        },
      });
      return result.length > 0 ? result[0][role] : []; // to return array contains the selected fields only
    } else {
      const result = await this.prisma.event.findMany({
        where: {
          id: eventId,
        },
        select: {
          [role]: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profilePictureUrl: true,
              username: true,
            },
            take: pageSize,
            skip: skipedRecords,
          },
        },
      });
      return result.length > 0 ? result[0][role] : []; // to return array contains the selected fields only
    }
  }
  findEventCreator(eventId) {
    return this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        eventCreator: {
          omit: {
            password: true,
          },
        },
      },
    });
  }
  //--------------------------------------------------
  //THE FOLLOWING IS FOR SHOWING/ADDING/DELETING MATERIAL LOGIC
  //--------------------------------------------------
  async getMaterials(userId: string, eventId: string) {
    //the following logic is to ensure that the material will not be shown  unless the user is authorized to do that

    //retreive eventCreator, moderators, and presenters ids
    const eventIds = await this.prisma.event.findFirst({
      where: {
        id: eventId,
      },
      select: {
        eventCreatorId: true,
        presenters: { select: { id: true } },
        moderators: { select: { id: true } },
        joinedUsers: { select: { id: true } },
      },
    });
    //Check wether the event exist or not
    if (!eventIds) {
      throw new NotFoundException('Event not found');
    }
    // Check if the userId matches any of the roles
    const isAuthorized =
      eventIds.eventCreatorId === userId ||
      eventIds.presenters.some((presenter) => presenter.id === userId) ||
      eventIds.moderators.some((moderator) => moderator.id === userId) ||
      eventIds.joinedUsers.some((joinedUsers) => joinedUsers.id === userId);

    if (!isAuthorized) {
      throw new BadRequestException(
        'User is not authorized to delete materials to this event',
      );
    }
    const result = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        Materials: {
          select: {
            materialId: true,
            materialUrl: true,
            createdAt: true,
          },
        },
      },
    });
    return result ?? { message: "The event hasn't any materials" };
  }
  async addMaterialsToEvent(
    eventId: string,
    userId: string,
    materials: { materialUrl: string }[],
  ) {
    //the following logic is to ensure that the material will not be added to the event unless the user is authorized to do that

    //retreive eventCreator, moderators, and presenters ids
    const eventIds = await this.prisma.event.findUniqueOrThrow({
      where: { id: eventId },
      select: {
        eventCreatorId: true,
        presenters: { select: { id: true } },
        moderators: { select: { id: true } },
      },
    }); //Check wether the event exist or not
    if (!eventIds) {
      throw new NotFoundException('Event not found');
    }
    // Check if the userId matches any of the roles
    const isAuthorized =
      eventIds.eventCreatorId === userId ||
      eventIds.presenters.some((presenter) => presenter.id === userId) ||
      eventIds.moderators.some((moderator) => moderator.id === userId);

    if (!isAuthorized) {
      throw new BadRequestException(
        'User is not authorized to add materials to this event',
      );
    }

    // If authorized, proceed to add materials
    return this.prisma.event.update({
      where: { id: eventId },
      data: {
        Materials: {
          createMany: {
            data: materials,
          },
        },
      },
      select: {
        Materials: {
          where: {
            materialUrl: {
              in: materials.map((material) => material.materialUrl), //to retreive the only materials' urls
            },
          },
          select: { materialUrl: true, materialId: true }, //the materialId is send in the response in order to make the front-end team able to send the materialId in order to delete the material
        },
      },
    });
  }

  async deleteMaterial(userId, materialId) {
    //the following logic is to ensure that the material will not be deleted from an event unless the user is authorized to do that

    //retreive eventCreator, moderators, and presenters ids
    const eventIds = await this.prisma.event.findFirst({
      where: {
        Materials: {
          some: {
            materialId,
          },
        },
      },
      select: {
        id: true,
        eventCreatorId: true,
        presenters: { select: { id: true } },
        moderators: { select: { id: true } },
      },
    });
    //Check wether the event exist or not
    if (!eventIds) {
      throw new NotFoundException('Event not found');
    }
    // Check if the userId matches any of the roles
    const isAuthorized =
      eventIds.eventCreatorId === userId ||
      eventIds.presenters.some((presenter) => presenter.id === userId) ||
      eventIds.moderators.some((moderator) => moderator.id === userId);

    if (!isAuthorized) {
      throw new BadRequestException(
        'User is not authorized to delete materials to this event',
      );
    }
    const result = await this.prisma.event.update({
      where: {
        id: eventIds.id,
      },
      data: {
        Materials: {
          delete: {
            materialId,
          },
        },
      },
    });
    if (result) {
      return {
        message: `The assignment with id "${materialId}" has been deleted successfully`,
      };
    } else {
      throw new InternalServerErrorException(
        "The assignment couldn't be deleted successfully",
      );
    }
  }

  //--------------------------------------------------
  //THE FOLLOWING IS FOR SHOWING/ADDING/UPDATING/DELETING QUIZ LOGIC
  //--------------------------------------------------

  async getQuizzes(userId: string, eventId: string) {
    //the following logic is to ensure that the ass will not be shown  unless the user is authorized to do that

    //retreive eventCreator, moderators, and presenters ids
    const eventIds = await this.prisma.event.findFirst({
      where: {
        id: eventId,
      },
      select: {
        eventCreatorId: true,
        presenters: { select: { id: true } },
        moderators: { select: { id: true } },
        joinedUsers: { select: { id: true } },
      },
    });
    //Check wether the event exist or not
    if (!eventIds) {
      throw new NotFoundException('Event not found');
    }
    // Check if the userId matches any of the roles
    const isAttendee = eventIds.joinedUsers.some(
      (joinedUser) => joinedUser.id === userId,
    );
    const isAuthorized =
      eventIds.eventCreatorId === userId ||
      eventIds.presenters.some((presenter) => presenter.id === userId) ||
      eventIds.moderators.some((moderator) => moderator.id === userId) ||
      isAttendee;

    if (!isAuthorized) {
      throw new BadRequestException(
        'User is not authorized to view the quizzes of this event',
      );
    }
    //Check if the user is anttendee, then show the quizzes and thier status, if not, then show how many users have partcipated in the Quiz
    let result = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        _count: { select: { Quizzes: true } },
        Quizzes: {
          select: {
            _count: { select: { TakeQuiz: true } }, //for the number of users who have taken the Quiz, ONLY for the authorized users
            id: true,
            quizTitle: true,
            timeLimit: true,
            startDate: true,
            endDate: true,
            TakeQuiz: { where: { userId }, select: { status: true } }, //for the attendee
            createdAt: true,
            updatedAt: true,
          },
          orderBy: { updatedAt: 'desc' },
        },
      },
    });
    if (!result) {
      throw new NotFoundException('Event not found');
    }
    // If the user is an attendee, show the status of the Quiz

    const quizsWithStatus = result.Quizzes.map((Quiz) => {
      const currDate = new Date();
      const { _count, TakeQuiz, ...quizzesWithoutCount } = Quiz; // Exclude _count
      let status;
      if (currDate < Quiz.startDate) {
        status = 'AVAILABLE_SOON'; //Alows the authorized to update
      } else if (currDate > Quiz.endDate) {
        status = 'EXPIRED';
      } else {
        status = 'AVAILABLE';
        //TODO SUbmitted / Saved  status
      }

      if (isAttendee) {
        let takeQuizStatus: string;
        if (TakeQuiz.length > 0) {
          const takeQuiz = TakeQuiz[0];
          takeQuizStatus = takeQuiz.status;
        } else {
          takeQuizStatus = 'NOT_ANSWERED';
        }
        return {
          quizStatus: status,
          takeQuizStatus,
          ...quizzesWithoutCount,
        };
      } else {
        return {
          quizStatus: status,
          numberParticipatedUsers: _count.TakeQuiz,
          ...quizzesWithoutCount,
        };
      }
    });
    return {
      numberOfQuizzes: result._count.Quizzes,
      quizzes: quizsWithStatus,
    };
  }
  async showQuiz(userId: string, quizId: string) {
    const event = await this.prisma.event.findFirst({
      where: {
        Quizzes: {
          some: {
            id: quizId,
          },
        },
      },
      select: {
        joinedUsers: {
          select: {
            id: true,
          },
        },
        eventCreatorId: true,
        moderators: { select: { id: true } },
        presenters: { select: { id: true } },
        Quizzes: {
          where: { id: quizId },
          select: {
            id: true,
            quizTitle: true,
            timeLimit: true,
            questions: true,
            startDate: true,
            endDate: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: { TakeQuiz: true },
            },
            TakeQuiz: {
              where: { userId },
              select: {
                id: true,
                answers: true,
                status: true,
                updatedAt: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });
    if (!event) {
      throw new NotFoundException('quiz or event not found');
    }
    // Check if the userId matches any of the roles
    const isAttendee = event.joinedUsers.some(
      (joinedUsers) => joinedUsers.id === userId,
    );
    const isAuthorized =
      event.eventCreatorId === userId ||
      event.presenters.some((presenter) => presenter.id === userId) ||
      event.moderators.some((moderator) => moderator.id === userId) ||
      isAttendee;

    if (!isAuthorized) {
      throw new BadRequestException("You're not allowed to show this Quiz");
    }
    const quiz = event.Quizzes[0];
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    //show the status of the quiz
    const currDate = new Date();
    const { _count, TakeQuiz, ...quizWithoutCount } = event.Quizzes[0]; // Exclude _count
    let status: string;
    if (currDate < quiz.startDate) {
      status = 'AVAILABLE_SOON'; //Alows the authorized to update
    } else if (currDate > quiz.endDate) {
      status = 'EXPIRED';
    } else {
      status = 'AVAILABLE';
    }
    if (isAttendee) {
      {
        let takeQuizStatus: string;
        if (TakeQuiz?.length > 0) {
          const takeQuiz = TakeQuiz[0];
          takeQuizStatus = takeQuiz.status;
        } else {
          takeQuizStatus = 'NOT_ANSWERED';
        }

        return {
          quizStatus: status,
          takeQuizStatus,
          ...quizWithoutCount,
          TakeQuiz: TakeQuiz[0]
            ? {
                ...TakeQuiz[0],
                answers: JSON.parse(TakeQuiz[0].answers as string),
              }
            : {},
        };
      }
    } else {
      return {
        quizStatus: status,
        numberParticipatedUsers: _count.TakeQuiz,
        ...quizWithoutCount,
      };
    }
  }

  async addQuizToEvent(userId: string, eventId: string, body: CreateQuizDto) {
    //retreive eventCreator, moderators, and presenters ids
    const eventIds = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: {
        eventCreatorId: true,
        presenters: { select: { id: true } },
        moderators: { select: { id: true } },
      },
    });
    //Check wether the event exist or not
    if (!eventIds) {
      throw new NotFoundException('Event not found');
    }
    // Check if the userId matches any of the roles
    const isAuthorized =
      eventIds.eventCreatorId === userId ||
      eventIds.presenters.some((presenter) => presenter.id === userId) ||
      eventIds.moderators.some((moderator) => moderator.id === userId);

    if (!isAuthorized) {
      throw new BadRequestException(
        'User is not authorized to add quiz to this event',
      );
    }
    //Check if the start date is smaller than the end date
    if (body.startDate > body.endDate) {
      throw new BadRequestException(
        'The start date should be smaller than the end date',
      );
    }
    const result = await this.prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        Quizzes: {
          create: {
            quizTitle: body.quizTitle,
            startDate: body.startDate,
            endDate: body.endDate,
            timeLimit: body.timeLimit,
            questions: {
              createMany: {
                data: body.questions.map((question) => ({
                  questionType: question.questionType,
                  text: question.text,

                  correctAnswer: question.correctAnswer,
                  options: question.options,
                })),
              },
            },
          },
        },
      },
      select: {
        Quizzes: {
          select: {
            id: true,
            startDate: true,
            endDate: true,

            questions: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
    return result?.Quizzes[0] ?? []; //to remove the unnecessary structure from the response
  }

  async updateQuiz(userId: string, quizId: string, body: UpdateQuizDto) {
    //retreive eventCreator, moderators, ,presenters, and event ids, also retrieve the ids of the quiz's questions
    const event = await this.prisma.event.findFirst({
      //findUnique requires a direct unique attribute for event model, in this case the unique attr. isn't direct
      where: {
        Quizzes: {
          some: {
            id: quizId, // will check for an event that has an quiz id matches quizId
          },
        },
      },
      select: {
        id: true,
        eventCreatorId: true,
        presenters: { select: { id: true } },
        moderators: { select: { id: true } },
        Quizzes: {
          where: {
            id: quizId,
          },

          select: { startDate: true, endDate: true },
        },
      },
    });
    if (!event) {
      throw new NotFoundException('quiz or event not found');
    }
    // Check if the userId matches any of the roles
    const isAuthorized =
      event.eventCreatorId === userId ||
      event.presenters.some((presenter) => presenter.id === userId) ||
      event.moderators.some((moderator) => moderator.id === userId);

    if (!isAuthorized) {
      throw new BadRequestException(
        'User is not authorized to update this quiz',
      );
    } //Check if the start date is smaller than the end date
    if (body.startDate > body.endDate) {
      throw new BadRequestException(
        'The start date should be smaller than the end date',
      );
    }

    //check if the timelimit is zero or less
    if (body?.timeLimit <= 0) {
      throw new BadRequestException('The timelimit should be greater than 0');
    }
    const currDate = new Date();
    if (event.Quizzes[0]?.startDate < currDate) {
      throw new BadRequestException(
        'The Quiz has already started, you cannot update it',
      );
    }

    //Remove all records, and add the new ones(even if they are the same)

    const result = await this.prisma.event.update({
      where: {
        id: event.id,
      },
      data: {
        Quizzes: {
          update: {
            where: {
              id: quizId,
            },
            data: {
              startDate: body.startDate,
              endDate: body.endDate,
              timeLimit: body.timeLimit,
              quizTitle: body.quizTitle,
              ...(body.questions && {
                questions: {
                  deleteMany: {
                    quizId,
                  },
                  createMany: {
                    data: body.questions.map((newQuestion) => ({
                      questionType: newQuestion.questionType,
                      text: newQuestion.text,
                      options: newQuestion.options,
                      correctAnswer: newQuestion.correctAnswer,
                    })),
                  },
                },
              }),
            },
          },
        },
      },
      select: {
        Quizzes: {
          include: { questions: true },
          take: 1,
          orderBy: { updatedAt: 'desc' },
        },
      },
    });
    const updatedQuiz = result?.Quizzes[0];
    return updatedQuiz ?? []; //to remove the unnecessary structure from the response
  }
  //READ THE NEXT FUNCTION COMMENT...
  // async startQuiz(userId: string, quizId: string) {
  //   // Step 1: Retrieve the quiz and its details
  //   const quiz = await this.prisma.quiz.findUnique({
  //     where: { id: quizId },
  //     select: {
  //       id: true,
  //       startDate: true,
  //       endDate: true,
  //       timeLimit: true,
  //       questions: {
  //         select: {
  //           id: true,
  //           text: true,
  //           questionType: true,
  //           options: true,
  //         },
  //       },
  //       TakeQuiz: {
  //         where: {
  //           userId,
  //         },
  //       },
  //     },
  //   });

  //   if (!quiz) {
  //     throw new NotFoundException('Quiz not found');
  //   }
  //   //check if the quiz is already started
  //   if (quiz.TakeQuiz.length > 0) {
  //     throw new BadRequestException('Quiz has already been started');
  //   }

  //   // Step 2: Verify the quiz is within the allowed timeframe
  //   if (new Date() < quiz.startDate) {
  //     throw new BadRequestException('Quiz has not started yet');
  //   }

  //   if (new Date() > quiz.endDate) {
  //     throw new BadRequestException('Quiz has ended');
  //   }

  //   // Step 4: Create a new TakeQuiz record when the user starts the quiz
  //   const takeQuizRecord = await this.prisma.takeQuiz.create({
  //     data: {
  //       userId, // userId is a string
  //       quizId, // quizId is a string
  //       // We don't need to set score and answers at the start
  //     },
  //   });

  //   return takeQuizRecord; // Return the created TakeQuiz record
  // }

  async saveQuiz(
    userId: string,
    quizId: string,
    answers: Answer[],
    typeOfSubmission: TypeOfSubmisson,
  ) {
    //-----------------------------------------------------------------------
    // IMPORTANT THIS METHOD IS INTENDED TO SAVE QUIZ ANSWERS AFTER STARTING THE QUIZ IN ORDER TO ENSURE THAT THE USER CAN'T SAVE/SUBMIT THE QUIZ UNLESS HE STARTED IT , BUT, MAHMOUD SAID THAT WE WILL NOT DO THE BEST PRACTICE, RATHER WE WILL DO THE EASIER WAY DUE TO TIME CONSTRAINTS
    //-----------------------------------------------------------------------

    // Check if answers is an array
    if (!Array.isArray(answers)) {
      throw new BadRequestException('Answers must be an array');
    }

    //retreive joinedUsers and the quiz allowed period as well as the taken quiz by the user
    const event = await this.prisma.event.findFirst({
      where: {
        Quizzes: {
          some: {
            id: quizId,
          },
        },
      },
      select: {
        joinedUsers: {
          select: {
            id: true,
          },
        },
        Quizzes: {
          where: { id: quizId },
          select: {
            startDate: true,
            endDate: true,
            timeLimit: true,
            TakeQuiz: {
              where: { quizId, userId },
              select: { id: true, status: true, createdAt: true },
            },
          },
        },
      },
    });
    if (!event) {
      throw new NotFoundException('quiz or event not found');
    }

    // Check if the userId matches any of the roles
    const isAuthorized = event.joinedUsers.some(
      (joinedUser) => joinedUser.id === userId,
    );
    if (!isAuthorized) {
      throw new BadRequestException("You're not allowed to do this quiz");
    }
    // //check if the quiz is already started
    // if (event.Quizzes[0]?.TakeQuiz.length === 0) {
    //   throw new BadRequestException("Quiz has'nt started yet...");
    // }
    //check if the quiz is submitted, if so, throw an error
    let quizTake: any = event.Quizzes[0].TakeQuiz[0];
    if (quizTake?.status === 'SUBMITTED') {
      throw new BadRequestException("You've already submitted this quiz");
    } //check if Quiz is within the valid period (means available to take)
    const currDate = new Date();
    // const timeLimit = event.Quizzes[0].timeLimit * 60 * 1000; // Convert time limit to milliseconds
    // const quizEndDate = new Date(quizTake.createdAt.getTime() + timeLimit); //FUTURE
    if (
      event?.Quizzes[0]?.endDate < currDate ||
      event?.Quizzes[0]?.startDate > currDate
      // || quizEndDate < currDate
    ) {
      throw new BadRequestException(
        "The Quiz time expired Or hasn't started yet",
      );
    }
    let updatedTakeQuiz: any;
    if (!quizTake) {
      updatedTakeQuiz = await this.prisma.takeQuiz.create({
        data: {
          userId,
          quizId,
          status: typeOfSubmission, // Update the status based on the submission type
          answers: JSON.stringify(answers), // Save the answers as a JSON array
        },
      });
    } else {
      updatedTakeQuiz = await this.prisma.takeQuiz.update({
        where: { id: quizTake.id },
        data: {
          status: typeOfSubmission, // Update the status based on the submission type
          answers: JSON.stringify(answers), // Save the answers as a JSON array
        },
      });
    }
    return { ...updatedTakeQuiz, answers: JSON.parse(updatedTakeQuiz.answers) };

    // const updatedTakeQuiz: any = await this.prisma.takeQuiz.update({
    //   where: { id: event.Quizzes[0].TakeQuiz[0].id },
    //   data: {
    //     status: typeOfSubmission, // Update the status based on the submission type

    //     answers: JSON.stringify(answers), // Save the answers as a JSON array
    //   },
    // });

    // return { ...updatedTakeQuiz, answers: JSON.parse(updatedTakeQuiz.answers) }; // Return the updated TakeQuiz record
  }

  // Method to retrieve quiz results for an event
  async getAllParticipantsQuizResults(
    userId: string,
    eventId: string,
    quizId: string,
  ) {
    // Step 1: Check if the user is authorized to view the results (event creator, presenter, or moderator)
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        eventCreator: true,
        presenters: true,
        moderators: true,
      },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    const isEventCreator = event.eventCreatorId === userId;
    const isPresenter = event.presenters.some(
      (presenter) => presenter.id === userId,
    );
    const isModerator = event.moderators.some(
      (moderator) => moderator.id === userId,
    );

    if (!isEventCreator && !isPresenter && !isModerator) {
      throw new ForbiddenException(
        'You do not have permission to view the quiz results',
      );
    }

    // Step 2: Fetch all quiz results for the specific quiz and event
    const quizResults = await this.prisma.takeQuiz.findMany({
      where: {
        quizId: quizId,
      },
      include: {
        User: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
          },
        },
        Quiz: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
          },
        },
      },
    });

    // Step 3: Return the results
    return quizResults.map((result) => ({
      userId: result.userId,
      userName: `${result.User.firstName} ${result.User.lastName}`,
      userEmail: result.User.email,
      score: result.score,
      answers: result.answers,
      quizStartDate: result.Quiz.startDate,
      quizEndDate: result.Quiz.endDate,
    }));
  }

  async getQuizById(quizId: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        timeLimit: true,
        questions: {
          select: {
            id: true,
            text: true,
            questionType: true,
            options: true,
            correctAnswer: true,
          },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    return quiz;
  }

  async deleteQuiz(userId: string, quizId: string) {
    // Step 1: Retrieve eventCreator, moderators, presenters, and event IDs
    const event = await this.prisma.event.findFirst({
      where: {
        Quizzes: {
          some: {
            id: quizId,
          },
        },
      },
      select: {
        id: true,
        eventCreatorId: true,
        presenters: { select: { id: true } },
        moderators: { select: { id: true } },
      },
    });
    if (!event) {
      throw new NotFoundException('quiz not found');
    }
    // Step 2: Check if the user is authorized to delete the quiz
    const isAuthorized =
      event.eventCreatorId === userId ||
      event.presenters.some((presenter) => presenter.id === userId) ||
      event.moderators.some((moderator) => moderator.id === userId);

    if (!isAuthorized) {
      throw new BadRequestException(
        'User is not authorized to delete this quiz',
      );
    }

    // Step 3: Delete the quiz
    await this.prisma.quiz.delete({
      where: { id: quizId },
    });

    return {
      message: `The quiz with id "${quizId}" has been deleted successfully`,
    };
  }

  //--------------------------------------------------
  //THE FOLLOWING IS FOR SHOWING/ADDING/UPDATING/DELETING ASSIGMENNT LOGIC
  //--------------------------------------------------

  async getAssignments(userId: string, eventId: string) {
    //the following logic is to ensure that the ass will not be shown  unless the user is authorized to do that

    //retreive eventCreator, moderators, and presenters ids
    const eventIds = await this.prisma.event.findFirst({
      where: {
        id: eventId,
      },
      select: {
        eventCreatorId: true,
        presenters: { select: { id: true } },
        moderators: { select: { id: true } },
        joinedUsers: { select: { id: true } },
      },
    });
    //Check wether the event exist or not
    if (!eventIds) {
      throw new NotFoundException('Event not found');
    }
    // Check if the userId matches any of the roles
    const isAttendee = eventIds.joinedUsers.some(
      (joinedUser) => joinedUser.id === userId,
    );
    const isAuthorized =
      eventIds.eventCreatorId === userId ||
      eventIds.presenters.some((presenter) => presenter.id === userId) ||
      eventIds.moderators.some((moderator) => moderator.id === userId) ||
      isAttendee;

    if (!isAuthorized) {
      throw new BadRequestException(
        'User is not authorized to view the assignments of this event',
      );
    }
    //Check if the user is anttendee, then show the assignments and thier status, if not, then show how many users have partcipated in the assignment
    let result = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        _count: { select: { Assignments: true } },
        Assignments: {
          select: {
            _count: { select: { TakeAssignment: true } }, //for the number of users who have taken the assignment, ONLY for the authorized users
            id: true,
            assignmentTitle: true,
            startDate: true,
            endDate: true,
            TakeAssignment: { where: { userId }, select: { status: true } }, //for the attendee
            updatedAt: true,
            createdAt: true,
          },
          orderBy: { updatedAt: 'desc' },
        },
      },
    });
    if (!result) {
      throw new NotFoundException('Event not found');
    }
    // If the user is an attendee, show the status of the assignment

    const assignmentsWithStatus = result.Assignments.map((assignment) => {
      const currDate = new Date();
      const { _count, TakeAssignment, ...assignmentWithoutCount } = assignment; // Exclude _count
      let status;
      if (currDate < assignment.startDate) {
        status = 'AVAILABLE_SOON'; //Alows the authorized to update
      } else if (currDate > assignment.endDate) {
        status = 'EXPIRED';
      } else {
        status = 'AVAILABLE';
        //TODO SUbmitted / Saved  status
      }

      if (isAttendee) {
        let takeAssignmentStatus: string;
        if (TakeAssignment.length > 0) {
          const takeAssignment = TakeAssignment[0];
          takeAssignmentStatus = takeAssignment.status;
        } else {
          takeAssignmentStatus = 'NOT_ANSWERED';
        }
        return {
          assignmentStatus: status,
          takeAssignmentStatus,
          ...assignmentWithoutCount,
        };
      } else {
        return {
          assignmentStatus: status,
          numberParticipatedUsers: _count.TakeAssignment,
          ...assignmentWithoutCount,
        };
      }
    });
    return {
      numberOfAssignments: result._count.Assignments,
      assignments: assignmentsWithStatus,
    };
  }
  async addAssignment(eventId: string, userId: string, body: CreateAssignment) {
    //retreive eventCreator, moderators, and presenters ids
    const eventIds = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: {
        eventCreatorId: true,
        presenters: { select: { id: true } },
        moderators: { select: { id: true } },
      },
    });
    //Check wether the event exist or not
    if (!eventIds) {
      throw new NotFoundException('Event not found');
    }
    // Check if the userId matches any of the roles
    const isAuthorized =
      eventIds.eventCreatorId === userId ||
      eventIds.presenters.some((presenter) => presenter.id === userId) ||
      eventIds.moderators.some((moderator) => moderator.id === userId);

    if (!isAuthorized) {
      throw new BadRequestException(
        'User is not authorized to add assignment to this event',
      );
    }
    //Check if the start date is smaller than the end date
    if (body.startDate > body.endDate) {
      throw new BadRequestException(
        'The start date should be smaller than the end date',
      );
    }
    const result = await this.prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        Assignments: {
          create: {
            assignmentTitle: body.assignmentTitle,
            startDate: body.startDate,
            endDate: body.endDate,
            questions: {
              createMany: {
                data: body.questions.map((question) => ({
                  questionType: question.questionType,
                  text: question.text,

                  correctAnswer: question.correctAnswer,
                  options: question.options,
                })),
              },
            },
          },
        },
      },
      select: {
        Assignments: {
          select: {
            id: true,
            startDate: true,
            endDate: true,

            questions: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
    return result?.Assignments[0] ?? []; //to remove the unnecessary structure from the response
  }

  //Show the assignment and the saved answers if any
  async showAssignment(userId: string, assignmentId: string) {
    const event = await this.prisma.event.findFirst({
      where: {
        Assignments: {
          some: {
            id: assignmentId,
          },
        },
      },
      select: {
        joinedUsers: {
          select: {
            id: true,
          },
        },
        eventCreatorId: true,
        moderators: { select: { id: true } },
        presenters: { select: { id: true } },
        Assignments: {
          where: { id: assignmentId },
          select: {
            id: true,
            assignmentTitle: true,
            questions: true,
            startDate: true,
            endDate: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: { TakeAssignment: true },
            },
            TakeAssignment: {
              where: { userId },
              select: {
                id: true,
                answers: true,
                status: true,
                updatedAt: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });
    if (!event) {
      throw new NotFoundException('assignment not found');
    }
    // Check if the userId matches any of the roles
    const isAttendee = event.joinedUsers.some(
      (joinedUsers) => joinedUsers.id === userId,
    );
    const isAuthorized =
      event.eventCreatorId === userId ||
      event.presenters.some((presenter) => presenter.id === userId) ||
      event.moderators.some((moderator) => moderator.id === userId) ||
      isAttendee;

    if (!isAuthorized) {
      throw new BadRequestException(
        "You're not allowed to show this assignment",
      );
    }
    const assignment = event.Assignments[0];
    if (!assignment) {
      throw new NotFoundException('Assignment or event not found ');
    }
    //show the status of the assignment
    const currDate = new Date();
    const { _count, TakeAssignment, ...assignmentWithoutCount } =
      event.Assignments[0]; // Exclude _count
    let status: string;
    if (currDate < assignment.startDate) {
      status = 'AVAILABLE_SOON'; //Alows the authorized to update
    } else if (currDate > assignment.endDate) {
      status = 'EXPIRED';
    } else {
      status = 'AVAILABLE';
    }
    if (isAttendee) {
      {
        let takeAssignmentStatus: string;
        if (TakeAssignment?.length > 0) {
          const takeAssignment = TakeAssignment[0];
          takeAssignmentStatus = takeAssignment.status;
        } else {
          takeAssignmentStatus = 'NOT_ANSWERED';
        }

        return {
          assignmentStatus: status,
          takeAssignmentStatus,
          ...assignmentWithoutCount,
          TakeAssignment: TakeAssignment[0]
            ? {
                ...TakeAssignment[0],
                answers: JSON.parse(TakeAssignment[0].answers as string),
              }
            : {},
        };
      }
    } else {
      return {
        assignmentStatus: status,
        numberParticipatedUsers: _count.TakeAssignment,
        ...assignmentWithoutCount,
      };
    }
  }

  async saveAssignment(
    userId: string,
    assignmentId: string,
    answers: Answer[],
    typeOfSubmission: TypeOfSubmisson,
  ) {
    //retreive joinedUsers and the assignment allowed period as well as the taken assignment by the user
    const event = await this.prisma.event.findFirst({
      where: {
        Assignments: {
          some: {
            id: assignmentId,
          },
        },
      },
      select: {
        joinedUsers: {
          select: {
            id: true,
          },
        },
        Assignments: {
          where: { id: assignmentId },
          select: {
            startDate: true,
            endDate: true,
            TakeAssignment: {
              where: { assignmentId, userId },
              select: { id: true, status: true },
            },
          },
        },
      },
    });
    if (!event) {
      throw new NotFoundException('assignment or event not found');
    }

    // Check if the userId matches any of the roles ---> refactor the authorization logic into single one function
    const isAuthorized = event.joinedUsers.some(
      (joinedUser) => joinedUser.id === userId,
    );
    if (!isAuthorized) {
      throw new BadRequestException("You're not allowed to do this assignment");
    }
    //check if the assignment is submitted, if so, throw an error
    let assignmentTake: any = event.Assignments[0].TakeAssignment[0];
    if (assignmentTake?.status === 'SUBMITTED') {
      throw new BadRequestException("You've already submitted this assignment");
    }
    //check if assignment is within the valid period (means available to take)
    const currDate = new Date();
    if (
      event?.Assignments[0]?.endDate < currDate ||
      event?.Assignments[0]?.startDate > currDate
    ) {
      throw new BadRequestException(
        'The Assignment time expired Or not started yet',
      );
    }
    //check if the  user has an existing taken assignment, if not,create a new one
    if (!assignmentTake) {
      assignmentTake = await this.prisma.takeAssignment.create({
        data: {
          answers: JSON.stringify(answers),
          assignmentId,
          userId,
          status: typeOfSubmission,
        },
      });
    } else {
      assignmentTake = await this.prisma.takeAssignment.update({
        where: {
          id: assignmentTake.id,
        },
        data: {
          answers: JSON.stringify(answers),
          status: typeOfSubmission,
        },
      });
    }
    return { ...assignmentTake, answers: JSON.parse(assignmentTake.answers) }; //to remove the unnecessary structure from the response
  }
  async updateAssignment(
    assignmentId: string,
    userId: string,
    body: UpdateAssignmentDTO,
  ) {
    //retreive eventCreator, moderators, ,presenters, and event ids, also retrieve the ids of the assignment's questions
    const event = await this.prisma.event.findFirst({
      //findUnique requires a direct unique attribute for event model, in this case the unique attr. isn't direct
      where: {
        Assignments: {
          some: {
            id: assignmentId, // will check for an event that has an assignment id matches assignmentId
          },
        },
      },
      select: {
        id: true,
        eventCreatorId: true,
        presenters: { select: { id: true } },
        moderators: { select: { id: true } },
        Assignments: {
          where: {
            id: assignmentId,
          },

          select: { startDate: true, endDate: true },
        },
      },
    });
    if (!event) {
      throw new NotFoundException('assignment or event not found');
    }
    // Check if the userId matches any of the roles
    const isAuthorized =
      event.eventCreatorId === userId ||
      event.presenters.some((presenter) => presenter.id === userId) ||
      event.moderators.some((moderator) => moderator.id === userId);

    if (!isAuthorized) {
      throw new BadRequestException(
        'User is not authorized to update this assignment',
      );
    } //Check if the start date is smaller than the end date
    if (body.startDate > body.endDate) {
      throw new BadRequestException(
        'The start date should be smaller than the end date',
      );
    }
    const currDate = new Date();
    if (event.Assignments[0]?.startDate < currDate) {
      throw new BadRequestException(
        'The Assignment has already started, you cannot update it',
      );
    }

    //Remove all records, and add the new ones(even if they are the same)

    const result = await this.prisma.event.update({
      where: {
        id: event.id,
      },
      data: {
        Assignments: {
          update: {
            where: {
              id: assignmentId,
            },
            data: {
              startDate: body.startDate,
              endDate: body.endDate,
              assignmentTitle: body.assignmentTitle,
              ...(body.questions && {
                questions: {
                  deleteMany: {
                    assignment_id: assignmentId,
                  },
                  createMany: {
                    data: body.questions.map((newQuestion) => ({
                      questionType: newQuestion.questionType,
                      text: newQuestion.text,
                      options: newQuestion.options,
                      correctAnswer: newQuestion.correctAnswer,
                    })),
                  },
                },
              }),
            },
          },
        },
      },
      select: {
        Assignments: {
          include: { questions: true },
          take: 1,
          orderBy: { updatedAt: 'desc' },
        },
      },
    });
    const updatedAssignment = result?.Assignments[0];
    return updatedAssignment ?? []; //to remove the unnecessary structure from the response
  }
  async deleteAssignment(assignmentId: string, userId: string) {
    //the following logic is to ensure that the assignment will not be deleted unless the user is authorized to do that

    //retreive eventCreator, moderators, ,presenters, and event ids
    const eventIds = await this.prisma.event.findFirst({
      //findUnique requires a direct unique attribute for event model, in this case the unique attr. isn't direct
      where: {
        Assignments: {
          some: {
            id: assignmentId, // will check for an event that has an assignment id matches assignmentId
          },
        },
      },
      select: {
        id: true,
        eventCreatorId: true,
        presenters: { select: { id: true } },
        moderators: { select: { id: true } },
      },
    });
    //Check wether the event exist or not
    if (!eventIds) {
      throw new NotFoundException('assignment not found');
    }
    // Check if the userId matches any of the roles
    const isAuthorized =
      eventIds.eventCreatorId === userId ||
      eventIds.presenters.some((presenter) => presenter.id === userId) ||
      eventIds.moderators.some((moderator) => moderator.id === userId);

    if (!isAuthorized) {
      throw new BadRequestException(
        'User is not authorized to delete this assignment',
      );
    }
    const result = await this.prisma.event.update({
      where: {
        id: eventIds.id,
      },
      data: {
        Assignments: {
          delete: {
            id: assignmentId,
          },
        },
      },
    });
    if (result) {
      return {
        message: `The assignment with id ${assignmentId} has been deleted successfully`,
      };
    } else {
      throw new InternalServerErrorException(
        "The assignment couldn't be deleted successfully",
      );
    }
  }

  //--------------------------------------------------
  //THE FOLLOWING IS FOR JOINNING/LEAVING AN EVENT LOGIC
  //--------------------------------------------------
  async joinEvent(userId: string, joinEventDto: JoinEventDto) {
    const { eventId } = joinEventDto;
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        joinedUsers: true,
        moderators: true,
        presenters: true,
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    //To ensure that the user cannot join if he creator, moderator, or presenter of the event
    const isAssigned =
      event.eventCreatorId === userId ||
      event.presenters.some((presenter) => presenter.id === userId) ||
      event.moderators.some((moderator) => moderator.id === userId);
    if (isAssigned) {
      throw new BadRequestException(
        'User is assigned as eventCreator, moderator, or presenter',
      );
    }

    // Fetch the user to get their gender
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { gender: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check gender compatibility
    const isGenderCompatible =
      user.gender == event.gender || event.gender == 'BOTH';
    if (!isGenderCompatible) {
      throw new BadRequestException(
        "User gender does not match the event's accepted gender",
      );
    }

    const isAlreadyJoined = event.joinedUsers.some(
      (user) => user.id === userId,
    );
    if (isAlreadyJoined) {
      throw new BadRequestException('User already joined this event');
    }
    //Check if the event is public or private
    if (!event.isPublic) {
      throw new BadRequestException(
        'Event is private, you cannot join it directly, instead you should request to join it',
      );
    }
    if (event.seatCapacity !== null && event.seatCapacity > 0) {
      const joinedCount = event.joinedUsers.length;
      if (joinedCount >= event.seatCapacity) {
        throw new BadRequestException('Event has reached its seat capacity');
      }
    }

    //Add the user to joined users as well as the EventChat
    await this.prisma.event.update({
      where: { id: eventId },
      data: {
        joinedUsers: {
          connect: { id: userId },
        },
        EventChat: { update: { Users: { connect: { id: userId } } } },
      },
    });
  }

  async leaveEvent(userId: string, eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { joinedUsers: true, moderators: true, presenters: true },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }
    let role;
    const isUserJoined = event.joinedUsers.some((user) => user.id === userId);
    const isUserPresenter = event.presenters.some((user) => user.id === userId);
    const isUserModerator = event.moderators.some((user) => user.id === userId);
    if (!isUserJoined && !isUserModerator && !isUserPresenter) {
      throw new BadRequestException('User is not joined to this event');
    }
    if (isUserJoined) {
      role = 'joinedUsers';
    } else if (isUserModerator) {
      role = 'moderators';
    } else {
      role = 'presenters';
    }
    //disconnect the user from the joinedUsers and the EventChat
    await this.prisma.event.update({
      where: { id: eventId },
      data: {
        [role]: {
          disconnect: { id: userId },
        },
        EventChat: {
          update: { Users: { disconnect: { id: userId } } },
        },
      },
    });
  }
  //--------------------------------------------------
  //THE FOLLOWING IS FOR RATING AN EVENT LOGIC
  //--------------------------------------------------
  async rateEvent(userId: string, eventId: string, rating: number) {
    //the following logic is to ensure that the rating will not be add to event unless that the user is authorized to do that

    //retreive eventCreator, moderators, ,presenters, and joinedUsers for the given eventId
    const eventIds = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        eventCreatorId: true,
        presenters: { select: { id: true } },
        moderators: { select: { id: true } },
        joinedUsers: { select: { id: true } },
        GivenFeedbacks: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
    });
    //Check wether the event exist or not
    if (!eventIds) {
      throw new NotFoundException('Event not found');
    }
    // Check that the user is not conisdered as neither event creator, moderator, nor presenter, but he is considered as joinedUser (attender)
    const isAuthorized =
      eventIds.eventCreatorId !== userId &&
      eventIds.presenters.every((presenter) => presenter.id !== userId) &&
      eventIds.moderators.every((moderator) => moderator.id !== userId) &&
      eventIds.joinedUsers.some((joinedUser) => joinedUser.id === userId);

    if (!isAuthorized) {
      throw new BadRequestException(
        'User is not authorized to rate this event',
      );
    }
    //Check wether the user has already rated an event or not
    const hasRated = eventIds.GivenFeedbacks.some(
      (feedback) => feedback.userId === userId,
    );
    let finalResult;
    if (!hasRated) {
      const result = await this.prisma.event.update({
        where: {
          id: eventId,
        },
        data: {
          GivenFeedbacks: {
            create: {
              rating,
              userId, //Creating an event rating and assign it to the user
            },
          },
        },
        select: {
          GivenFeedbacks: {
            select: {
              rating: true,
            },
          },
        },
      });
      const numberOfRatings = result.GivenFeedbacks.length;
      const sumOfRating = result.GivenFeedbacks.reduce(
        (preRatings, currRating) => preRatings + currRating.rating,
        0,
      );
      const avgRating = sumOfRating / numberOfRatings;
      finalResult = await this.prisma.event.update({
        where: {
          id: eventId,
        },
        data: {
          rating: avgRating, //num of rating is the count
        },
        select: {
          eventCreatorId: true,
          rating: true,
          _count: { select: { GivenFeedbacks: true } },
        },
      });
    } else {
      const feedbackId = eventIds.GivenFeedbacks.find(
        (feedback) => feedback.userId === userId,
      ).id;
      const result = await this.prisma.event.update({
        where: {
          id: eventId,
        },
        data: {
          GivenFeedbacks: {
            update: {
              where: { id: feedbackId },
              data: {
                rating,
              },
            },
          },
        },
        select: {
          GivenFeedbacks: {
            select: {
              rating: true,
            },
          },
        },
      });
      const numberOfRatings = result.GivenFeedbacks.length;
      const sumOfRating = result.GivenFeedbacks.reduce(
        (preRatings, currRating) => preRatings + currRating.rating,
        0,
      );
      const avgRating = sumOfRating / numberOfRatings;
      finalResult = await this.prisma.event.update({
        where: {
          id: eventId,
        },
        data: {
          rating: avgRating, //num of rating is the count
        },
        select: {
          rating: true,
          eventCreatorId: true,
          _count: { select: { GivenFeedbacks: true } },
        },
      });
    }
    if (!finalResult) {
      throw new InternalServerErrorException(
        "The event's rating couldn't be updated successfully",
      );
    }
    //update the eventCreator rating
    //step 1: retreive all event's created by the eventCreator with their ratings and number of ratings as well
    const eventCreatorEvents = await this.prisma.event.findMany({
      where: {
        eventCreatorId: finalResult.eventCreatorId,
      },
      select: {
        rating: true,
        _count: { select: { GivenFeedbacks: true } },
      },
    });
    //step 2: calculate the average rating of the eventCreator
    const totalRatings = eventCreatorEvents.reduce(
      (sum, event) => sum + event._count.GivenFeedbacks,
      0,
    );
    const sumOfRatings = eventCreatorEvents.reduce(
      (sum, event) => sum + event.rating * event._count.GivenFeedbacks,
      0,
    );
    const avgRating = sumOfRatings / totalRatings;
    //step 3: update the eventCreator rating
    await this.prisma.user.update({
      where: {
        id: finalResult.eventCreatorId,
      },
      data: {
        rating: avgRating,
      },
    });
    return {
      message: 'The rating has been added successfully',
      avgRating: finalResult.rating,
      numberOfRatings: finalResult._count.GivenFeedbacks,
    };
  }
  async eventRating(eventId: string) {
    const result = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        rating: true,
        _count: { select: { GivenFeedbacks: true } },
      },
    });
    //Check wether the event exist or not
    if (!result) {
      throw new NotFoundException('Event not found');
    }

    return {
      avgRating: result.rating,
      numberOfRatings: result._count.GivenFeedbacks,
    };
  }
  //not useful anymore, it should be removed
  async assignRole(
    userId: string,
    eventId: string,
    assignedUserId: string,
    role: string,
  ) {
    const eventIds = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        eventCreatorId: true,
        moderators: {
          select: {
            id: true,
          },
        },
      },
    });
    //Check wether the event exist or not
    if (!eventIds) {
      throw new NotFoundException('Event not found');
    }

    const isAuthorized =
      eventIds.eventCreatorId === userId ||
      eventIds.moderators.every((moderator) => moderator.id === userId);

    if (!isAuthorized) {
      throw new BadRequestException(
        'User is not authorized to add materials to this event',
      );
    }
    return this.prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        EventChat: {
          connect: {
            id: assignedUserId,
          },
        },
        [role]: {
          connect: {
            id: assignedUserId,
          },
        },
      },
      select: {
        [role]: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  //Add endpoint, also revise the logic and discuss if the unassigned user will be removed from the event or he will be considered as joinedUser(attendee)
  async unAssignRole(
    userId: string,
    eventId: string,
    assignedUserId: string,
    role: string,
  ) {
    const eventIds = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        eventCreatorId: true,
        moderators: {
          select: {
            id: true,
          },
        },
        presenters: { select: { id: true } },
      },
    });
    //Check wether the event exist or not
    if (!eventIds) {
      throw new NotFoundException('Event not found');
    }

    const isAuthorized =
      eventIds.eventCreatorId === userId ||
      eventIds.moderators.every((moderator) => moderator.id === userId);

    if (!isAuthorized) {
      throw new BadRequestException(
        'User is not authorized to add materials to this event',
      );
    }
    const isAssigned =
      eventIds.presenters.some((presenter) => presenter.id === userId) ||
      eventIds.moderators.some((moderator) => moderator.id === userId);
    if (!isAssigned) {
      throw new BadRequestException("The user isn't assigned");
    }
    return this.prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        EventChat: {
          disconnect: {
            id: assignedUserId,
          },
        },
        [role]: {
          disconnect: {
            id: assignedUserId,
          },
        },
      },
      select: {
        [role]: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  //-----------------------------------------
  //Invitation endpoints
  //-----------------------------------------
  async sendInvitation(
    userId: string,
    eventId: string,
    receiverId: string,
    invitationType: InvitationType,
    roleType?: RoleType,
  ) {
    // Check if the user is authorized to send invitations
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        eventCreator: true,
        presenters: true,
        moderators: true,
        joinedUsers: true,
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const isEventCreator = event.eventCreatorId === userId;
    const isPresenter = event.presenters.some(
      (presenter) => presenter.id === userId,
    );
    const isModerator = event.moderators.some(
      (moderator) => moderator.id === userId,
    );
    const isJoinedUser = event.joinedUsers.some(
      (joinedUser) => joinedUser.id === userId,
    );
    if (receiverId === userId || event.eventCreatorId === receiverId) {
      throw new BadRequestException(
        'You cannot send an invitation to yourself or the event creator',
      );
    }

    if (!isEventCreator && !isPresenter && !isModerator && !isJoinedUser) {
      throw new ForbiddenException(
        'You do not have permission to send invitations for this event because you are not related to it',
      );
    }
    //ensures that the there's no existing invitation with the same details in pending status
    const previousInvitation = await this.prisma.invitation.findFirst({
      where: {
        sender_id: userId,
        receiver_id: receiverId,
        event_id: eventId,
        invitationType,
        status: 'PENDING',
        roleType,
      },
    });
    if (previousInvitation) {
      throw new BadRequestException('Invitation already sent');
    }
    //check if the receiver is existing user or not
    const receiver = await this.prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true },
    });
    if (!receiver) {
      throw new NotFoundException('Receiver not found');
    }
    //Check if the invitation is for assigning a role
    if (invitationType === 'ROLE_INVITATION') {
      if (!roleType) {
        throw new BadRequestException('Role type is required');
      }
      const isAuthoiorized =
        event.eventCreatorId === userId ||
        event.moderators.some((moderator) => moderator.id === userId);
      if (!isAuthoiorized) {
        throw new ForbiddenException(
          'You do not have permission to assign this role',
        );
      }
      const isReceiverModerator = event.moderators.some(
        (moderator) => moderator.id === receiverId,
      );
      const isReceiverPresenter = event.presenters.some(
        (presenter) => presenter.id === receiverId,
      );
      //check if the receiver is already in the deisred role
      const isAlreadyAssigned =
        roleType === 'MODERATOR' ? isReceiverModerator : isReceiverPresenter;
      if (isAlreadyAssigned) {
        throw new BadRequestException(
          `User is already assigned to ${roleType} role`,
        );
      }
      // Create the invitation
      return await this.prisma.invitation.create({
        data: {
          sender_id: userId,
          receiver_id: receiverId,
          event_id: eventId,
          invitationType,
          roleType,
        },
      });
    } else {
      //Innvitation for event
      //check if the event is private, if so, then only the assinged users can send invites
      if (!event.isPublic) {
        const isAuthorized =
          event.eventCreatorId === userId ||
          event.presenters.some((presenter) => presenter.id === userId) ||
          event.moderators.some((moderator) => moderator.id === userId);
        if (!isAuthorized) {
          throw new ForbiddenException(
            'You do not have permission to send invitations for this event',
          );
        }
      }
      // Check if the receiver is already a participant
      const isAlreadyParticipant =
        event.eventCreatorId === receiverId ||
        event.presenters.some((presenter) => presenter.id === receiverId) ||
        event.moderators.some((moderator) => moderator.id === receiverId) ||
        event.joinedUsers.some((joinedUser) => joinedUser.id === receiverId);
      if (isAlreadyParticipant) {
        throw new BadRequestException('User is already a participant');
      }

      // Create the invitation
      return await this.prisma.invitation.create({
        data: {
          sender_id: userId,
          receiver_id: receiverId,
          event_id: eventId,
          invitationType,
        },
      });
    }
  }
  //-----------------------------------------
  //Request endpoints
  //-----------------------------------------
  async sendRequest(
    userId: string,
    eventId: string,
    requestType: RequestType,
    roleType?: RoleType,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        joinedEvents: { select: { id: true } },
        createdEvents: { select: { id: true } },
        moderatedEvents: { select: { id: true } },
        presentedEvents: { select: { id: true } },
      },
    });
    //check if the user exists
    if (!user) {
      throw new NotFoundException('User not found');
    }
    //check if the user is already joined the event
    const isAlreadyJoined = user.joinedEvents.some(
      (joinedEvent) => joinedEvent.id === eventId,
    );
    const isAlreadyModerator = user.moderatedEvents.some(
      (moderatedEvent) => moderatedEvent.id === eventId,
    );
    const isAlreadyPresenter = user.presentedEvents.some(
      (presentedEvent) => presentedEvent.id === eventId,
    );
    const isEventCreator = user.createdEvents.some(
      (createdEvent) => createdEvent.id === eventId,
    );

    //check if the event exist and if the user is already sent a request
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: {
        joinedUsers: { select: { id: true } },
        eventCreatorId: true,
        presenters: { select: { id: true } },
        moderators: { select: { id: true } },
        Requests: {
          where: {
            sender_id: userId,
            status: 'PENDING',
            requestType,
            roleType,
          },
        },
      },
    });
    //check if the event exists
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    //check if the user is already sent a request
    const isAlreadyRequested = event.Requests.length > 0;
    if (isAlreadyRequested) {
      throw new BadRequestException('User has already sent a request');
    }

    //check if the user is already an event creator
    if (isEventCreator) {
      throw new BadRequestException('User is already an event creator');
    }
    if (requestType === 'EVENT_REQUEST') {
      //check if the user is already joined
      if (isAlreadyJoined) {
        throw new BadRequestException('User is already joined the event');
      }
      //check if the user is already a moderator or presenter
      if (isAlreadyModerator || isAlreadyPresenter) {
        throw new BadRequestException(
          'User is already a moderator or presenter',
        );
      }

      //create the request
      return await this.prisma.request.create({
        data: {
          sender_id: userId,
          event_id: eventId,
          requestType,
        },
      });
    } else if (requestType === 'ROLE_REQUEST') {
      //check if the user is joined
      if (!isAlreadyJoined && !isAlreadyModerator && !isAlreadyPresenter) {
        throw new BadRequestException('User is not joined the event');
      }
      if (!roleType) {
        throw new BadRequestException('roleType is required');
      }
      //check if the user is already a moderator or presenter
      const isAlreadyAssigned =
        roleType === 'MODERATOR' ? isAlreadyModerator : isAlreadyPresenter;
      if (isAlreadyAssigned) {
        throw new BadRequestException(
          `User is already assigned to ${roleType} role`,
        );
      }
      return await this.prisma.request.create({
        data: {
          sender_id: userId,
          event_id: eventId,
          requestType,
          roleType,
        },
      });
    }
  }
  //see the logic of updating status once request is made to invitation's endpoint
  async getRequests(userId: string, eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: {
        eventCreatorId: true,
        moderators: { select: { id: true } },
        presenters: { select: { id: true } },
        Requests: {
          where: { event_id: eventId },
          select: {
            id: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            requestType: true,
            roleType: true,
            Sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                gender: true,
                profilePictureUrl: true,
              },
            },
          },
          orderBy: { updatedAt: 'desc' },
        },
      },
    });
    //Check wether the event exist or not
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    // Check if the userId matches any of the roles
    const isPresenter = event.presenters.some(
      (presenter) => presenter.id === userId,
    );
    const isAuthorized =
      event.eventCreatorId === userId ||
      isPresenter ||
      event.moderators.some((moderator) => moderator.id === userId);
    if (!isAuthorized) {
      throw new BadRequestException(
        'User is not authorized to view requests for this event',
      );
    }
    let requests = event.Requests;
    if (!requests || requests.length === 0) {
      throw new NotFoundException('No requests found for this event');
    }
    //if the user is presenter, then exclude the RoleRequest
    if (isPresenter)
      requests = requests.filter(
        (request) => request.requestType !== 'ROLE_REQUEST',
      );
    return requests;
  }
  async respondToRequest(userId: string, requestId: string, decision: boolean) {
    // Check if the user is authorized to respond to the request
    const request = await this.prisma.request.findUnique({
      where: { id: requestId },

      include: {
        Sender: {
          select: {
            id: true,
          },
        },
        Event: {
          select: {
            isPublic: true,
            eventCreatorId: true,
            moderators: { select: { id: true } },
            presenters: { select: { id: true } },
            joinedUsers: { select: { id: true } },
          },
        },
      },
    });
    if (!request) {
      throw new NotFoundException('Request not found');
    }
    if (!request.Event) {
      throw new NotFoundException('Event not found');
    }
    if (request.status !== 'PENDING') {
      throw new BadRequestException('This request has already been responded');
    }

    // Check if the sender of the request is the same as the userId  -> it's helpful when the user is moderator and you don't want the moderator to change his role by requesting and responding to his request. I COMMENTTED IT ,LATER WE'LL DISCUSS IT
    // if (request.Sender.id !== userId) {
    //   throw new BadRequestException(
    //     'User is not authorized to respond to his request',
    //   );
    // }

    const isSenderIsPresenter = request.Event.presenters.some(
      (presenter) => presenter.id === request.sender_id,
    );
    const isSenderIsModerator = request.Event.moderators.some(
      (moderator) => moderator.id === request.sender_id,
    );
    const isSenderIsJoinedUser = request.Event.joinedUsers.some(
      (joinedUser) => joinedUser.id === request.sender_id,
    );

    if (decision) {
      if (request.requestType === 'ROLE_REQUEST') {
        // Check if the userId matches any of the roles
        const isAuthorized =
          request.Event.eventCreatorId === userId ||
          request.Event.moderators.some((moderator) => moderator.id === userId);
        if (!isAuthorized) {
          throw new BadRequestException(
            'User is not authorized to respond to this request',
          );
        }
        const role =
          request.roleType === 'MODERATOR' ? 'moderators' : 'presenters';
        //check if the user is already in the desired role
        const isAlreadyInRole = request.Event[role].some(
          (user) => user.id === userId,
        );
        //check if the user is already in the desired rol
        if (isAlreadyInRole) {
          //might be better to delete the request
          await this.prisma.request.update({
            where: {
              id: requestId,
            },
            data: {
              status: 'CANCELED_BY_SYSTEM',
            },
          });
          throw new BadRequestException(
            `You are already in the ${request.roleType} role, and the request has been canceled`,
          );
        }
        // check if the user has other roles already, if so, override the role
        if (
          isSenderIsJoinedUser ||
          isSenderIsModerator ||
          isSenderIsPresenter
        ) {
          let roleToRemove;
          if (isSenderIsJoinedUser) {
            roleToRemove = 'joinedUsers';
          } else if (isSenderIsPresenter) {
            roleToRemove = 'presenters';
          } else {
            roleToRemove = 'moderators';
          }
          // remove the user from the previous role
          await this.prisma.event.update({
            where: {
              id: request.event_id,
            },
            data: {
              [roleToRemove]: {
                disconnect: {
                  id: request.sender_id,
                },
              },
            },
          });
        }
        // connect the user to the new role
        await this.prisma.event.update({
          where: {
            id: request.event_id,
          },
          data: {
            [role]: {
              connect: {
                id: request.sender_id,
              },
            },
            EventChat: {
              update: { Users: { connect: { id: request.sender_id } } },
            },
          },
        });
        await this.prisma.request.update({
          where: {
            id: requestId,
          },
          data: {
            status: 'ACCEPTED',
          },
        });
      } else if (request.requestType === 'EVENT_REQUEST') {
        //if the event is private then, only the authorized roles can response
        if (!request.Event.isPublic) {
          const isAuthorized =
            request.Event.eventCreatorId === userId ||
            request.Event.moderators.some(
              (moderator) => moderator.id === userId,
            );
          if (!isAuthorized) {
            throw new BadRequestException(
              "You're not authorized to respond since the event is private and you aren't a moderator or eventCreator",
            );
          }
        }
        //If the request is to joinning the event and the sender is already joined the event despite the role he assigned to, the system will mark the request as Canceled and will throw an Error
        if (
          isSenderIsModerator ||
          isSenderIsPresenter ||
          isSenderIsJoinedUser
        ) {
          await this.prisma.request.update({
            where: { id: requestId },
            data: {
              status: 'CANCELED_BY_SYSTEM',
            },
          });
          throw new BadRequestException(
            'The sender is Already joined or play a role the event ',
          );
        }
        await this.prisma.event.update({
          where: {
            id: request.event_id,
          },
          data: {
            joinedUsers: {
              connect: {
                id: request.sender_id,
              },
            },
            EventChat: {
              update: { Users: { connect: { id: request.sender_id } } },
            },
          },
        });
        await this.prisma.request.update({
          where: {
            id: requestId,
          },
          data: {
            status: 'ACCEPTED',
          },
        });
      }
    } else {
      await this.prisma.request.update({
        where: {
          id: requestId,
        },
        data: {
          status: 'REJECTED',
        },
      });
    }
    return {
      message: 'Request has been responded successfully',
      status: decision ? 'ACCEPTED' : 'REJECTED',
      requestId,
    };
  }
  //-----------------------------------------
  // Certificate endpoint
  //-----------------------------------------
  // async generateCertificate(userId: string) {
  //   const pdfDoc = await PDFDocument.create();

  //   // Register fontkit
  //   pdfDoc.registerFontkit(fontkit);

  //   // Load the Arabic font (make sure you have a TTF/OTF Arabic font)
  //   const basePath = path.resolve(__dirname, '../../src/event/pdfassets');
  //   const arabicFontPath = path.resolve(basePath, 'Amiri-BoldItalic.ttf');
  //   const arabicFontBytes = fs.readFileSync(arabicFontPath);
  //   const arabicFont = await pdfDoc.embedFont(arabicFontBytes);

  //   // Create a page for the PDF
  //   const page = pdfDoc.addPage([842, 595]); // A4 size (landscape)

  //   // Add Arabic text to the PDF
  //   let arabicText = ArabicReshaper.convertArabic('السلام عليكم');
  //   const fontSize = 34;

  //   // Get the width of the Arabic text to center it
  //   const textWidth = arabicFont.widthOfTextAtSize(arabicText, fontSize);

  //   // Place the Arabic text at the center of the page
  //   page.drawText(arabicText, {
  //     x: 442,
  //     y: 400, // Vertical position
  //     size: fontSize,
  //     font: arabicFont,
  //     color: rgb(0, 0, 0),
  //   });

  //   // Save the PDF to a file
  //   const pdfBytes = await pdfDoc.save();
  //   const outputPath = path.resolve(
  //     __dirname,
  //     `../../src/event/pdfassets/${userId}.pdf`,
  //   );
  //   fs.writeFileSync(outputPath, pdfBytes);

  //   return `Certificate generated successfully: ${outputPath}`;
  // }
  // Generate Arabic PDF

  async getCertificate(userId: string, eventId: string) {
    //check if the user is authorized to get the certificate
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: {
        title: true,
        startDateTime: true,
        endDateTime: true,
        eventCreator: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        joinedUsers: {
          where: { id: userId },
          select: { firstName: true, lastName: true },
        },
      },
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    const user = event.joinedUsers[0];
    if (!user) {
      throw new BadRequestException(
        'User is not authorized to get the certificate',
      );
    }

    if (event.endDateTime > new Date()) {
      throw new BadRequestException(
        'The event is not finished yet, you can get the certificate after the event ends',
      );
    }
    // Define consistent paths
    const basePath = path.resolve(__dirname, '../../src/event/pdfassets');
    const pdfPath = path.join(basePath, 'Munaseq_Certificate.pdf');
    const arabicFontPath = path.resolve(basePath, '103-Tahoma.ttf');
    const arabicFontBytes = fs.readFileSync(arabicFontPath);

    // Check if files exist
    if (!fs.existsSync(pdfPath)) {
      throw new Error(`PDF template not found at: ${pdfPath}`);
    }

    const existingPdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    pdfDoc.registerFontkit(fontkit);
    // Use a standard font instead of a custom font
    const arabicFont = await pdfDoc.embedFont(arabicFontBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    //retreive or create the certificate
    let certificate: any = await this.prisma.certificate.findFirst({
      where: {
        user_Id: userId,
        event_Id: eventId,
      },
      select: {
        certificateUrl: true,
      },
    });
    if (certificate) {
      return { certificateUrl: certificate.certificateUrl };
    }
    certificate = await this.prisma.certificate.create({
      data: {
        user_Id: userId,
        event_Id: eventId,
      },
      select: {
        id: true,
      },
    });
    if (!certificate) {
      throw new BadRequestException(`Certificate Couldn't be created`);
    }
    //extract the data from the certificate
    const eventCreatorFirstName = event.eventCreator.firstName;
    const eventCreatorLastName = event.eventCreator.lastName;
    const eventCreatorName = ArabicReshaper.convertArabic(
      `${eventCreatorFirstName} ${eventCreatorLastName}`,
    );
    const eventTitle = ArabicReshaper.convertArabic(event.title);
    const participantFirstName = user.firstName;

    const participantLastName = user.lastName;

    const participantName = ArabicReshaper.convertArabic(
      `${participantFirstName} ${participantLastName}`,
    );
    //if the start date is equal to the end date, then we will show only the start date
    const startDate = event.startDateTime;
    const endDate = event.endDateTime;
    let completionDate: string;
    const startDateString = startDate.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
    const endDateString = endDate.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
    if (startDateString == endDateString) {
      completionDate = startDateString;
    } else {
      completionDate = `${endDateString} - ${startDateString}`;
    }

    const certifId = certificate.id;
    const certifLabel = 'معرف الفعالية:';

    // Certificate title
    firstPage.drawText(eventTitle, {
      x: width / 2 - arabicFont.widthOfTextAtSize(eventTitle, 38) / 2,
      y: height - 172,
      size: 38,
      font: arabicFont,
      color: rgb(33 / 255, 36 / 255, 39 / 255),
    });

    // Name text
    firstPage.drawText(participantName, {
      x: width / 2 - arabicFont.widthOfTextAtSize(participantName, 22) / 2,
      y: height - 255,
      size: 22,
      font: arabicFont,
      color: rgb(33 / 255, 36 / 255, 39 / 255),
    });

    // Course name
    firstPage.drawText(eventCreatorName, {
      x: width * 0.75 - arabicFont.widthOfTextAtSize(eventCreatorName, 16) / 2,
      y: height / 2 - 120,
      size: 16,
      font: arabicFont,
      color: rgb(33 / 255, 36 / 255, 39 / 255),
    });

    firstPage.drawText(completionDate, {
      x: width * 0.25 - arabicFont.widthOfTextAtSize(completionDate, 16) / 2,
      y: height / 2 - 120,
      size: 16,
      font: arabicFont,
      color: rgb(33 / 255, 36 / 255, 39 / 255),
    });

    // Certificate ID
    firstPage.drawText(certifId, {
      x:
        width -
        arabicFont.widthOfTextAtSize(certifLabel, 10) -
        arabicFont.widthOfTextAtSize(certifId, 10) -
        10,
      y: 76,
      size: 10,
      font: arabicFont,
      color: rgb(84 / 255, 84 / 255, 84 / 255),
    });

    // Save the modified PDF
    const pdfBytes = await pdfDoc.save();
    const certificateUrl = await uploadCertificate(pdfBytes, certifId);
    if (!certificateUrl) {
      throw new BadRequestException(`Certificate Couldn't be uploaded`);
    }
    await this.prisma.certificate.update({
      where: {
        id: certifId,
      },
      data: {
        certificateUrl,
      },
    });

    return { certificateUrl };
  }
}
