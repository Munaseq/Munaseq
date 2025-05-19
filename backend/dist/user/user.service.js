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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const argon2 = require("argon2");
const library_1 = require("@prisma/client/runtime/library");
let UserService = class UserService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async deleteUser(id) {
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
        if (!user) {
            throw new common_1.BadRequestException("The user doesn't exist ");
        }
        let usersToBeUpdated = [];
        let updatedUserIds = [];
        user.GiveFeedback.forEach((item) => {
            const createdEvents = item.Event.eventCreator.createdEvents;
            const userId = item.Event.eventCreator.id;
            if (updatedUserIds.length > 0) {
                const isExist = updatedUserIds?.find((id) => userId === id);
                if (!isExist) {
                    return;
                }
            }
            let ECNumebrOfratings = 0;
            let ECSumOfratings = 0;
            const eventsToBeUpdated = createdEvents.map((event) => {
                const numberOfRatings = event.GivenFeedbacks.length;
                const sumOfRatings = event.GivenFeedbacks.reduce((sum, curr) => sum + curr.rating, 0);
                ECNumebrOfratings += numberOfRatings;
                ECSumOfratings += sumOfRatings;
                return {
                    eventId: event.id,
                    avgRating: numberOfRatings === 0 ? 0 : sumOfRatings / numberOfRatings,
                };
            });
            const avgRating = ECNumebrOfratings === 0 ? 0 : ECSumOfratings / ECNumebrOfratings;
            usersToBeUpdated.push({
                userId,
                avgRating,
                Events: eventsToBeUpdated,
            });
            updatedUserIds.push(userId);
        });
        await Promise.all(usersToBeUpdated.map(async (user) => {
            await this.prisma.user.update({
                where: { id: user.userId },
                data: { rating: user.avgRating },
            });
            await Promise.all(user.Events.map(async (event) => {
                await this.prisma.event.update({
                    where: { id: event.eventId },
                    data: { rating: event.avgRating },
                });
            }));
        }));
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
            return { count: deletedUsers.count };
        }
        catch (error) {
            throw new common_1.HttpException('Error deleting users', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findById(id) {
        try {
            return await this.prisma.user.findUniqueOrThrow({
                where: {
                    id,
                },
            });
        }
        catch (error) {
            if (error instanceof library_1.PrismaClientKnownRequestError) {
                throw new common_1.HttpException('No account with the provided id has been found', common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException('Internal server error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByEmail(email) {
        try {
            return await this.prisma.user.findUniqueOrThrow({
                where: {
                    email,
                },
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException('No account with the provided email has been found', common_1.HttpStatus.NOT_FOUND);
            }
            if (error instanceof library_1.PrismaClientKnownRequestError) {
                throw new common_1.HttpException('Database error', common_1.HttpStatus.BAD_REQUEST);
            }
            throw new common_1.HttpException('Internal server error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByUsername(username) {
        try {
            return await this.prisma.user.findUniqueOrThrow({
                where: {
                    username,
                },
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException('No account with the provided username has been found', common_1.HttpStatus.NOT_FOUND);
            }
            if (error instanceof library_1.PrismaClientKnownRequestError) {
                throw new common_1.HttpException('Database error', common_1.HttpStatus.BAD_REQUEST);
            }
            throw new common_1.HttpException('Internal server error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async editUserInfo(id, EditUserDto, cvUrl, profilePictureUrl, removeImage, removeCV) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id },
            });
            cvUrl = cvUrl ?? user.cvUrl;
            profilePictureUrl = profilePictureUrl ?? user.profilePictureUrl;
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
        }
        catch (error) {
            throw new common_1.HttpException('Invalid Information Provided', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAllUsers(username, pageNumber = 1, pageSize = 5, highestRated, category) {
        const skipedRecords = (pageNumber - 1) * pageSize;
        return this.prisma.user.findMany({
            where: {
                username: {
                    contains: username,
                },
                ...(category && { categories: { has: category } }),
            },
            omit: {
                password: true,
            },
            take: pageSize,
            skip: skipedRecords,
            ...(highestRated && { orderBy: { rating: 'desc' } }),
        });
    }
    async findUserRoles(userId) {
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
        }
        else {
            throw new common_1.NotFoundException("The userId dosen't exist");
        }
    }
    async getUserRating(userId) {
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
            throw new common_1.NotFoundException('User not found');
        }
        const numberOfRatings = user.createdEvents.reduce((sum, event) => sum + event._count.GivenFeedbacks, 0);
        return {
            avgRating: user.rating,
            numberOfRatings,
        };
    }
    async changeUserPassword(passwordChangeDto, userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        const isOldPasswordValid = await argon2.verify(user.password, passwordChangeDto.oldpassword);
        if (!isOldPasswordValid) {
            throw new common_1.HttpException('Invalid Information Provided', common_1.HttpStatus.BAD_REQUEST);
        }
        const hash = await argon2.hash(passwordChangeDto.newpassword);
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
    async getInvitation(userId) {
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
            }
            else {
                receivedInvitations.push(invitation);
            }
        });
        return { sentInvitations, receivedInvitations };
    }
    async resopndToInvitation(userId, invitationId, decision) {
        const invitation = await this.prisma.invitation.findUnique({
            where: {
                id: invitationId,
                receiver_id: userId,
            },
            include: {
                Event: {
                    select: {
                        gender: true,
                        id: true,
                        isPublic: true,
                        joinedUsers: true,
                        seatCapacity: true,
                        startDateTime: true,
                        endDateTime: true,
                        moderators: true,
                        presenters: true,
                        eventCreatorId: true,
                    },
                },
                Receiver: {
                    select: {
                        gender: true,
                    },
                },
            },
        });
        if (!invitation) {
            throw new common_1.NotFoundException('Invitation not found');
        }
        if (!invitation.Event) {
            throw new common_1.NotFoundException('Event not found');
        }
        if (invitation.receiver_id !== userId) {
            throw new common_1.ForbiddenException('You are not authorized to respond to this invitation');
        }
        if (invitation.status !== 'PENDING') {
            throw new common_1.BadRequestException("you've already responded to this invitation ");
        }
        const isSenderIsEventCreator = invitation.Event.eventCreatorId === invitation.sender_id;
        const isSenderIsPresenter = invitation.Event.presenters.some((presenter) => presenter.id === invitation.sender_id);
        const isSenderIsModerator = invitation.Event.moderators.some((moderator) => moderator.id === invitation.sender_id);
        const isSenderIsJoinedUser = invitation.Event.joinedUsers.some((joinedUser) => joinedUser.id === invitation.sender_id);
        if (!isSenderIsEventCreator &&
            !isSenderIsModerator &&
            !isSenderIsPresenter &&
            !isSenderIsJoinedUser) {
            await this.prisma.invitation.update({
                where: {
                    id: invitationId,
                },
                data: {
                    status: 'CANCELED_BY_SYSTEM',
                },
            });
            throw new common_1.BadRequestException("The invitation's sender is no longer authorized to send this invitation");
        }
        const event = invitation.Event;
        const isGenderCompatible = invitation.Receiver.gender == event.gender || event.gender == 'BOTH';
        if (!isGenderCompatible) {
            throw new common_1.BadRequestException("User gender does not match the event's accepted gender");
        }
        if (decision) {
            if (invitation.invitationType === 'ROLE_INVITATION') {
                if (!isSenderIsEventCreator && !isSenderIsModerator) {
                    await this.prisma.invitation.update({
                        where: {
                            id: invitationId,
                        },
                        data: {
                            status: 'CANCELED_BY_SYSTEM',
                        },
                    });
                    throw new common_1.BadRequestException("The invitation's sender is no longer authorized to send this invitation");
                }
                const role = invitation.roleType === 'MODERATOR' ? 'moderators' : 'presenters';
                const isAlreadyInRole = invitation.Event[role].some((user) => user.id === userId);
                if (isAlreadyInRole) {
                    await this.prisma.invitation.update({
                        where: {
                            id: invitationId,
                        },
                        data: {
                            status: 'CANCELED_BY_SYSTEM',
                        },
                    });
                    throw new common_1.BadRequestException(`You are already in the ${invitation.roleType} role, and the invitation has been canceled`);
                }
                const isAlreadyJoinedUser = invitation.Event.joinedUsers.some((user) => user.id === userId);
                const isAlreadyPresenterUser = invitation.Event.presenters.some((user) => user.id === userId);
                const isAlreadyModeratorUser = invitation.Event.moderators.some((user) => user.id === userId);
                if (isAlreadyJoinedUser ||
                    isAlreadyPresenterUser ||
                    isAlreadyModeratorUser) {
                    let roleToRemove;
                    if (isAlreadyJoinedUser) {
                        roleToRemove = 'joinedUsers';
                    }
                    else if (isAlreadyPresenterUser) {
                        roleToRemove = 'presenters';
                    }
                    else {
                        roleToRemove = 'moderators';
                    }
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
            }
            else if (invitation.invitationType === 'EVENT_INVITATION') {
                if (isSenderIsJoinedUser ||
                    isSenderIsPresenter ||
                    isSenderIsModerator ||
                    isSenderIsEventCreator) {
                    if (!invitation.Event.isPublic) {
                        if (!isSenderIsEventCreator && !isSenderIsModerator) {
                            await this.prisma.invitation.update({
                                where: {
                                    id: invitationId,
                                },
                                data: {
                                    status: 'CANCELED_BY_SYSTEM',
                                },
                            });
                            throw new common_1.BadRequestException("The invitation's sender is no longer authorized to send this invitation");
                        }
                    }
                }
                const isAlreadyJoinedUser = invitation.Event.joinedUsers.some((user) => user.id === userId);
                if (isAlreadyJoinedUser) {
                    await this.prisma.invitation.update({
                        where: {
                            id: invitationId,
                        },
                        data: {
                            status: 'CANCELED_BY_SYSTEM',
                        },
                    });
                    throw new common_1.BadRequestException(`You are already in the event, and the invitation has been canceled`);
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
                    throw new common_1.ConflictException('The event you want to join conflicts with an existing event(s)');
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
        }
        else {
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
    async getRequest(userId) {
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
            orderBy: { updatedAt: 'desc' },
        });
        return requests;
    }
    async getFollowing(userId) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                _count: { select: { FollowedUsers: true } },
                FollowedUsers: {
                    select: {
                        FollowedUser: {
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
                },
            },
        });
        if (!user) {
            throw new common_1.BadRequestException("The user doesn't exist ");
        }
        const followingUsers = user.FollowedUsers.map((followedUser) => followedUser.FollowedUser);
        return {
            numberOfFollowingUsers: user._count.FollowedUsers,
            followingUsers,
        };
    }
    async getFollowers(userId) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                _count: { select: { Followers: true } },
                Followers: {
                    select: {
                        Follower: {
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
                },
            },
        });
        if (!user) {
            throw new common_1.BadRequestException("The user doesn't exist ");
        }
        const followersUsers = user.Followers.map((follower) => follower.Follower);
        return {
            numberOfFollowersUsers: user._count.Followers,
            followersUsers,
        };
    }
    async followUser(userId, followedUserId) {
        if (followedUserId === ':userId') {
            throw new common_1.BadRequestException('Please provide a userId to follow');
        }
        if (userId === followedUserId) {
            throw new common_1.BadRequestException('You cannot follow yourself, please choose another user');
        }
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                FollowedUsers: {
                    where: {
                        followedUserId: followedUserId,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.BadRequestException("The user doesn't exist ");
        }
        const isAlreadyFollowing = user.FollowedUsers[0];
        if (isAlreadyFollowing) {
            throw new common_1.BadRequestException('You are already following this user');
        }
        const followedUser = await this.prisma.user.findUnique({
            where: {
                id: followedUserId,
            },
        });
        if (!followedUser) {
            throw new common_1.BadRequestException("The followed user doesn't exist ");
        }
        await this.prisma.user.update({
            where: {
                id: followedUserId,
            },
            data: {
                Followers: {
                    create: {
                        followerId: userId,
                    },
                },
            },
        });
        return {
            message: 'You are now following the specified user',
        };
    }
    async unfollowUser(userId, userIdToUnfollow) {
        if (userIdToUnfollow === ':userId') {
            throw new common_1.BadRequestException('Please provide a userId to unfollow');
        }
        if (userId === userIdToUnfollow) {
            throw new common_1.BadRequestException('You cannot unfollow yourself, please choose another user');
        }
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                FollowedUsers: {
                    where: {
                        followedUserId: userIdToUnfollow,
                    },
                    select: {
                        id: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.BadRequestException("The user doesn't exist ");
        }
        const isAlreadyFollowing = user.FollowedUsers[0];
        if (!isAlreadyFollowing) {
            throw new common_1.BadRequestException('You are already not following this user');
        }
        await this.prisma.following.delete({
            where: {
                id: isAlreadyFollowing.id,
            },
        });
        return {
            message: 'You are now not following the specified user',
        };
    }
    async createFollowersAnnouncement(userId, body) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new common_1.BadRequestException("The user doesn't exist ");
        }
        return this.prisma.announcement.create({
            data: {
                ...body,
                userId,
            },
        });
    }
    async getFollowedUsersAnnouncement(userId) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                FollowedUsers: {
                    select: {
                        followedUserId: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.BadRequestException("The user doesn't exist ");
        }
        const followedUsersIds = user.FollowedUsers.map((followedUser) => followedUser.followedUserId);
        const announcement = await this.prisma.announcement.findMany({
            where: {
                userId: { in: [...followedUsersIds, userId] },
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
        if (announcement.length === 0) {
            return [];
        }
        const formmatedAnnouncement = announcement.map((announcement) => {
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
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map