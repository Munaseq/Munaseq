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
exports.EventService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pdf_lib_1 = require("pdf-lib");
const fs = require("fs");
const path = require("path");
const fontkit = require("@pdf-lib/fontkit");
const ArabicReshaper = require("arabic-reshaper");
const aws_uploading_1 = require("../utils/aws.uploading");
const helper_functions_1 = require("../utils/helper.functions");
const moment = require("moment-timezone");
let EventService = class EventService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async checkIfUserExist(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
    }
    async createEvent(createEventDto, eventCreatorId, imageUrl) {
        if (!eventCreatorId) {
            throw new common_1.BadRequestException('Event creator ID is required');
        }
        if (createEventDto.startDateTime > createEventDto.endDateTime) {
            throw new common_1.BadRequestException('The start date should be smaller than the end date');
        }
        await this.checkIfUserExist(eventCreatorId);
        const conflictedEvents = await this.prisma.event.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            { eventCreatorId },
                            { joinedUsers: { some: { id: eventCreatorId } } },
                            { presenters: { some: { id: eventCreatorId } } },
                            { moderators: { some: { id: eventCreatorId } } },
                        ],
                    },
                    {
                        OR: [
                            {
                                startDateTime: {
                                    lte: createEventDto.startDateTime,
                                },
                                endDateTime: {
                                    gte: createEventDto.startDateTime,
                                },
                            },
                            {
                                startDateTime: {
                                    lte: createEventDto.endDateTime,
                                },
                                endDateTime: {
                                    gte: createEventDto.endDateTime,
                                },
                            },
                            {
                                startDateTime: {
                                    gte: createEventDto.startDateTime,
                                },
                                endDateTime: {
                                    lte: createEventDto.endDateTime,
                                },
                            },
                        ],
                    },
                ],
            },
        });
        if (conflictedEvents.length > 0) {
            throw new common_1.ConflictException('The event conflicts with an existing event(s)');
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
                    },
                },
            },
        });
        const chat = await this.prisma.chat.create({
            data: {
                Event: { connect: { id: event.id } },
                category: 'Group_Message_Chat',
                Users: { connect: { id: eventCreatorId } },
            },
        });
        return {
            ...event,
            chatId: chat.id,
        };
    }
    async updateEvent(userId, eventId, updateEventDto, imageUrl, removeImage) {
        await this.checkIfUserExist(userId);
        const eventIds = await this.prisma.event.findUnique({
            where: { id: eventId },
            select: {
                startDateTime: true,
                endDateTime: true,
                seatCapacity: true,
                _count: { select: { joinedUsers: true } },
                eventCreatorId: true,
                moderators: { select: { id: true } },
            },
        });
        if (!eventIds) {
            throw new common_1.NotFoundException(`Event not found with the following id: ${eventId}`);
        }
        if (updateEventDto?.endDateTime || updateEventDto?.startDateTime) {
            if (updateEventDto?.startDateTime > updateEventDto?.endDateTime) {
                throw new common_1.BadRequestException('The start date should be smaller than the end date');
            }
            if (updateEventDto?.startDateTime &&
                updateEventDto.startDateTime > eventIds.endDateTime) {
                throw new common_1.BadRequestException("The start date can't be greater than the end date");
            }
            if (updateEventDto?.endDateTime &&
                updateEventDto.endDateTime < eventIds.startDateTime) {
                throw new common_1.BadRequestException("The end date can't be smaller than the start date");
            }
        }
        const isAuthorized = (0, helper_functions_1.checkAuthorization)(userId, eventIds.eventCreatorId, eventIds.moderators);
        if (!isAuthorized) {
            throw new common_1.BadRequestException('User is not authorized to update this event');
        }
        if (updateEventDto?.seatCapacity) {
            if (updateEventDto.seatCapacity < eventIds._count.joinedUsers) {
                throw new common_1.BadRequestException('The seat capacity should be greater than the number of joined users');
            }
        }
        if (updateEventDto?.endDateTime || updateEventDto?.startDateTime) {
            const conflictedEvents = await this.prisma.event.findMany({
                where: {
                    id: { not: eventId },
                    AND: [
                        {
                            OR: [
                                { eventCreatorId: userId },
                                { joinedUsers: { some: { id: userId } } },
                                { presenters: { some: { id: userId } } },
                                { moderators: { some: { id: userId } } },
                            ],
                        },
                        {
                            OR: [
                                {
                                    startDateTime: {
                                        lte: updateEventDto.startDateTime,
                                    },
                                    endDateTime: {
                                        gte: updateEventDto.startDateTime,
                                    },
                                },
                                {
                                    startDateTime: {
                                        lte: updateEventDto.endDateTime,
                                    },
                                    endDateTime: {
                                        gte: updateEventDto.endDateTime,
                                    },
                                },
                                {
                                    startDateTime: {
                                        gte: updateEventDto.startDateTime,
                                    },
                                    endDateTime: {
                                        lte: updateEventDto.endDateTime,
                                    },
                                },
                            ],
                        },
                    ],
                },
            });
            if (conflictedEvents.length > 0) {
                throw new common_1.ConflictException('The event conflicts with an existing event(s)');
            }
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
                        },
                    },
                },
                omit: {
                    eventCreatorId: true,
                },
            });
        }
        else {
            return this.prisma.event.update({
                where: { id: eventId },
                data: { ...updateEventDto },
            });
        }
    }
    async delete(userId, eventId) {
        await this.checkIfUserExist(userId);
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
            select: {
                eventCreator: {
                    select: {
                        id: true,
                        createdEvents: {
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
        if (!event) {
            throw new common_1.NotFoundException('Event not found');
        }
        const isAuthorized = event.eventCreator.id === userId;
        if (!isAuthorized) {
            throw new common_1.BadRequestException('User is not authorized to delete this event');
        }
        const sumOfRatings = event.eventCreator.createdEvents.reduce((sum, curr) => sum + curr._count.GivenFeedbacks * curr.rating, 0);
        const numberOfRatings = event.eventCreator.createdEvents.reduce((sum, curr) => sum + curr._count.GivenFeedbacks, 0);
        const avgRating = numberOfRatings === 0 ? 0 : sumOfRatings / numberOfRatings;
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
    async getAllEvents(title, pageNumber = 1, pageSize = 5, category, highestRated) {
        const skipedRecords = (pageNumber - 1) * pageSize;
        return this.prisma.event.findMany({
            where: {
                isPublic: true,
                title: {
                    contains: title,
                    mode: 'insensitive',
                },
                ...(category && { categories: { has: category } }),
            },
            include: {
                eventCreator: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profilePictureUrl: true,
                        username: true,
                        rating: true,
                    },
                },
            },
            omit: {
                eventCreatorId: true,
            },
            take: pageSize,
            skip: skipedRecords,
            ...(highestRated && {
                orderBy: [{ eventCreator: { rating: 'desc' } }, { rating: 'desc' }],
            }),
        });
    }
    async findAllCurrentUserEvents(eventCreatorId, title, pageNumber = 1, pageSize = 5) {
        if (!eventCreatorId) {
            throw new common_1.BadRequestException('Event creator ID is required');
        }
        await this.checkIfUserExist(eventCreatorId);
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
        else {
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
    async getById(eventId) {
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
                    },
                },
            },
            omit: {
                eventCreatorId: true,
            },
        });
        if (result) {
            return result;
        }
        else {
            throw new common_1.NotFoundException('Event not found');
        }
    }
    async findJoinedEvents(userId, title, pageNumber = 1, pageSize = 5) {
        await this.checkIfUserExist(userId);
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
        else {
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
    async findAllUsersOfEvent(eventId) {
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
        }
        else {
            throw new common_1.NotFoundException("The event doesn't exist");
        }
    }
    async findUsersParticipateInEvent(eventId, role, username, pageNumber = 1, pageSize = 5) {
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
            return result.length > 0 ? result[0][role] : [];
        }
        else {
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
            return result.length > 0 ? result[0][role] : [];
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
    async getMaterials(userId, eventId) {
        await this.checkIfUserExist(userId);
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
        if (!eventIds) {
            throw new common_1.NotFoundException('Event not found');
        }
        const isAuthorized = (0, helper_functions_1.checkAuthorization)(userId, eventIds.eventCreatorId, eventIds.moderators, eventIds.presenters, eventIds.joinedUsers);
        if (!isAuthorized) {
            throw new common_1.BadRequestException('User is not authorized to view materials to this event');
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
    async addMaterialsToEvent(eventId, userId, materials) {
        await this.checkIfUserExist(userId);
        const eventIds = await this.prisma.event.findUniqueOrThrow({
            where: { id: eventId },
            select: {
                eventCreatorId: true,
                presenters: { select: { id: true } },
                moderators: { select: { id: true } },
            },
        });
        if (!eventIds) {
            throw new common_1.NotFoundException('Event not found');
        }
        const isAuthorized = (0, helper_functions_1.checkAuthorization)(userId, eventIds.eventCreatorId, eventIds.moderators, eventIds.presenters);
        if (!isAuthorized) {
            throw new common_1.BadRequestException('User is not authorized to add materials to this event');
        }
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
                            in: materials.map((material) => material.materialUrl),
                        },
                    },
                    select: { materialUrl: true, materialId: true },
                },
            },
        });
    }
    async deleteMaterial(userId, materialId) {
        await this.checkIfUserExist(userId);
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
        if (!eventIds) {
            throw new common_1.NotFoundException('Event not found');
        }
        const isAuthorized = (0, helper_functions_1.checkAuthorization)(userId, eventIds.eventCreatorId, eventIds.moderators, eventIds.presenters);
        if (!isAuthorized) {
            throw new common_1.BadRequestException('User is not authorized to delete materials to this event');
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
        }
        else {
            throw new common_1.InternalServerErrorException("The assignment couldn't be deleted successfully");
        }
    }
    async getQuizzes(userId, eventId) {
        await this.checkIfUserExist(userId);
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
        if (!eventIds) {
            throw new common_1.NotFoundException('Event not found');
        }
        const isAttendee = eventIds.joinedUsers.some((joinedUser) => joinedUser.id === userId);
        const isAuthorized = (0, helper_functions_1.checkAuthorization)(userId, eventIds.eventCreatorId, eventIds.moderators, eventIds.presenters) || isAttendee;
        if (!isAuthorized) {
            throw new common_1.BadRequestException('User is not authorized to view the quizzes of this event');
        }
        let result = await this.prisma.event.findUnique({
            where: {
                id: eventId,
            },
            select: {
                _count: { select: { Quizzes: true } },
                Quizzes: {
                    select: {
                        _count: { select: { TakeQuiz: true } },
                        id: true,
                        quizTitle: true,
                        timeLimit: true,
                        startDate: true,
                        endDate: true,
                        TakeQuiz: { where: { userId }, select: { status: true } },
                        createdAt: true,
                        updatedAt: true,
                    },
                    orderBy: { updatedAt: 'desc' },
                },
            },
        });
        if (!result) {
            throw new common_1.NotFoundException('Event not found');
        }
        const quizsWithStatus = result.Quizzes.map((Quiz) => {
            const currDate = new Date();
            const { _count, TakeQuiz, ...quizzesWithoutCount } = Quiz;
            let status;
            if (currDate < Quiz.startDate) {
                status = 'AVAILABLE_SOON';
            }
            else if (currDate > Quiz.endDate) {
                status = 'EXPIRED';
            }
            else {
                status = 'AVAILABLE';
            }
            if (isAttendee) {
                let takeQuizStatus;
                if (TakeQuiz.length > 0) {
                    const takeQuiz = TakeQuiz[0];
                    takeQuizStatus = takeQuiz.status;
                }
                else {
                    takeQuizStatus = 'NOT_ANSWERED';
                }
                return {
                    quizStatus: status,
                    takeQuizStatus,
                    ...quizzesWithoutCount,
                };
            }
            else {
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
    async showQuiz(userId, quizId) {
        await this.checkIfUserExist(userId);
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
            throw new common_1.NotFoundException('quiz or event not found');
        }
        const isAttendee = event.joinedUsers.some((joinedUsers) => joinedUsers.id === userId);
        const isAuthorized = event.eventCreatorId === userId ||
            event.presenters.some((presenter) => presenter.id === userId) ||
            event.moderators.some((moderator) => moderator.id === userId) ||
            isAttendee;
        if (!isAuthorized) {
            throw new common_1.BadRequestException("You're not allowed to show this Quiz");
        }
        const quiz = event.Quizzes[0];
        if (!quiz) {
            throw new common_1.NotFoundException('Quiz not found');
        }
        const currDate = new Date();
        const { _count, TakeQuiz, ...quizWithoutCount } = event.Quizzes[0];
        let status;
        if (currDate < quiz.startDate) {
            status = 'AVAILABLE_SOON';
        }
        else if (currDate > quiz.endDate) {
            status = 'EXPIRED';
        }
        else {
            status = 'AVAILABLE';
        }
        if (isAttendee) {
            {
                let takeQuizStatus;
                if (TakeQuiz?.length > 0) {
                    const takeQuiz = TakeQuiz[0];
                    takeQuizStatus = takeQuiz.status;
                }
                else {
                    takeQuizStatus = 'NOT_ANSWERED';
                }
                return {
                    quizStatus: status,
                    takeQuizStatus,
                    ...quizWithoutCount,
                    TakeQuiz: TakeQuiz[0]
                        ? {
                            ...TakeQuiz[0],
                            answers: JSON.parse(TakeQuiz[0].answers),
                        }
                        : {},
                };
            }
        }
        else {
            return {
                quizStatus: status,
                numberParticipatedUsers: _count.TakeQuiz,
                ...quizWithoutCount,
            };
        }
    }
    async addQuizToEvent(userId, eventId, body) {
        await this.checkIfUserExist(userId);
        const eventIds = await this.prisma.event.findUnique({
            where: { id: eventId },
            select: {
                eventCreatorId: true,
                presenters: { select: { id: true } },
                moderators: { select: { id: true } },
            },
        });
        if (!eventIds) {
            throw new common_1.NotFoundException('Event not found');
        }
        const isAuthorized = (0, helper_functions_1.checkAuthorization)(userId, eventIds.eventCreatorId, eventIds.moderators, eventIds.presenters);
        if (!isAuthorized) {
            throw new common_1.BadRequestException('User is not authorized to add quiz to this event');
        }
        if (body.startDate > body.endDate) {
            throw new common_1.BadRequestException('The start date should be smaller than the end date');
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
        return result?.Quizzes[0] ?? [];
    }
    async updateQuiz(userId, quizId, body) {
        await this.checkIfUserExist(userId);
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
                Quizzes: {
                    where: {
                        id: quizId,
                    },
                    select: { startDate: true, endDate: true },
                },
            },
        });
        if (!event) {
            throw new common_1.NotFoundException('quiz or event not found');
        }
        const isAuthorized = (0, helper_functions_1.checkAuthorization)(userId, event.eventCreatorId, event.moderators, event.presenters);
        if (!isAuthorized) {
            throw new common_1.BadRequestException('User is not authorized to update this quiz');
        }
        if (body.startDate > body.endDate) {
            throw new common_1.BadRequestException('The start date should be smaller than the end date');
        }
        if (body?.timeLimit <= 0) {
            throw new common_1.BadRequestException('The timelimit should be greater than 0');
        }
        const currDate = new Date();
        if (event.Quizzes[0]?.startDate < currDate) {
            throw new common_1.BadRequestException('The Quiz has already started, you cannot update it');
        }
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
        return updatedQuiz ?? [];
    }
    async saveQuiz(userId, quizId, answers, typeOfSubmission) {
        await this.checkIfUserExist(userId);
        if (!Array.isArray(answers)) {
            throw new common_1.BadRequestException('Answers must be an array');
        }
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
            throw new common_1.NotFoundException('quiz or event not found');
        }
        const isAuthorized = event.joinedUsers.some((joinedUser) => joinedUser.id === userId);
        if (!isAuthorized) {
            throw new common_1.BadRequestException("You're not allowed to do this quiz");
        }
        let quizTake = event.Quizzes[0].TakeQuiz[0];
        if (quizTake?.status === 'SUBMITTED') {
            throw new common_1.BadRequestException("You've already submitted this quiz");
        }
        const currDate = new Date();
        if (event?.Quizzes[0]?.endDate < currDate ||
            event?.Quizzes[0]?.startDate > currDate) {
            throw new common_1.BadRequestException("The Quiz time expired Or hasn't started yet");
        }
        let updatedTakeQuiz;
        if (!quizTake) {
            updatedTakeQuiz = await this.prisma.takeQuiz.create({
                data: {
                    userId,
                    quizId,
                    status: typeOfSubmission,
                    answers: JSON.stringify(answers),
                },
            });
        }
        else {
            updatedTakeQuiz = await this.prisma.takeQuiz.update({
                where: { id: quizTake.id },
                data: {
                    status: typeOfSubmission,
                    answers: JSON.stringify(answers),
                },
            });
        }
        return { ...updatedTakeQuiz, answers: JSON.parse(updatedTakeQuiz.answers) };
    }
    async getAllParticipantsQuizResults(userId, eventId, quizId) {
        await this.checkIfUserExist(userId);
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
        const isPresenter = event.presenters.some((presenter) => presenter.id === userId);
        const isModerator = event.moderators.some((moderator) => moderator.id === userId);
        if (!isEventCreator && !isPresenter && !isModerator) {
            throw new common_1.ForbiddenException('You do not have permission to view the quiz results');
        }
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
    async getQuizById(quizId) {
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
            throw new common_1.NotFoundException('Quiz not found');
        }
        return quiz;
    }
    async deleteQuiz(userId, quizId) {
        await this.checkIfUserExist(userId);
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
            throw new common_1.NotFoundException('quiz not found');
        }
        const isAuthorized = (0, helper_functions_1.checkAuthorization)(userId, event.eventCreatorId, event.moderators, event.presenters);
        if (!isAuthorized) {
            throw new common_1.BadRequestException('User is not authorized to delete this quiz');
        }
        await this.prisma.quiz.delete({
            where: { id: quizId },
        });
        return {
            message: `The quiz with id "${quizId}" has been deleted successfully`,
        };
    }
    async getAssignments(userId, eventId) {
        await this.checkIfUserExist(userId);
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
        if (!eventIds) {
            throw new common_1.NotFoundException('Event not found');
        }
        const isAttendee = eventIds.joinedUsers.some((joinedUser) => joinedUser.id === userId);
        const isAuthorized = (0, helper_functions_1.checkAuthorization)(userId, eventIds.eventCreatorId, eventIds.moderators, eventIds.presenters) || isAttendee;
        if (!isAuthorized) {
            throw new common_1.BadRequestException('User is not authorized to view the assignments of this event');
        }
        let result = await this.prisma.event.findUnique({
            where: {
                id: eventId,
            },
            select: {
                _count: { select: { Assignments: true } },
                Assignments: {
                    select: {
                        _count: { select: { TakeAssignment: true } },
                        id: true,
                        assignmentTitle: true,
                        startDate: true,
                        endDate: true,
                        TakeAssignment: { where: { userId }, select: { status: true } },
                        updatedAt: true,
                        createdAt: true,
                    },
                    orderBy: { updatedAt: 'desc' },
                },
            },
        });
        if (!result) {
            throw new common_1.NotFoundException('Event not found');
        }
        const assignmentsWithStatus = result.Assignments.map((assignment) => {
            const currDate = new Date();
            const { _count, TakeAssignment, ...assignmentWithoutCount } = assignment;
            let status;
            if (currDate < assignment.startDate) {
                status = 'AVAILABLE_SOON';
            }
            else if (currDate > assignment.endDate) {
                status = 'EXPIRED';
            }
            else {
                status = 'AVAILABLE';
            }
            if (isAttendee) {
                let takeAssignmentStatus;
                if (TakeAssignment.length > 0) {
                    const takeAssignment = TakeAssignment[0];
                    takeAssignmentStatus = takeAssignment.status;
                }
                else {
                    takeAssignmentStatus = 'NOT_ANSWERED';
                }
                return {
                    assignmentStatus: status,
                    takeAssignmentStatus,
                    ...assignmentWithoutCount,
                };
            }
            else {
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
    async addAssignment(eventId, userId, body) {
        await this.checkIfUserExist(userId);
        const eventIds = await this.prisma.event.findUnique({
            where: { id: eventId },
            select: {
                eventCreatorId: true,
                presenters: { select: { id: true } },
                moderators: { select: { id: true } },
            },
        });
        if (!eventIds) {
            throw new common_1.NotFoundException('Event not found');
        }
        const isAuthorized = (0, helper_functions_1.checkAuthorization)(userId, eventIds.eventCreatorId, eventIds.moderators, eventIds.presenters);
        if (!isAuthorized) {
            throw new common_1.BadRequestException('User is not authorized to add assignment to this event');
        }
        if (body.startDate > body.endDate) {
            throw new common_1.BadRequestException('The start date should be smaller than the end date');
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
        return result?.Assignments[0] ?? [];
    }
    async showAssignment(userId, assignmentId) {
        await this.checkIfUserExist(userId);
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
            throw new common_1.NotFoundException('assignment not found');
        }
        const isAttendee = event.joinedUsers.some((joinedUsers) => joinedUsers.id === userId);
        const isAuthorized = (0, helper_functions_1.checkAuthorization)(userId, event.eventCreatorId, event.moderators, event.presenters) || isAttendee;
        if (!isAuthorized) {
            throw new common_1.BadRequestException("You're not allowed to show this assignment");
        }
        const assignment = event.Assignments[0];
        if (!assignment) {
            throw new common_1.NotFoundException('Assignment or event not found ');
        }
        const currDate = new Date();
        const { _count, TakeAssignment, ...assignmentWithoutCount } = event.Assignments[0];
        let status;
        if (currDate < assignment.startDate) {
            status = 'AVAILABLE_SOON';
        }
        else if (currDate > assignment.endDate) {
            status = 'EXPIRED';
        }
        else {
            status = 'AVAILABLE';
        }
        if (isAttendee) {
            {
                let takeAssignmentStatus;
                if (TakeAssignment?.length > 0) {
                    const takeAssignment = TakeAssignment[0];
                    takeAssignmentStatus = takeAssignment.status;
                }
                else {
                    takeAssignmentStatus = 'NOT_ANSWERED';
                }
                return {
                    assignmentStatus: status,
                    takeAssignmentStatus,
                    ...assignmentWithoutCount,
                    TakeAssignment: TakeAssignment[0]
                        ? {
                            ...TakeAssignment[0],
                            answers: JSON.parse(TakeAssignment[0].answers),
                        }
                        : {},
                };
            }
        }
        else {
            return {
                assignmentStatus: status,
                numberParticipatedUsers: _count.TakeAssignment,
                ...assignmentWithoutCount,
            };
        }
    }
    async saveAssignment(userId, assignmentId, answers, typeOfSubmission) {
        await this.checkIfUserExist(userId);
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
            throw new common_1.NotFoundException('assignment or event not found');
        }
        const isAuthorized = event.joinedUsers.some((joinedUser) => joinedUser.id === userId);
        if (!isAuthorized) {
            throw new common_1.BadRequestException("You're not allowed to do this assignment");
        }
        let assignmentTake = event.Assignments[0].TakeAssignment[0];
        if (assignmentTake?.status === 'SUBMITTED') {
            throw new common_1.BadRequestException("You've already submitted this assignment");
        }
        const currDate = new Date();
        if (event?.Assignments[0]?.endDate < currDate ||
            event?.Assignments[0]?.startDate > currDate) {
            throw new common_1.BadRequestException('The Assignment time expired Or not started yet');
        }
        if (!assignmentTake) {
            assignmentTake = await this.prisma.takeAssignment.create({
                data: {
                    answers: JSON.stringify(answers),
                    assignmentId,
                    userId,
                    status: typeOfSubmission,
                },
            });
        }
        else {
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
        return { ...assignmentTake, answers: JSON.parse(assignmentTake.answers) };
    }
    async updateAssignment(assignmentId, userId, body) {
        await this.checkIfUserExist(userId);
        const event = await this.prisma.event.findFirst({
            where: {
                Assignments: {
                    some: {
                        id: assignmentId,
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
            throw new common_1.NotFoundException('assignment or event not found');
        }
        const isAuthorized = (0, helper_functions_1.checkAuthorization)(userId, event.eventCreatorId, event.moderators, event.presenters);
        if (!isAuthorized) {
            throw new common_1.BadRequestException('User is not authorized to update this assignment');
        }
        if (body.startDate > body.endDate) {
            throw new common_1.BadRequestException('The start date should be smaller than the end date');
        }
        const currDate = new Date();
        if (event.Assignments[0]?.startDate < currDate) {
            throw new common_1.BadRequestException('The Assignment has already started, you cannot update it');
        }
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
        return updatedAssignment ?? [];
    }
    async deleteAssignment(assignmentId, userId) {
        await this.checkIfUserExist(userId);
        const eventIds = await this.prisma.event.findFirst({
            where: {
                Assignments: {
                    some: {
                        id: assignmentId,
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
        if (!eventIds) {
            throw new common_1.NotFoundException('assignment not found');
        }
        const isAuthorized = (0, helper_functions_1.checkAuthorization)(userId, eventIds.eventCreatorId, eventIds.moderators, eventIds.presenters);
        if (!isAuthorized) {
            throw new common_1.BadRequestException('User is not authorized to delete this assignment');
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
        }
        else {
            throw new common_1.InternalServerErrorException("The assignment couldn't be deleted successfully");
        }
    }
    async joinEvent(userId, joinEventDto) {
        await this.checkIfUserExist(userId);
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
            throw new common_1.NotFoundException('Event not found');
        }
        const isAssigned = (0, helper_functions_1.checkAuthorization)(userId, event.eventCreatorId, event.moderators, event.presenters);
        if (isAssigned) {
            throw new common_1.BadRequestException('User is assigned as eventCreator, moderator, or presenter');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { gender: true },
        });
        const isGenderCompatible = user.gender == event.gender || event.gender == 'BOTH';
        if (!isGenderCompatible) {
            throw new common_1.BadRequestException("User gender does not match the event's accepted gender");
        }
        const isAlreadyJoined = event.joinedUsers.some((user) => user.id === userId);
        if (isAlreadyJoined) {
            throw new common_1.BadRequestException('User already joined this event');
        }
        if (!event.isPublic) {
            throw new common_1.BadRequestException('Event is private, you cannot join it directly, instead you should request to join it');
        }
        if (event.seatCapacity !== null && event.seatCapacity > 0) {
            const joinedCount = event.joinedUsers.length;
            if (joinedCount >= event.seatCapacity) {
                throw new common_1.BadRequestException('Event has reached its seat capacity');
            }
        }
        const conflictedEvents = await this.prisma.event.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            { eventCreatorId: userId },
                            { joinedUsers: { some: { id: userId } } },
                            { presenters: { some: { id: userId } } },
                            { moderators: { some: { id: userId } } },
                        ],
                    },
                    {
                        OR: [
                            {
                                startDateTime: {
                                    lte: event.startDateTime,
                                },
                                endDateTime: {
                                    gte: event.startDateTime,
                                },
                            },
                            {
                                startDateTime: {
                                    lte: event.endDateTime,
                                },
                                endDateTime: {
                                    gte: event.endDateTime,
                                },
                            },
                            {
                                startDateTime: {
                                    gte: event.startDateTime,
                                },
                                endDateTime: {
                                    lte: event.endDateTime,
                                },
                            },
                        ],
                    },
                ],
            },
        });
        if (conflictedEvents.length > 0) {
            throw new common_1.ConflictException('The event conflicts with an existing event(s)');
        }
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
    async leaveEvent(userId, eventId) {
        await this.checkIfUserExist(userId);
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
            include: { joinedUsers: true, moderators: true, presenters: true },
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found');
        }
        let role;
        const isUserJoined = event.joinedUsers.some((user) => user.id === userId);
        const isUserPresenter = event.presenters.some((user) => user.id === userId);
        const isUserModerator = event.moderators.some((user) => user.id === userId);
        if (!isUserJoined && !isUserModerator && !isUserPresenter) {
            throw new common_1.BadRequestException('User is not joined to this event');
        }
        if (isUserJoined) {
            role = 'joinedUsers';
        }
        else if (isUserModerator) {
            role = 'moderators';
        }
        else {
            role = 'presenters';
        }
        const updatedEvent = await this.prisma.event.update({
            where: { id: eventId },
            data: {
                [role]: {
                    disconnect: { id: userId },
                },
                EventChat: {
                    update: { Users: { disconnect: { id: userId } } },
                },
            },
            select: {
                Reminders: { where: { userId, eventId } },
            },
        });
        const isThereReminder = updatedEvent.Reminders[0];
        if (isThereReminder) {
            await this.prisma.reminder.delete({
                where: { id: isThereReminder.id },
            });
        }
    }
    async rateEvent(userId, eventId, rating, comment) {
        await this.checkIfUserExist(userId);
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
        if (!eventIds) {
            throw new common_1.NotFoundException('Event not found');
        }
        const isAuthorized = eventIds.eventCreatorId !== userId &&
            eventIds.presenters.every((presenter) => presenter.id !== userId) &&
            eventIds.moderators.every((moderator) => moderator.id !== userId) &&
            eventIds.joinedUsers.some((joinedUser) => joinedUser.id === userId);
        if (!isAuthorized) {
            throw new common_1.BadRequestException('User is not authorized to rate this event');
        }
        const hasRated = eventIds.GivenFeedbacks.some((feedback) => feedback.userId === userId);
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
                            userId,
                            comment,
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
            const sumOfRating = result.GivenFeedbacks.reduce((preRatings, currRating) => preRatings + currRating.rating, 0);
            const avgRating = sumOfRating / numberOfRatings;
            finalResult = await this.prisma.event.update({
                where: {
                    id: eventId,
                },
                data: {
                    rating: avgRating,
                },
                select: {
                    eventCreatorId: true,
                    rating: true,
                    _count: { select: { GivenFeedbacks: true } },
                },
            });
        }
        else {
            const feedbackId = eventIds.GivenFeedbacks.find((feedback) => feedback.userId === userId).id;
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
                                comment,
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
            const sumOfRating = result.GivenFeedbacks.reduce((preRatings, currRating) => preRatings + currRating.rating, 0);
            const avgRating = sumOfRating / numberOfRatings;
            finalResult = await this.prisma.event.update({
                where: {
                    id: eventId,
                },
                data: {
                    rating: avgRating,
                },
                select: {
                    rating: true,
                    eventCreatorId: true,
                    _count: { select: { GivenFeedbacks: true } },
                },
            });
        }
        if (!finalResult) {
            throw new common_1.InternalServerErrorException("The event's rating couldn't be updated successfully");
        }
        const eventCreatorEvents = await this.prisma.event.findMany({
            where: {
                eventCreatorId: finalResult.eventCreatorId,
            },
            select: {
                rating: true,
                _count: { select: { GivenFeedbacks: true } },
            },
        });
        const totalRatings = eventCreatorEvents.reduce((sum, event) => sum + event._count.GivenFeedbacks, 0);
        const sumOfRatings = eventCreatorEvents.reduce((sum, event) => sum + event.rating * event._count.GivenFeedbacks, 0);
        const avgRating = sumOfRatings / totalRatings;
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
    async eventRating(eventId) {
        const result = await this.prisma.event.findUnique({
            where: {
                id: eventId,
            },
            select: {
                rating: true,
                _count: { select: { GivenFeedbacks: true } },
                GivenFeedbacks: {
                    select: {
                        comment: true,
                        createdAt: true,
                        updatedAt: true,
                        rating: true,
                        User: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                username: true,
                                profilePictureUrl: true,
                                rating: true,
                            },
                        },
                    },
                },
            },
        });
        if (!result) {
            throw new common_1.NotFoundException('Event not found');
        }
        return {
            avgRating: result.rating,
            numberOfRatings: result._count.GivenFeedbacks,
            feedbacks: result.GivenFeedbacks,
        };
    }
    async assignRole(userId, eventId, assignedUserId, role) {
        await this.checkIfUserExist(userId);
        const eventIds = await this.prisma.event.findUnique({
            where: {
                id: eventId,
            },
            select: {
                eventCreatorId: true,
                gender: true,
                startDateTime: true,
                endDateTime: true,
                moderators: {
                    select: {
                        id: true,
                    },
                },
            },
        });
        if (!eventIds) {
            throw new common_1.NotFoundException('Event not found');
        }
        const isAuthorized = (0, helper_functions_1.checkAuthorization)(userId, eventIds.eventCreatorId, eventIds.moderators);
        if (!isAuthorized) {
            throw new common_1.BadRequestException('User is not authorized to add materials to this event');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: assignedUserId },
            select: { gender: true },
        });
        const isGenderCompatible = user.gender == eventIds.gender || eventIds.gender == 'BOTH';
        if (!isGenderCompatible) {
            throw new common_1.BadRequestException("User gender does not match the event's accepted gender");
        }
        const conflictedEvents = await this.prisma.event.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            { eventCreatorId: assignedUserId },
                            { joinedUsers: { some: { id: assignedUserId } } },
                            { presenters: { some: { id: assignedUserId } } },
                            { moderators: { some: { id: assignedUserId } } },
                        ],
                    },
                    {
                        OR: [
                            {
                                startDateTime: {
                                    lte: eventIds.startDateTime,
                                },
                                endDateTime: {
                                    gte: eventIds.startDateTime,
                                },
                            },
                            {
                                startDateTime: {
                                    lte: eventIds.endDateTime,
                                },
                                endDateTime: {
                                    gte: eventIds.endDateTime,
                                },
                            },
                            {
                                startDateTime: {
                                    gte: eventIds.startDateTime,
                                },
                                endDateTime: {
                                    lte: eventIds.endDateTime,
                                },
                            },
                        ],
                    },
                ],
            },
        });
        if (conflictedEvents.length > 0) {
            throw new common_1.ConflictException('The event conflicts with an existing event(s)');
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
    async unAssignRole(userId, eventId, assignedUserId, role) {
        await this.checkIfUserExist(userId);
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
        if (!eventIds) {
            throw new common_1.NotFoundException('Event not found');
        }
        const isAuthorized = (0, helper_functions_1.checkAuthorization)(userId, eventIds.eventCreatorId, eventIds.moderators);
        if (!isAuthorized) {
            throw new common_1.BadRequestException('User is not authorized to add materials to this event');
        }
        const isAssigned = (0, helper_functions_1.checkAuthorization)(userId, eventIds.presenters, eventIds.moderators);
        if (!isAssigned) {
            throw new common_1.BadRequestException("The user isn't assigned");
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
    async sendInvitation(userId, eventId, receiverId, invitationType, roleType) {
        await this.checkIfUserExist(userId);
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
            throw new common_1.NotFoundException('Event not found');
        }
        const isEventCreator = event.eventCreatorId === userId;
        const isPresenter = event.presenters.some((presenter) => presenter.id === userId);
        const isModerator = event.moderators.some((moderator) => moderator.id === userId);
        const isJoinedUser = event.joinedUsers.some((joinedUser) => joinedUser.id === userId);
        if (receiverId === userId || event.eventCreatorId === receiverId) {
            throw new common_1.BadRequestException('You cannot send an invitation to yourself or the event creator');
        }
        if (!isEventCreator && !isPresenter && !isModerator && !isJoinedUser) {
            throw new common_1.ForbiddenException('You do not have permission to send invitations for this event because you are not related to it');
        }
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
            throw new common_1.BadRequestException('Invitation already sent');
        }
        const receiver = await this.prisma.user.findUnique({
            where: { id: receiverId },
            select: { id: true, gender: true },
        });
        if (!receiver) {
            throw new common_1.NotFoundException('Receiver not found');
        }
        const isGenderCompatible = receiver.gender == event.gender || event.gender == 'BOTH';
        if (!isGenderCompatible) {
            throw new common_1.BadRequestException("Receiver gender does not match the event's accepted gender");
        }
        if (invitationType === 'ROLE_INVITATION') {
            if (!roleType) {
                throw new common_1.BadRequestException('Role type is required');
            }
            const isAuthoiorized = (0, helper_functions_1.checkAuthorization)(userId, event.eventCreatorId, event.moderators);
            if (!isAuthoiorized) {
                throw new common_1.ForbiddenException('You do not have permission to assign this role');
            }
            const isReceiverModerator = event.moderators.some((moderator) => moderator.id === receiverId);
            const isReceiverPresenter = event.presenters.some((presenter) => presenter.id === receiverId);
            const isAlreadyAssigned = roleType === 'MODERATOR' ? isReceiverModerator : isReceiverPresenter;
            if (isAlreadyAssigned) {
                throw new common_1.BadRequestException(`User is already assigned to ${roleType} role`);
            }
            return await this.prisma.invitation.create({
                data: {
                    sender_id: userId,
                    receiver_id: receiverId,
                    event_id: eventId,
                    invitationType,
                    roleType,
                },
            });
        }
        else {
            if (!event.isPublic) {
                const isAuthorized = (0, helper_functions_1.checkAuthorization)(userId, event.eventCreatorId, event.moderators, event.presenters);
                if (!isAuthorized) {
                    throw new common_1.ForbiddenException('You do not have permission to send invitations for this event');
                }
            }
            const isAlreadyParticipant = (0, helper_functions_1.checkAuthorization)(receiverId, event.eventCreatorId, event.moderators, event.presenters, event.joinedUsers);
            if (isAlreadyParticipant) {
                throw new common_1.BadRequestException('User is already a participant');
            }
            if (event.seatCapacity !== null && event.seatCapacity > 0) {
                const joinedCount = event.joinedUsers.length;
                if (joinedCount >= event.seatCapacity) {
                    throw new common_1.BadRequestException('Event has reached its seat capacity');
                }
            }
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
    async sendRequest(userId, eventId, requestType, roleType) {
        await this.checkIfUserExist(userId);
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                gender: true,
                joinedEvents: { select: { id: true } },
                createdEvents: { select: { id: true } },
                moderatedEvents: { select: { id: true } },
                presentedEvents: { select: { id: true } },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const isAlreadyJoined = user.joinedEvents.some((joinedEvent) => joinedEvent.id === eventId);
        const isAlreadyModerator = user.moderatedEvents.some((moderatedEvent) => moderatedEvent.id === eventId);
        const isAlreadyPresenter = user.presentedEvents.some((presentedEvent) => presentedEvent.id === eventId);
        const isEventCreator = user.createdEvents.some((createdEvent) => createdEvent.id === eventId);
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
            select: {
                gender: true,
                joinedUsers: { select: { id: true } },
                startDateTime: true,
                endDateTime: true,
                seatCapacity: true,
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
        if (!event) {
            throw new common_1.NotFoundException('Event not found');
        }
        const isAlreadyRequested = event.Requests.length > 0;
        if (isAlreadyRequested) {
            throw new common_1.BadRequestException('User has already sent a request');
        }
        if (isEventCreator) {
            throw new common_1.BadRequestException('User is already an event creator');
        }
        const isGenderCompatible = user.gender == event.gender || event.gender == 'BOTH';
        if (!isGenderCompatible) {
            throw new common_1.BadRequestException("User gender does not match the event's accepted gender");
        }
        if (requestType === 'EVENT_REQUEST') {
            if (isAlreadyJoined) {
                throw new common_1.BadRequestException('User is already joined the event');
            }
            if (isAlreadyModerator || isAlreadyPresenter) {
                throw new common_1.BadRequestException('User is already a moderator or presenter');
            }
            const conflictedEvents = await this.prisma.event.findMany({
                where: {
                    AND: [
                        {
                            OR: [
                                { eventCreatorId: userId },
                                { joinedUsers: { some: { id: userId } } },
                                { presenters: { some: { id: userId } } },
                                { moderators: { some: { id: userId } } },
                            ],
                        },
                        {
                            OR: [
                                {
                                    startDateTime: {
                                        lte: event.startDateTime,
                                    },
                                    endDateTime: {
                                        gte: event.startDateTime,
                                    },
                                },
                                {
                                    startDateTime: {
                                        lte: event.endDateTime,
                                    },
                                    endDateTime: {
                                        gte: event.endDateTime,
                                    },
                                },
                                {
                                    startDateTime: {
                                        gte: event.startDateTime,
                                    },
                                    endDateTime: {
                                        lte: event.endDateTime,
                                    },
                                },
                            ],
                        },
                    ],
                },
            });
            if (conflictedEvents.length > 0) {
                throw new common_1.ConflictException('The event you want to join conflicts with an existing event(s)');
            }
            if (event.seatCapacity !== null && event.seatCapacity > 0) {
                const joinedCount = event.joinedUsers.length;
                if (joinedCount >= event.seatCapacity) {
                    throw new common_1.BadRequestException('Event has reached its seat capacity');
                }
            }
            return await this.prisma.request.create({
                data: {
                    sender_id: userId,
                    event_id: eventId,
                    requestType,
                },
            });
        }
        else if (requestType === 'ROLE_REQUEST') {
            if (!isAlreadyJoined && !isAlreadyModerator && !isAlreadyPresenter) {
                throw new common_1.BadRequestException('User is not joined the event');
            }
            if (!roleType) {
                throw new common_1.BadRequestException('roleType is required');
            }
            const isAlreadyAssigned = roleType === 'MODERATOR' ? isAlreadyModerator : isAlreadyPresenter;
            if (isAlreadyAssigned) {
                throw new common_1.BadRequestException(`User is already assigned to ${roleType} role`);
            }
            const conflictedEvents = await this.prisma.event.findMany({
                where: {
                    AND: [
                        {
                            OR: [
                                { eventCreatorId: userId },
                                { joinedUsers: { some: { id: userId } } },
                                { presenters: { some: { id: userId } } },
                                { moderators: { some: { id: userId } } },
                            ],
                        },
                        {
                            OR: [
                                {
                                    startDateTime: {
                                        lte: event.startDateTime,
                                    },
                                    endDateTime: {
                                        gte: event.startDateTime,
                                    },
                                },
                                {
                                    startDateTime: {
                                        lte: event.endDateTime,
                                    },
                                    endDateTime: {
                                        gte: event.endDateTime,
                                    },
                                },
                                {
                                    startDateTime: {
                                        gte: event.startDateTime,
                                    },
                                    endDateTime: {
                                        lte: event.endDateTime,
                                    },
                                },
                            ],
                        },
                    ],
                },
            });
            if (conflictedEvents.length > 0) {
                throw new common_1.ConflictException('The event you want to join conflicts with an existing event(s)');
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
    async getRequests(userId, eventId) {
        await this.checkIfUserExist(userId);
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
        if (!event) {
            throw new common_1.NotFoundException('Event not found');
        }
        const isPresenter = event.presenters.some((presenter) => presenter.id === userId);
        const isAuthorized = (0, helper_functions_1.checkAuthorization)(userId, event.eventCreatorId, event.moderators) ||
            isPresenter;
        if (!isAuthorized) {
            throw new common_1.BadRequestException('User is not authorized to view requests for this event');
        }
        let requests = event.Requests;
        if (!requests || requests.length === 0) {
            throw new common_1.NotFoundException('No requests found for this event');
        }
        if (isPresenter)
            requests = requests.filter((request) => request.requestType !== 'ROLE_REQUEST');
        return requests;
    }
    async respondToRequest(userId, requestId, decision) {
        await this.checkIfUserExist(userId);
        const request = await this.prisma.request.findUnique({
            where: { id: requestId },
            include: {
                Sender: {
                    select: {
                        id: true,
                        gender: true,
                    },
                },
                Event: {
                    select: {
                        isPublic: true,
                        startDateTime: true,
                        endDateTime: true,
                        seatCapacity: true,
                        gender: true,
                        eventCreatorId: true,
                        moderators: { select: { id: true } },
                        presenters: { select: { id: true } },
                        joinedUsers: { select: { id: true } },
                    },
                },
            },
        });
        if (!request) {
            throw new common_1.NotFoundException('Request not found');
        }
        if (!request.Event) {
            throw new common_1.NotFoundException('Event not found');
        }
        if (request.status !== 'PENDING') {
            throw new common_1.BadRequestException('This request has already been responded');
        }
        const isGenderCompatible = request.Sender.gender == request.Event.gender ||
            request.Event.gender == 'BOTH';
        if (!isGenderCompatible) {
            throw new common_1.BadRequestException("User gender does not match the event's accepted gender");
        }
        const isSenderIsPresenter = request.Event.presenters.some((presenter) => presenter.id === request.sender_id);
        const isSenderIsModerator = request.Event.moderators.some((moderator) => moderator.id === request.sender_id);
        const isSenderIsJoinedUser = request.Event.joinedUsers.some((joinedUser) => joinedUser.id === request.sender_id);
        if (decision) {
            if (request.requestType === 'ROLE_REQUEST') {
                const isAuthorized = (0, helper_functions_1.checkAuthorization)(userId, request.Event.eventCreatorId, request.Event.moderators);
                if (!isAuthorized) {
                    throw new common_1.BadRequestException('User is not authorized to respond to this request');
                }
                const role = request.roleType === 'MODERATOR' ? 'moderators' : 'presenters';
                const isAlreadyInRole = request.Event[role].some((user) => user.id === userId);
                if (isAlreadyInRole) {
                    await this.prisma.request.update({
                        where: {
                            id: requestId,
                        },
                        data: {
                            status: 'CANCELED_BY_SYSTEM',
                        },
                    });
                    throw new common_1.BadRequestException(`You are already in the ${request.roleType} role, and the request has been canceled`);
                }
                if (isSenderIsJoinedUser ||
                    isSenderIsModerator ||
                    isSenderIsPresenter) {
                    let roleToRemove;
                    if (isSenderIsJoinedUser) {
                        roleToRemove = 'joinedUsers';
                    }
                    else if (isSenderIsPresenter) {
                        roleToRemove = 'presenters';
                    }
                    else {
                        roleToRemove = 'moderators';
                    }
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
                const conflictedEvents = await this.prisma.event.findMany({
                    where: {
                        AND: [
                            {
                                OR: [
                                    { eventCreatorId: request.sender_id },
                                    { joinedUsers: { some: { id: request.sender_id } } },
                                    { presenters: { some: { id: request.sender_id } } },
                                    { moderators: { some: { id: request.sender_id } } },
                                ],
                            },
                            {
                                OR: [
                                    {
                                        startDateTime: {
                                            lte: request.Event.startDateTime,
                                        },
                                        endDateTime: {
                                            gte: request.Event.startDateTime,
                                        },
                                    },
                                    {
                                        startDateTime: {
                                            lte: request.Event.endDateTime,
                                        },
                                        endDateTime: {
                                            gte: request.Event.endDateTime,
                                        },
                                    },
                                    {
                                        startDateTime: {
                                            gte: request.Event.startDateTime,
                                        },
                                        endDateTime: {
                                            lte: request.Event.endDateTime,
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                });
                if (conflictedEvents.length > 0) {
                    throw new common_1.ConflictException('The event the sender wants to join conflicts with an existing event(s) he currently has a role in it');
                }
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
            }
            else if (request.requestType === 'EVENT_REQUEST') {
                if (!request.Event.isPublic) {
                    const isAuthorized = (0, helper_functions_1.checkAuthorization)(userId, request.Event.eventCreatorId, request.Event.moderators);
                    if (!isAuthorized) {
                        throw new common_1.BadRequestException("You're not authorized to respond since the event is private and you aren't a moderator or eventCreator");
                    }
                }
                if (isSenderIsModerator ||
                    isSenderIsPresenter ||
                    isSenderIsJoinedUser) {
                    await this.prisma.request.update({
                        where: { id: requestId },
                        data: {
                            status: 'CANCELED_BY_SYSTEM',
                        },
                    });
                    throw new common_1.BadRequestException('The sender is Already joined or play a role the event ');
                }
                if (request.Event.seatCapacity !== null &&
                    request.Event.seatCapacity > 0) {
                    const joinedCount = request.Event.joinedUsers.length;
                    if (joinedCount >= request.Event.seatCapacity) {
                        throw new common_1.BadRequestException('Event has reached its seat capacity');
                    }
                }
                const conflictedEvents = await this.prisma.event.findMany({
                    where: {
                        AND: [
                            {
                                OR: [
                                    { eventCreatorId: request.sender_id },
                                    { joinedUsers: { some: { id: request.sender_id } } },
                                    { presenters: { some: { id: request.sender_id } } },
                                    { moderators: { some: { id: request.sender_id } } },
                                ],
                            },
                            {
                                OR: [
                                    {
                                        startDateTime: {
                                            lte: request.Event.startDateTime,
                                        },
                                        endDateTime: {
                                            gte: request.Event.startDateTime,
                                        },
                                    },
                                    {
                                        startDateTime: {
                                            lte: request.Event.endDateTime,
                                        },
                                        endDateTime: {
                                            gte: request.Event.endDateTime,
                                        },
                                    },
                                    {
                                        startDateTime: {
                                            gte: request.Event.startDateTime,
                                        },
                                        endDateTime: {
                                            lte: request.Event.endDateTime,
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                });
                if (conflictedEvents.length > 0) {
                    throw new common_1.ConflictException('The event the sender wants to join conflicts with an existing event(s) he currently has a role in it');
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
        }
        else {
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
    async sendAnnouncement(userId, eventId, text) {
        await this.checkIfUserExist(userId);
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
            select: {
                eventCreatorId: true,
                moderators: { select: { id: true } },
                presenters: { select: { id: true } },
            },
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found');
        }
        const isAuthorized = (0, helper_functions_1.checkAuthorization)(userId, event.eventCreatorId, event.moderators, event.presenters);
        if (!isAuthorized) {
            throw new common_1.BadRequestException('User is not authorized to send announcements for this event');
        }
        const announcements = await this.prisma.announcement.create({
            data: {
                text,
                userId,
                eventId,
            },
        });
        return announcements;
    }
    async getAnnouncements(userId, eventId) {
        await this.checkIfUserExist(userId);
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
            select: {
                eventCreatorId: true,
                moderators: { select: { id: true } },
                presenters: { select: { id: true } },
                joinedUsers: { select: { id: true } },
            },
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found');
        }
        const isAuthorized = (0, helper_functions_1.checkAuthorization)(userId, event.eventCreatorId, event.moderators, event.presenters, event.joinedUsers);
        if (!isAuthorized) {
            throw new common_1.BadRequestException('User is not authorized to get announcements for this event');
        }
        const announcements = await this.prisma.announcement.findMany({
            where: {
                eventId,
            },
            select: {
                id: true,
                text: true,
                createdAt: true,
                User: {
                    select: {
                        id: true,
                        username: true,
                        profilePictureUrl: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        if (announcements.length === 0) {
            return [];
        }
        const formmatedAnnouncement = announcements.map((announcement) => {
            return {
                id: announcement.id,
                user: {
                    id: announcement.User.id,
                    text: announcement.text,
                    createdAt: announcement.createdAt,
                    username: announcement.User.username,
                    profilePictureUrl: announcement.User.profilePictureUrl,
                    firstName: announcement.User.firstName,
                    lastName: announcement.User.lastName,
                },
            };
        });
        return formmatedAnnouncement;
    }
    async changeChatAllowance(userId, eventId, isAttendeesAllowed) {
        await this.checkIfUserExist(userId);
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
            select: {
                eventCreatorId: true,
                moderators: { select: { id: true } },
                presenters: { select: { id: true } },
            },
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found');
        }
        const isAuthorized = (0, helper_functions_1.checkAuthorization)(userId, event.eventCreatorId, event.moderators, event.presenters);
        if (!isAuthorized) {
            throw new common_1.BadRequestException('User is not authorized to change chat allowance for this event');
        }
        await this.prisma.event.update({
            where: {
                id: eventId,
            },
            data: {
                EventChat: {
                    update: {
                        data: { isAttendeesAllowed },
                    },
                },
            },
        });
        return {
            message: `Chat allowance has been changed to ${isAttendeesAllowed}`,
            isAttendeesAllowed,
        };
    }
    async setEventReminder(userId, eventId, daysOffset) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { firstName: true, email: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
            select: {
                startDateTime: true,
                title: true,
                eventCreator: { select: { id: true, email: true } },
                moderators: { select: { id: true } },
                presenters: { select: { id: true } },
                joinedUsers: { select: { id: true } },
            },
        });
        if (!event) {
            throw new common_1.NotFoundException('event not found');
        }
        const isAuthorized = (0, helper_functions_1.checkAuthorization)(userId, event.eventCreator.id, event.joinedUsers, event.moderators, event.presenters);
        if (!isAuthorized) {
            throw new common_1.BadRequestException('Your not authorized to set a reminder for this event');
        }
        const reminderDate = event.startDateTime;
        reminderDate.setUTCDate(reminderDate.getUTCDate() - daysOffset);
        reminderDate.setUTCHours(0, 0, 0, 0);
        const localDate = new Date();
        const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
        utcDate.setUTCHours(0, 0, 0, 0);
        if (reminderDate < utcDate) {
            throw new common_1.BadRequestException("The reminder can't be in the past");
        }
        else if (reminderDate.getTime() === utcDate.getTime()) {
            const nowInRiyadh = moment.tz('Asia/Riyadh');
            const riyadh12PM = moment
                .tz('Asia/Riyadh')
                .set({ hour: 12, minute: 0, second: 0, millisecond: 0 });
            if (nowInRiyadh.isAfter(riyadh12PM)) {
                const isReminderExist = await this.prisma.reminder.findUnique({
                    where: { userId_eventId: { userId, eventId } },
                });
                if (isReminderExist) {
                    await this.prisma.reminder.delete({
                        where: { id: isReminderExist.id },
                    });
                }
                await (0, aws_uploading_1.sendEmailSendGrid)(user.firstName, event.startDateTime.toLocaleDateString('en-CA', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                }), event.title, user.email, event.eventCreator.email);
                return {
                    message: 'The reminder was set successfully!',
                };
            }
        }
        await this.prisma.reminder.upsert({
            where: { userId_eventId: { userId, eventId } },
            update: {
                reminderDate,
            },
            create: { reminderDate, userId, eventId },
        });
        return {
            message: 'The reminder was set successfully!',
        };
    }
    async getCertificate(userId, eventId) {
        await this.checkIfUserExist(userId);
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
            throw new common_1.NotFoundException('Event not found');
        }
        const user = event.joinedUsers[0];
        if (!user) {
            throw new common_1.BadRequestException('User is not authorized to get the certificate');
        }
        if (event.endDateTime > new Date()) {
            throw new common_1.BadRequestException('The event is not finished yet, you can get the certificate after the event ends');
        }
        const basePath = path.resolve(__dirname, '../../src/event/pdfassets');
        const pdfPath = path.join(basePath, 'Munaseq_Certificate.pdf');
        const arabicFontPath = path.resolve(basePath, '103-Tahoma.ttf');
        const arabicFontBytes = fs.readFileSync(arabicFontPath);
        if (!fs.existsSync(pdfPath)) {
            throw new Error(`PDF template not found at: ${pdfPath}`);
        }
        const existingPdfBytes = fs.readFileSync(pdfPath);
        const pdfDoc = await pdf_lib_1.PDFDocument.load(existingPdfBytes);
        pdfDoc.registerFontkit(fontkit);
        const arabicFont = await pdfDoc.embedFont(arabicFontBytes);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        const { width, height } = firstPage.getSize();
        let certificate = await this.prisma.certificate.findFirst({
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
            throw new common_1.BadRequestException(`Certificate Couldn't be created`);
        }
        const eventCreatorFirstName = event.eventCreator.firstName;
        const eventCreatorLastName = event.eventCreator.lastName;
        const eventCreatorName = ArabicReshaper.convertArabic(`${eventCreatorFirstName} ${eventCreatorLastName}`);
        const eventTitle = ArabicReshaper.convertArabic(event.title);
        const participantFirstName = user.firstName;
        const participantLastName = user.lastName;
        const participantName = ArabicReshaper.convertArabic(`${participantFirstName} ${participantLastName}`);
        const startDate = event.startDateTime;
        const endDate = event.endDateTime;
        let completionDate;
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
        }
        else {
            completionDate = `${endDateString} - ${startDateString}`;
        }
        const certifId = certificate.id;
        const certifLabel = 'معرف الفعالية:';
        firstPage.drawText(eventTitle, {
            x: width / 2 - arabicFont.widthOfTextAtSize(eventTitle, 38) / 2,
            y: height - 172,
            size: 38,
            font: arabicFont,
            color: (0, pdf_lib_1.rgb)(33 / 255, 36 / 255, 39 / 255),
        });
        firstPage.drawText(participantName, {
            x: width / 2 - arabicFont.widthOfTextAtSize(participantName, 22) / 2,
            y: height - 255,
            size: 22,
            font: arabicFont,
            color: (0, pdf_lib_1.rgb)(33 / 255, 36 / 255, 39 / 255),
        });
        firstPage.drawText(eventCreatorName, {
            x: width * 0.75 - arabicFont.widthOfTextAtSize(eventCreatorName, 16) / 2,
            y: height / 2 - 120,
            size: 16,
            font: arabicFont,
            color: (0, pdf_lib_1.rgb)(33 / 255, 36 / 255, 39 / 255),
        });
        firstPage.drawText(completionDate, {
            x: width * 0.25 - arabicFont.widthOfTextAtSize(completionDate, 16) / 2,
            y: height / 2 - 120,
            size: 16,
            font: arabicFont,
            color: (0, pdf_lib_1.rgb)(33 / 255, 36 / 255, 39 / 255),
        });
        firstPage.drawText(certifId, {
            x: width -
                arabicFont.widthOfTextAtSize(certifLabel, 10) -
                arabicFont.widthOfTextAtSize(certifId, 10) -
                10,
            y: 76,
            size: 10,
            font: arabicFont,
            color: (0, pdf_lib_1.rgb)(84 / 255, 84 / 255, 84 / 255),
        });
        const pdfBytes = await pdfDoc.save();
        const certificateUrl = await (0, aws_uploading_1.uploadCertificate)(pdfBytes, certifId);
        if (!certificateUrl) {
            throw new common_1.BadRequestException(`Certificate Couldn't be uploaded`);
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
    async getRecommendedEvents(userId, pageNumber = 1, pageSize = 5) {
        await this.checkIfUserExist(userId);
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { categories: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const userCategories = user.categories || [];
        const skipedRecords = (pageNumber - 1) * pageSize;
        try {
            const events = await this.prisma.event.findMany({
                where: {
                    isPublic: true,
                    AND: [
                        { eventCreatorId: { not: userId } },
                        { joinedUsers: { none: { id: userId } } },
                        { moderators: { none: { id: userId } } },
                        { presenters: { none: { id: userId } } },
                    ],
                },
                include: {
                    eventCreator: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profilePictureUrl: true,
                            username: true,
                            rating: true,
                        },
                    },
                    _count: {
                        select: { joinedUsers: true },
                    },
                    joinedUsers: {
                        select: { id: true },
                    },
                },
            });
            const availableEvents = events.filter((event) => event.seatCapacity === 0 ||
                event._count.joinedUsers < event.seatCapacity);
            if (availableEvents.length === 0) {
                return [];
            }
            const eventsWithScore = availableEvents.map((event) => {
                const categoryMatches = userCategories.filter((category) => event.categories.includes(category)).length;
                return {
                    ...event,
                    categoryMatchScore: categoryMatches,
                    popularityScore: event._count.joinedUsers,
                };
            });
            const sortedEvents = [...eventsWithScore].sort((a, b) => {
                if (b.categoryMatchScore !== a.categoryMatchScore) {
                    return b.categoryMatchScore - a.categoryMatchScore;
                }
                if ((b.rating || 0) !== (a.rating || 0)) {
                    return (b.rating || 0) - (a.rating || 0);
                }
                return b.popularityScore - a.popularityScore;
            });
            const paginatedEvents = sortedEvents.slice(skipedRecords, skipedRecords + pageSize);
            return paginatedEvents.map((event) => {
                const { categoryMatchScore, popularityScore, _count, joinedUsers, ...cleanEvent } = event;
                return {
                    ...cleanEvent,
                    joinedUsersCount: _count.joinedUsers,
                    matchingCategories: userCategories.filter((category) => event.categories.includes(category)),
                };
            });
        }
        catch (error) {
            console.error('Error in getRecommendedEvents:', error);
            return [];
        }
    }
};
exports.EventService = EventService;
exports.EventService = EventService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventService);
//# sourceMappingURL=event.service.js.map