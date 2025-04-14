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
  CreateAssignment,
  CreateEventDto,
  JoinEventDto,
  UpdateAssignmentDTO,
  UpdateEventDto,
} from './dtos';
import { UpdateQuizDto } from './dtos/update-quiz.dto';
import { AssignmentQuestionDTO } from './dtos/create-assignment-question.dto';
import { UpdateAssignmentQuestionDTO } from './dtos/update-assignment-question.dto';
import { TakeAssigmentDTO } from './dtos/take-assignment.dto';
import { AssignRoles } from './dtos/assign-role.dto';
import { InvitationType, RoleType } from '@prisma/client';
type TypeOfSubmisson = 'SUBMITTED' | 'SAVED_ANSWERS';

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
    const eventIds = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: {
        eventCreatorId: true,
      },
    });
    //Check wether the event exist or not
    if (!eventIds) {
      throw new NotFoundException('Event not found');
    }
    // Check if the userId matches any of the roles
    const isAuthorized = eventIds.eventCreatorId === userId;

    if (!isAuthorized) {
      throw new BadRequestException(
        'User is not authorized to delete this event',
      );
    }
    await this.prisma.event.delete({
      where: { id: eventId },
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
    execludedEvents?: string[],
  ) {
    const skipedRecords = (pageNumber - 1) * pageSize;
    if (title) {
      return this.prisma.event.findMany({
        where: {
          id: {
            notIn: execludedEvents,
          },
          isPublic: true,
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
          id: {
            notIn: execludedEvents,
          },
          isPublic: true,
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
  findAllCurrentUserEvents(
    eventCreatorId: string,
    title?: string,
    pageNumber: number = 1,
    pageSize: number = 5,
    execludedEvents?: string[],
  ) {
    const skipedRecords = (pageNumber - 1) * pageSize;
    if (title) {
      return this.prisma.event.findMany({
        where: {
          id: { notIn: execludedEvents },
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
          id: { notIn: execludedEvents },
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
    execludedEvents?: string[],
  ) {
    const skipedRecords = (pageNumber - 1) * pageSize;
    if (title) {
      return this.prisma.event.findMany({
        where: {
          id: {
            notIn: execludedEvents,
          },
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
          id: {
            notIn: execludedEvents,
          },
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
    execludedUsers?: string[],
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
              id: {
                notIn: execludedUsers, //enables the client (front-end) to explicitly execlude users
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
            where: {
              id: {
                notIn: execludedUsers,
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

  async getQuiz(userId: string, eventId: string) {
    //the following logic is to ensure that the quiz will not be shown  unless the user is authorized to do that

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
        Quizzes: {
          select: {
            id: true,
            questions: true,
            startDate: true,
            endDate: true,
            timeLimit: true,
            createdAt: true,
          },
        },
      },
    });
    return result ?? { message: 'The event doesnt have any quizzes' };
  }

  async addQuizToEvent(
    userId: string,
    eventId: string,
    CreateQuizDto: CreateQuizDto,
  ) {
    //the following logic is to ensure that the quiz will not be added to the event unless the user is authorized to do that

    const eventIds = await this.prisma.event.findUniqueOrThrow({
      where: { id: eventId },
      select: {
        eventCreatorId: true,
        presenters: { select: { id: true } },
        moderators: { select: { id: true } },
      },
    });

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

    return this.prisma.event.update({
      where: { id: eventId },
      data: {
        Quizzes: {
          create: {
            ...CreateQuizDto,
            questions: {
              create: CreateQuizDto.questions,
            },
          },
        },
      },
      select: {
        Quizzes: {
          select: {
            id: true,
            questions: true,
            startDate: true,
            endDate: true,
            timeLimit: true,
          },
        },
      },
    });
  }

  async updateQuiz(
    userId: string,
    eventId: string,
    quizId: string,
    updateQuizDto: UpdateQuizDto,
  ) {
    // Step 1: Retrieve eventCreator, moderators, presenters, and event IDs
    const event = await this.prisma.event.findFirstOrThrow({
      where: {
        Quizzes: {
          some: {
            id: quizId, // Check for an event containing the quizId
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

    // Step 2: Check if the user is authorized to update the quiz
    const isAuthorized =
      event.eventCreatorId === userId ||
      event.presenters.some((presenter) => presenter.id === userId) ||
      event.moderators.some((moderator) => moderator.id === userId);

    if (!isAuthorized) {
      throw new BadRequestException(
        'User is not authorized to update this quiz',
      );
    }

    // Step 3: Verify that the quiz exists and retrieve its associated questions
    const existingQuiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      select: {
        questions: {
          select: { id: true },
        },
      },
    });

    if (!existingQuiz) {
      throw new BadRequestException('Quiz not found');
    }

    // Step 4: Ensure the provided questions are part of the quiz
    const existingQuestionIds = existingQuiz.questions.map((q) => q.id);
    const invalidQuestions = updateQuizDto.questions.filter(
      (question) => !existingQuestionIds.includes(question.id),
    );

    if (invalidQuestions.length > 0) {
      throw new BadRequestException(
        'One or more questions are not linked to this quiz',
      );
    }

    // Step 5: Update the quiz and questions
    return this.prisma.quiz.update({
      where: { id: quizId },
      data: {
        startDate: updateQuizDto.startDate,
        endDate: updateQuizDto.endDate,
        timeLimit: updateQuizDto.timeLimit,
        questions: {
          updateMany: updateQuizDto.questions.map((question) => ({
            where: { id: question.id },
            data: {
              text: question.text,
              questionType: question.questionType,
              options: question.options,
              correctAnswer: question.correctAnswer,
            },
          })),
        },
      },
    });
  }

  async startQuiz(userId: string, eventId: string, quizId: string) {
    // Step 1: Retrieve the quiz and its details
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
          },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    // Step 2: Verify the quiz is within the allowed timeframe
    if (new Date() < quiz.startDate) {
      throw new BadRequestException('Quiz has not started yet');
    }

    if (new Date() > quiz.endDate) {
      throw new BadRequestException('Quiz has ended');
    }

    // Step 3: Check if the user has already started or taken the quiz
    const existingResult = await this.prisma.takeQuiz.findFirst({
      where: {
        userId,
        quizId,
      },
    });

    if (existingResult) {
      throw new BadRequestException('Quiz has already been taken or started');
    }

    // Step 4: Create a new TakeQuiz record when the user starts the quiz
    const takeQuizRecord = await this.prisma.takeQuiz.create({
      data: {
        userId, // userId is a string
        quizId, // quizId is a string
        // We don't need to set score and answers at the start
      },
    });

    return takeQuizRecord; // Return the created TakeQuiz record
  }

  async submitQuiz(
    userId: string,
    quizId: string,
    answers: { questionId: string; answer: string }[],
  ) {
    console.log('Received answers:', answers); // Log answers to debug

    // Check if answers is an array
    if (!Array.isArray(answers)) {
      throw new BadRequestException('Answers must be an array');
    }
    // Step 1: Retrieve the quiz and its details
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      select: {
        id: true,
        timeLimit: true,
        questions: {
          select: {
            id: true,
            correctAnswer: true,
          },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    // Step 2: Retrieve the user's TakeQuiz record
    const takeQuizRecord = await this.prisma.takeQuiz.findFirst({
      where: {
        userId,
        quizId,
      },
    });

    if (!takeQuizRecord) {
      throw new BadRequestException('User has not started this quiz');
    }

    // Step 3: Check if the user has already submitted their answers
    if (takeQuizRecord.score !== null) {
      throw new BadRequestException('Quiz has already been submitted');
    }

    // Step 4: Check if the user is submitting past the time limit
    const elapsedTime =
      (new Date().getTime() - takeQuizRecord.createdAt.getTime()) / 60000; // Time in minutes
    if (elapsedTime > quiz.timeLimit) {
      throw new BadRequestException('Time limit exceeded');
    }

    // Step 5: Calculate the user's score out of 100
    let score = 0;
    answers.forEach((answer) => {
      const question = quiz.questions.find((q) => q.id === answer.questionId);
      if (question && question.correctAnswer === answer.answer) {
        score++;
      }
    });

    // Step 6: Update the TakeQuiz record with the answers and score
    const updatedTakeQuiz = await this.prisma.takeQuiz.update({
      where: { id: takeQuizRecord.id },
      data: {
        score: (score / quiz.questions.length) * 100, // Calculate score out of 100
        answers: JSON.stringify(answers), // Save the answers as a JSON array
      },
    });

    return updatedTakeQuiz; // Return the updated TakeQuiz record
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

  async deleteQuiz(userId: string, eventId: string, quizId: string) {
    // Step 1: Retrieve eventCreator, moderators, presenters, and event IDs
    const event = await this.prisma.event.findFirst({
      where: {
        id: eventId,
      },
      select: {
        id: true,
        eventCreatorId: true,
        presenters: { select: { id: true } },
        moderators: { select: { id: true } },
      },
    });

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
    const isAuthorized =
      eventIds.eventCreatorId === userId ||
      eventIds.presenters.some((presenter) => presenter.id === userId) ||
      eventIds.moderators.some((moderator) => moderator.id === userId) ||
      eventIds.joinedUsers.some((joinedUsers) => joinedUsers.id === userId);

    if (!isAuthorized) {
      throw new BadRequestException(
        'User is not authorized to view the assignments of this event',
      );
    }
    let result = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        _count: { select: { Assignments: true } },
        Assignments: {
          select: {
            _count: true,
            createdAt: true,
            assignmentTitle: true,
            id: true,
            startDate: true,
            endDate: true,
            TakeAssignment: { where: { userId }, select: { status: true } }, //if does it exist then it's
          },
        },
      },
    });
    const assignmentsWithStatus = result.Assignments.map((assignment) => {
      const currDate = new Date();
      let status;
      if (currDate < assignment.startDate) {
        status = 'AVAILABLE_SOON';
      } else if (currDate > assignment.endDate) {
        status = 'EXPIRED';
      } else {
        status = 'AVAILABLE';
      }

      return { status, ...assignment };
    });
    result = { ...result, Assignments: assignmentsWithStatus };
    return result ?? [];
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
    const remove = body.questions.some(
      (question) => question.questionType === 'REMOVE',
    );
    if (remove) {
      throw new BadRequestException(
        "A question can't be added because it holds 'REMOVE' questionType",
      );
    }
    if (!isAuthorized) {
      throw new BadRequestException(
        'User is not authorized to add assignment to this event',
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
            assignmentTitle: true,
            questions: true,
            createdAt: true,
            startDate: true,
            endDate: true,
          },
        },
      },
    });
    if (!event) {
      throw new NotFoundException('assignment not found');
    }
    // Check if the userId matches any of the roles
    const isAuthorized =
      event.eventCreatorId === userId ||
      event.presenters.some((presenter) => presenter.id === userId) ||
      event.moderators.some((moderator) => moderator.id === userId) ||
      event.joinedUsers.some((joinedUsers) => joinedUsers.id === userId);

    if (!isAuthorized) {
      throw new BadRequestException("You're not allowed to do this assignment");
    }

    //extract the assignment from the event's data
    const result = { assignment: event.Assignments[0], takeAssignment: null };
    //check if there's a taken assignment by the user and bring it if exist, otherwise only retreive the questions
    const takenAssignment = await this.prisma.takeAssignment.findFirst({
      where: { assignmentId, userId },
    });
    if (takenAssignment) {
      return { ...result, takeAssignment: takenAssignment };
    }
    return { ...result };
  }

  //TODO endpoint for creating a
  async saveAssignment(
    userId: string,
    assignmentId: string,
    answers: object,
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
      throw new NotFoundException('assignment not found');
    }

    // Check if the userId matches any of the roles ---> refactor the authorization logic into single one function
    const isAuthorized = event.joinedUsers.some(
      (joinedUser) => joinedUser.id === userId,
    );
    if (!isAuthorized) {
      throw new BadRequestException("You're not allowed to do this assignment");
    }
    //check if the assignment is submitted, if so, throw an error
    let assignmentTake = event.Assignments[0].TakeAssignment[0];
    if (assignmentTake?.status === 'SUBMITTED') {
      throw new BadRequestException("You've already submitted this assignment");
    }
    //check if assignment is within the valid period (means available to take)
    const currDate = new Date();
    if (
      event?.Assignments[0]?.endDate <= currDate &&
      event?.Assignments[0]?.startDate >= currDate
    ) {
      throw new BadRequestException('The Assignment time expired');
    }
    //check if the  user has an existing taken assignment, if not,create a new one
    if (!assignmentTake) {
      assignmentTake = await this.prisma.takeAssignment.create({
        data: { answers, assignmentId, userId, status: typeOfSubmission },
      });
    } else {
      assignmentTake = await this.prisma.takeAssignment.update({
        where: {
          id: assignmentTake.id,
        },
        data: {
          answers,
        },
      });
    }
    return assignmentTake;
  }
  async updateAssignment(
    assignementId: string,
    userId: string,
    body: UpdateAssignmentDTO,
  ) {
    //retreive eventCreator, moderators, ,presenters, and event ids, also retrieve the ids of the assignment's questions
    const event = await this.prisma.event.findFirst({
      //findUnique requires a direct unique attribute for event model, in this case the unique attr. isn't direct
      where: {
        Assignments: {
          some: {
            id: assignementId, // will check for an event that has an assignment id matches assignmentId
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
            id: assignementId,
          },

          select: { questions: { select: { id: true } } },
        },
      },
    });
    if (!event) {
      throw new NotFoundException('assignment not found');
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
    }

    const assignment = event.Assignments[0];

    //Extract the existing questions and the new questions
    if (body.questions) {
      let existingQuestions: UpdateAssignmentQuestionDTO[] = [];
      let newQuestions: UpdateAssignmentQuestionDTO[] = [];
      let removedQuestions: UpdateAssignmentQuestionDTO[] = [];
      body.questions.forEach((question) => {
        if (
          assignment.questions.some(
            (existQuestion) => existQuestion.id === question.id,
          )
        ) {
          if (question.questionType === 'REMOVE') {
            removedQuestions.push(question);
          } else {
            existingQuestions.push(question);
          }
        } else {
          newQuestions.push(question);
        }
      });

      const result = await this.prisma.event.update({
        where: {
          id: event.id,
        },
        data: {
          Assignments: {
            update: {
              where: {
                id: assignementId,
              },
              data: {
                startDate: body.startDate,
                endDate: body.endDate,
                questions: {
                  updateMany: existingQuestions.map((existQuestion) => ({
                    where: { id: existQuestion.id },
                    data: {
                      ...existQuestion,
                    },
                  })),
                  createMany: {
                    data: newQuestions.map((newQuestion) => ({
                      questionType: newQuestion.questionType,
                      text: newQuestion.text,
                      options: newQuestion.options,
                      correctAnswer: newQuestion.correctAnswer,
                    })),
                  },
                  deleteMany: removedQuestions.map((removedQuestion) => ({
                    id: removedQuestion.id,
                  })),
                },
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
    } else {
      const result = await this.prisma.event.update({
        where: {
          id: event.id,
        },
        data: {
          Assignments: {
            update: {
              where: {
                id: assignementId,
              },
              data: {
                startDate: body.startDate,
                endDate: body.endDate,
                assignmentTitle: body.assignmentTitle,
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
  }
  async deleteAssignment(assignementId: string, userId: string) {
    //the following logic is to ensure that the assignment will not be deleted unless the user is authorized to do that

    //retreive eventCreator, moderators, ,presenters, and event ids
    const eventIds = await this.prisma.event.findFirst({
      //findUnique requires a direct unique attribute for event model, in this case the unique attr. isn't direct
      where: {
        Assignments: {
          some: {
            id: assignementId, // will check for an event that has an assignment id matches assignmentId
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
            id: assignementId,
          },
        },
      },
    });
    if (result) {
      return {
        message: `The assignment with id ${assignementId} has been deleted successfully`,
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
      return {
        message: 'The rating has been added successfully',
        avgRating,
        numberOfRatings,
      };
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
      return {
        message: 'The rating has been updated successfully',
        avgRating,
        numberOfRatings,
      };
    }
  }
  async eventRating(eventId: string) {
    const result = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        GivenFeedbacks: {
          select: {
            rating: true,
          },
        },
      },
    });
    //Check wether the event exist or not
    if (!result) {
      throw new NotFoundException('Event not found');
    }
    const numberOfRatings = result.GivenFeedbacks.length;
    const sumOfRating = result.GivenFeedbacks.reduce(
      (preRatings, currRating) => preRatings + currRating.rating,
      0,
    );
    const avgRating = sumOfRating / numberOfRatings;
    return {
      avgRating: avgRating || 0,
      numberOfRatings,
    };
  }
  //todo deassign role
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
      //check if the receiver is already in the deisred role
      const isAlreadyAssigned =
        roleType === 'MODERATOR' ? isModerator : isPresenter;
      if (isAlreadyAssigned) {
        throw new BadRequestException('User is already assigned to this role');
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
}
