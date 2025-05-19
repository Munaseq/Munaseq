import { PrismaService } from '../prisma/prisma.service';
import { CreateAnnouncementDto, EditUserInfoDto, userChangePasswordDto } from './dtos';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    deleteUser(id: string): Promise<{
        firstName: string;
        lastName: string;
        username: string;
        email: string;
        gender: import(".prisma/client").$Enums.Gender;
        categories: string[];
        description: string | null;
        socialAccounts: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        profilePictureUrl: string | null;
        cvUrl: string | null;
        rating: number | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteAll(): Promise<{
        count: number;
    }>;
    findById(id: string): Promise<{
        firstName: string;
        lastName: string;
        username: string;
        email: string;
        gender: import(".prisma/client").$Enums.Gender;
        categories: string[];
        description: string | null;
        socialAccounts: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        password: string;
        profilePictureUrl: string | null;
        cvUrl: string | null;
        rating: number | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByEmail(email: string): Promise<{
        firstName: string;
        lastName: string;
        username: string;
        email: string;
        gender: import(".prisma/client").$Enums.Gender;
        categories: string[];
        description: string | null;
        socialAccounts: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        password: string;
        profilePictureUrl: string | null;
        cvUrl: string | null;
        rating: number | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByUsername(username: string): Promise<{
        firstName: string;
        lastName: string;
        username: string;
        email: string;
        gender: import(".prisma/client").$Enums.Gender;
        categories: string[];
        description: string | null;
        socialAccounts: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        password: string;
        profilePictureUrl: string | null;
        cvUrl: string | null;
        rating: number | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    editUserInfo(id: string, EditUserDto: EditUserInfoDto, cvUrl?: any, profilePictureUrl?: any, removeImage?: boolean, removeCV?: boolean): Promise<{
        firstName: string;
        lastName: string;
        username: string;
        email: string;
        gender: import(".prisma/client").$Enums.Gender;
        categories: string[];
        description: string | null;
        socialAccounts: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        profilePictureUrl: string | null;
        cvUrl: string | null;
        rating: number | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAllUsers(username?: string, pageNumber?: number, pageSize?: number, highestRated?: boolean, category?: string): Promise<{
        firstName: string;
        lastName: string;
        username: string;
        email: string;
        gender: import(".prisma/client").$Enums.Gender;
        categories: string[];
        description: string | null;
        socialAccounts: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        profilePictureUrl: string | null;
        cvUrl: string | null;
        rating: number | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findUserRoles(userId: string): Promise<{
        createdEvents: {
            id: string;
        }[];
        joinedEvents: {
            id: string;
        }[];
        presentedEvents: {
            id: string;
        }[];
        moderatedEvents: {
            id: string;
        }[];
    }>;
    getUserRating(userId: string): Promise<{
        avgRating: number;
        numberOfRatings: number;
    }>;
    changeUserPassword(passwordChangeDto: userChangePasswordDto, userId: string): Promise<{
        firstName: string;
        lastName: string;
        username: string;
        email: string;
        gender: import(".prisma/client").$Enums.Gender;
        categories: string[];
        description: string | null;
        socialAccounts: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        profilePictureUrl: string | null;
        cvUrl: string | null;
        rating: number | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getInvitation(userId: string): Promise<{
        sentInvitations: any[];
        receivedInvitations: any[];
    }>;
    resopndToInvitation(userId: string, invitationId: string, decision: boolean): Promise<{
        message: string;
        status: string;
        invitationId: string;
    }>;
    getRequest(userId: string): Promise<{
        id: string;
        Event: {
            id: string;
            title: string;
            imageUrl: string;
            eventCreator: {
                firstName: string;
                lastName: string;
                username: string;
                id: string;
                profilePictureUrl: string;
            };
        };
        status: import(".prisma/client").$Enums.InvitationStatus;
        roleType: import(".prisma/client").$Enums.RoleType;
        requestType: import(".prisma/client").$Enums.RequestType;
    }[]>;
    getFollowing(userId: string): Promise<{
        numberOfFollowingUsers: number;
        followingUsers: {
            firstName: string;
            lastName: string;
            username: string;
            id: string;
            profilePictureUrl: string;
        }[];
    }>;
    getFollowers(userId: string): Promise<{
        numberOfFollowersUsers: number;
        followersUsers: {
            firstName: string;
            lastName: string;
            username: string;
            id: string;
            profilePictureUrl: string;
        }[];
    }>;
    followUser(userId: string, followedUserId: string): Promise<{
        message: string;
    }>;
    unfollowUser(userId: string, userIdToUnfollow: string): Promise<{
        message: string;
    }>;
    createFollowersAnnouncement(userId: string, body: CreateAnnouncementDto): Promise<{
        text: string;
        id: string;
        createdAt: Date;
        userId: string;
        eventId: string | null;
    }>;
    getFollowedUsersAnnouncement(userId: string): Promise<{
        id: string;
        user: {
            id: string;
            text: string;
            createdAt: Date;
            username: string;
            profilePictureUrl: string;
            firstName: string;
            lastName: string;
        };
    }[]>;
}
