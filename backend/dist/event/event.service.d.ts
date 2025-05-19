import { CreateQuizDto } from './dtos/create-quiz.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Answer, CreateAssignment, CreateEventDto, JoinEventDto, UpdateAssignmentDTO, UpdateEventDto, UpdateQuizDto } from './dtos';
import { InvitationType, RequestType, RoleType } from '@prisma/client';
type TypeOfSubmisson = 'SUBMITTED' | 'SAVED_ANSWERS';
export declare class EventService {
    private prisma;
    constructor(prisma: PrismaService);
    checkIfUserExist(userId: string): Promise<void>;
    createEvent(createEventDto: CreateEventDto, eventCreatorId: string, imageUrl: any): Promise<{
        chatId: string;
        eventCreator: {
            firstName: string;
            lastName: string;
            username: string;
            id: string;
            profilePictureUrl: string;
        };
        gender: import(".prisma/client").$Enums.Gender;
        categories: string[];
        description: string | null;
        id: string;
        rating: number | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        location: string | null;
        seatCapacity: number | null;
        isPublic: boolean;
        isOnline: boolean;
        startDateTime: Date;
        endDateTime: Date;
        imageUrl: string | null;
    }>;
    updateEvent(userId: string, eventId: string, updateEventDto: UpdateEventDto, imageUrl?: any, removeImage?: boolean): Promise<{
        gender: import(".prisma/client").$Enums.Gender;
        categories: string[];
        description: string | null;
        id: string;
        rating: number | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        location: string | null;
        seatCapacity: number | null;
        isPublic: boolean;
        isOnline: boolean;
        startDateTime: Date;
        endDateTime: Date;
        imageUrl: string | null;
        eventCreatorId: string;
    } | ({
        eventCreator: {
            firstName: string;
            lastName: string;
            username: string;
            id: string;
            profilePictureUrl: string;
        };
    } & {
        gender: import(".prisma/client").$Enums.Gender;
        categories: string[];
        description: string | null;
        id: string;
        rating: number | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        location: string | null;
        seatCapacity: number | null;
        isPublic: boolean;
        isOnline: boolean;
        startDateTime: Date;
        endDateTime: Date;
        imageUrl: string | null;
    })>;
    delete(userId: string, eventId: string): Promise<{
        message: string;
    }>;
    getAllEvents(title?: string, pageNumber?: number, pageSize?: number, category?: string, highestRated?: boolean): Promise<({
        eventCreator: {
            firstName: string;
            lastName: string;
            username: string;
            id: string;
            profilePictureUrl: string;
            rating: number;
        };
    } & {
        gender: import(".prisma/client").$Enums.Gender;
        categories: string[];
        description: string | null;
        id: string;
        rating: number | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        location: string | null;
        seatCapacity: number | null;
        isPublic: boolean;
        isOnline: boolean;
        startDateTime: Date;
        endDateTime: Date;
        imageUrl: string | null;
    })[]>;
    findAllCurrentUserEvents(eventCreatorId: string, title?: string, pageNumber?: number, pageSize?: number): Promise<({
        eventCreator: {
            firstName: string;
            lastName: string;
            username: string;
            id: string;
            profilePictureUrl: string;
        };
    } & {
        gender: import(".prisma/client").$Enums.Gender;
        categories: string[];
        description: string | null;
        id: string;
        rating: number | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        location: string | null;
        seatCapacity: number | null;
        isPublic: boolean;
        isOnline: boolean;
        startDateTime: Date;
        endDateTime: Date;
        imageUrl: string | null;
    })[]>;
    getById(eventId: string): Promise<{
        eventCreator: {
            firstName: string;
            lastName: string;
            username: string;
            id: string;
            profilePictureUrl: string;
        };
    } & {
        gender: import(".prisma/client").$Enums.Gender;
        categories: string[];
        description: string | null;
        id: string;
        rating: number | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        location: string | null;
        seatCapacity: number | null;
        isPublic: boolean;
        isOnline: boolean;
        startDateTime: Date;
        endDateTime: Date;
        imageUrl: string | null;
    }>;
    findJoinedEvents(userId: string, title?: string, pageNumber?: number, pageSize?: number): Promise<({
        eventCreator: {
            firstName: string;
            lastName: string;
            username: string;
            id: string;
            profilePictureUrl: string;
        };
    } & {
        gender: import(".prisma/client").$Enums.Gender;
        categories: string[];
        description: string | null;
        id: string;
        rating: number | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        location: string | null;
        seatCapacity: number | null;
        isPublic: boolean;
        isOnline: boolean;
        startDateTime: Date;
        endDateTime: Date;
        imageUrl: string | null;
    })[]>;
    findAllUsersOfEvent(eventId: string): Promise<{
        presenters: {
            firstName: string;
            lastName: string;
            username: string;
            id: string;
            profilePictureUrl: string;
        }[];
        moderators: {
            firstName: string;
            lastName: string;
            username: string;
            id: string;
            profilePictureUrl: string;
        }[];
        joinedUsers: {
            firstName: string;
            lastName: string;
            username: string;
            id: string;
            profilePictureUrl: string;
        }[];
        eventCreator: {
            firstName: string;
            lastName: string;
            username: string;
            id: string;
            profilePictureUrl: string;
        };
    }>;
    findUsersParticipateInEvent(eventId: string, role: string, username?: string, pageNumber?: number, pageSize?: number): Promise<{
        firstName: string;
        lastName: string;
        username: string;
        id: string;
        profilePictureUrl: string;
    }[]>;
    findEventCreator(eventId: any): import(".prisma/client").Prisma.Prisma__EventClient<{
        eventCreator: {
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
        };
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    getMaterials(userId: string, eventId: string): Promise<{
        Materials: {
            createdAt: Date;
            materialId: string;
            materialUrl: string;
        }[];
    } | {
        message: string;
    }>;
    addMaterialsToEvent(eventId: string, userId: string, materials: {
        materialUrl: string;
    }[]): Promise<{
        Materials: {
            materialId: string;
            materialUrl: string;
        }[];
    }>;
    deleteMaterial(userId: string, materialId: string): Promise<{
        message: string;
    }>;
    getQuizzes(userId: string, eventId: string): Promise<{
        numberOfQuizzes: number;
        quizzes: ({
            id: string;
            createdAt: Date;
            updatedAt: Date;
            quizTitle: string;
            startDate: Date;
            endDate: Date;
            timeLimit: number;
            quizStatus: any;
            takeQuizStatus: string;
        } | {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            quizTitle: string;
            startDate: Date;
            endDate: Date;
            timeLimit: number;
            quizStatus: any;
            numberParticipatedUsers: number;
        })[];
    }>;
    showQuiz(userId: string, quizId: string): Promise<{
        TakeQuiz: {};
        id: string;
        createdAt: Date;
        updatedAt: Date;
        quizTitle: string;
        startDate: Date;
        endDate: Date;
        timeLimit: number;
        questions: {
            text: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            questionType: import(".prisma/client").$Enums.QuestionType;
            options: import("@prisma/client/runtime/library").JsonValue;
            correctAnswer: string;
            quizId: string;
        }[];
        quizStatus: string;
        takeQuizStatus: string;
    } | {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        quizTitle: string;
        startDate: Date;
        endDate: Date;
        timeLimit: number;
        questions: {
            text: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            questionType: import(".prisma/client").$Enums.QuestionType;
            options: import("@prisma/client/runtime/library").JsonValue;
            correctAnswer: string;
            quizId: string;
        }[];
        quizStatus: string;
        numberParticipatedUsers: number;
    }>;
    addQuizToEvent(userId: string, eventId: string, body: CreateQuizDto): Promise<any[] | {
        id: string;
        startDate: Date;
        endDate: Date;
        questions: {
            text: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            questionType: import(".prisma/client").$Enums.QuestionType;
            options: import("@prisma/client/runtime/library").JsonValue;
            correctAnswer: string;
            quizId: string;
        }[];
    }>;
    updateQuiz(userId: string, quizId: string, body: UpdateQuizDto): Promise<any[] | ({
        questions: {
            text: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            questionType: import(".prisma/client").$Enums.QuestionType;
            options: import("@prisma/client/runtime/library").JsonValue;
            correctAnswer: string;
            quizId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        eventId: string;
        quizTitle: string;
        startDate: Date;
        endDate: Date;
        timeLimit: number;
    })>;
    saveQuiz(userId: string, quizId: string, answers: Answer[], typeOfSubmission: TypeOfSubmisson): Promise<any>;
    getAllParticipantsQuizResults(userId: string, eventId: string, quizId: string): Promise<{
        userId: string;
        userName: string;
        userEmail: string;
        score: number;
        answers: import("@prisma/client/runtime/library").JsonValue;
        quizStartDate: Date;
        quizEndDate: Date;
    }[]>;
    getQuizById(quizId: string): Promise<{
        id: string;
        startDate: Date;
        endDate: Date;
        timeLimit: number;
        questions: {
            text: string;
            id: string;
            questionType: import(".prisma/client").$Enums.QuestionType;
            options: import("@prisma/client/runtime/library").JsonValue;
            correctAnswer: string;
        }[];
    }>;
    deleteQuiz(userId: string, quizId: string): Promise<{
        message: string;
    }>;
    getAssignments(userId: string, eventId: string): Promise<{
        numberOfAssignments: number;
        assignments: ({
            id: string;
            createdAt: Date;
            updatedAt: Date;
            startDate: Date;
            endDate: Date;
            assignmentTitle: string;
            assignmentStatus: any;
            takeAssignmentStatus: string;
        } | {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            startDate: Date;
            endDate: Date;
            assignmentTitle: string;
            assignmentStatus: any;
            numberParticipatedUsers: number;
        })[];
    }>;
    addAssignment(eventId: string, userId: string, body: CreateAssignment): Promise<any[] | {
        id: string;
        startDate: Date;
        endDate: Date;
        questions: {
            text: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            questionType: import(".prisma/client").$Enums.QuestionType;
            options: import("@prisma/client/runtime/library").JsonValue | null;
            correctAnswer: string | null;
            assignment_id: string;
        }[];
    }>;
    showAssignment(userId: string, assignmentId: string): Promise<{
        TakeAssignment: {};
        id: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date;
        endDate: Date;
        questions: {
            text: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            questionType: import(".prisma/client").$Enums.QuestionType;
            options: import("@prisma/client/runtime/library").JsonValue | null;
            correctAnswer: string | null;
            assignment_id: string;
        }[];
        assignmentTitle: string;
        assignmentStatus: string;
        takeAssignmentStatus: string;
    } | {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date;
        endDate: Date;
        questions: {
            text: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            questionType: import(".prisma/client").$Enums.QuestionType;
            options: import("@prisma/client/runtime/library").JsonValue | null;
            correctAnswer: string | null;
            assignment_id: string;
        }[];
        assignmentTitle: string;
        assignmentStatus: string;
        numberParticipatedUsers: number;
    }>;
    saveAssignment(userId: string, assignmentId: string, answers: Answer[], typeOfSubmission: TypeOfSubmisson): Promise<any>;
    updateAssignment(assignmentId: string, userId: string, body: UpdateAssignmentDTO): Promise<any[] | ({
        questions: {
            text: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            questionType: import(".prisma/client").$Enums.QuestionType;
            options: import("@prisma/client/runtime/library").JsonValue | null;
            correctAnswer: string | null;
            assignment_id: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        eventId: string;
        startDate: Date | null;
        endDate: Date | null;
        assignmentTitle: string;
    })>;
    deleteAssignment(assignmentId: string, userId: string): Promise<{
        message: string;
    }>;
    joinEvent(userId: string, joinEventDto: JoinEventDto): Promise<void>;
    leaveEvent(userId: string, eventId: string): Promise<void>;
    rateEvent(userId: string, eventId: string, rating: number, comment?: string): Promise<{
        message: string;
        avgRating: any;
        numberOfRatings: any;
    }>;
    eventRating(eventId: string): Promise<{
        avgRating: number;
        numberOfRatings: number;
        feedbacks: {
            rating: number;
            createdAt: Date;
            updatedAt: Date;
            comment: string;
            User: {
                firstName: string;
                lastName: string;
                username: string;
                id: string;
                profilePictureUrl: string;
                rating: number;
            };
        }[];
    }>;
    assignRole(userId: string, eventId: string, assignedUserId: string, role: string): Promise<{
        [x: string]: {
            id: string;
        }[] | {
            id: string;
        }[] | {
            id: string;
        }[] | {
            id: string;
        }[] | {
            id: never;
        }[] | {
            id: string;
        }[] | {
            id: string;
        }[] | {
            id: string;
        }[] | {
            id: string;
        }[] | {
            id: string;
        }[];
        [x: number]: never;
    }>;
    unAssignRole(userId: string, eventId: string, assignedUserId: string, role: string): Promise<{
        [x: string]: {
            id: string;
        }[] | {
            id: string;
        }[] | {
            id: string;
        }[] | {
            id: string;
        }[] | {
            id: never;
        }[] | {
            id: string;
        }[] | {
            id: string;
        }[] | {
            id: string;
        }[] | {
            id: string;
        }[] | {
            id: string;
        }[];
        [x: number]: never;
    }>;
    sendInvitation(userId: string, eventId: string, receiverId: string, invitationType: InvitationType, roleType?: RoleType): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        invitationType: import(".prisma/client").$Enums.InvitationType;
        status: import(".prisma/client").$Enums.InvitationStatus;
        roleType: import(".prisma/client").$Enums.RoleType | null;
        sender_id: string;
        receiver_id: string;
        event_id: string;
    }>;
    sendRequest(userId: string, eventId: string, requestType: RequestType, roleType?: RoleType): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.InvitationStatus;
        roleType: import(".prisma/client").$Enums.RoleType | null;
        sender_id: string;
        event_id: string;
        requestType: import(".prisma/client").$Enums.RequestType;
    }>;
    getRequests(userId: string, eventId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.InvitationStatus;
        roleType: import(".prisma/client").$Enums.RoleType;
        Sender: {
            firstName: string;
            lastName: string;
            gender: import(".prisma/client").$Enums.Gender;
            id: string;
            profilePictureUrl: string;
        };
        requestType: import(".prisma/client").$Enums.RequestType;
    }[]>;
    respondToRequest(userId: string, requestId: string, decision: boolean): Promise<{
        message: string;
        status: string;
        requestId: string;
    }>;
    sendAnnouncement(userId: string, eventId: string, text: string): Promise<{
        text: string;
        id: string;
        createdAt: Date;
        userId: string;
        eventId: string | null;
    }>;
    getAnnouncements(userId: string, eventId: string): Promise<{
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
    changeChatAllowance(userId: string, eventId: string, isAttendeesAllowed: boolean): Promise<{
        message: string;
        isAttendeesAllowed: boolean;
    }>;
    setEventReminder(userId: string, eventId: string, daysOffset: number): Promise<{
        message: string;
    }>;
    getCertificate(userId: string, eventId: string): Promise<{
        certificateUrl: any;
    }>;
    getRecommendedEvents(userId: string, pageNumber?: number, pageSize?: number): Promise<{
        joinedUsersCount: number;
        matchingCategories: string[];
        eventCreator: {
            firstName: string;
            lastName: string;
            username: string;
            id: string;
            profilePictureUrl: string;
            rating: number;
        };
        gender: import(".prisma/client").$Enums.Gender;
        categories: string[];
        description: string | null;
        id: string;
        rating: number | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        location: string | null;
        seatCapacity: number | null;
        isPublic: boolean;
        isOnline: boolean;
        startDateTime: Date;
        endDateTime: Date;
        imageUrl: string | null;
        eventCreatorId: string;
    }[]>;
}
export {};
