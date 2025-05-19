import { EventService } from './event.service';
import { CreateAssignment, CreateEventDto, JoinEventDto, LeaveEventDto, SeacrhUser, SearchEvent, UpdateAssignmentDTO, UpdateEventDto, CreateUpdateRating, AssignRoles, TakeAssigmentDTO, SendInvitationDTO, CreateQuizDto, UpdateQuizDto, SubmitQuizDto, SendRequestDTO, RespondRequestDto, CreateReminderDTO } from './dtos';
import { CreateAnnouncementDto } from '../user/dtos/create-announcement.dto';
export declare class EventController {
    private readonly eventService;
    constructor(eventService: EventService);
    create(createEventDto: CreateEventDto, eventCreatorId: string, files: {
        image?: any;
    }): Promise<{
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
    getAllEvents(query: SearchEvent): Promise<({
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
    findAllCurrentUserEvents(eventCreatorId: string, query: SearchEvent): Promise<({
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
    findJoinedEvents(userId: any, query: SearchEvent): Promise<({
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
    assignRole(eventId: string, userId: string, assignRoleDto: AssignRoles): Promise<{
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
    findUsersAttendEvent(eventId: string, query: SeacrhUser): Promise<{
        firstName: string;
        lastName: string;
        username: string;
        id: string;
        profilePictureUrl: string;
    }[]>;
    findUsersModerateEvent(eventId: string, query: SeacrhUser): Promise<{
        firstName: string;
        lastName: string;
        username: string;
        id: string;
        profilePictureUrl: string;
    }[]>;
    findUsersPresentEvent(eventId: string, query: SeacrhUser): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        username: string;
        profilePictureUrl: string;
    }[]>;
    findEventCreator(eventId: string): import(".prisma/client").Prisma.Prisma__EventClient<{
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
    getRecommendedEvents(userId: string, query: {
        pageNumber?: number;
        pageSize?: number;
    }): Promise<{
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
    update(userId: string, eventId: string, updateEventDto: UpdateEventDto, removeImage: boolean, files: {
        image?: any;
    }): Promise<{
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
    joinEvent(userId: any, joinEventDto: JoinEventDto): Promise<{
        message: string;
    }>;
    leaveEvent(userId: any, leaveEventDto: LeaveEventDto): Promise<{
        message: string;
    }>;
    addMaterialToEvent(eventId: string, files: {
        materials: any;
    }, userId: string): Promise<{
        Materials: {
            materialId: string;
            materialUrl: string;
        }[];
    }>;
    deleteMaterial(userid: string, materialId: string): Promise<{
        message: string;
    }>;
    getMaterials(eventId: string, userId: string): Promise<{
        Materials: {
            createdAt: Date;
            materialId: string;
            materialUrl: string;
        }[];
    } | {
        message: string;
    }>;
    getQuizzes(eventId: string, userId: string): Promise<{
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
    addQuiz(eventId: string, userId: string, CreateQuizDto: CreateQuizDto): Promise<any[] | {
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
    updateQuiz(quizId: string, userId: string, UpdateQuizDto: UpdateQuizDto): Promise<any[] | ({
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
    showQuiz(quizId: string, userId: string): Promise<{
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
    saveQuiz(quizId: string, userId: string, submitQuizDto: SubmitQuizDto): Promise<any>;
    submitQuiz(quizId: string, userId: string, submitQuizDto: SubmitQuizDto): Promise<any>;
    deleteQuiz(quizId: string, userId: string): Promise<{
        message: string;
    }>;
    getAssignments(eventId: string, userId: string): Promise<{
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
    showAssignments(assignmentId: string, userId: string): Promise<{
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
    saveAssignemt(assignmentId: string, userId: string, takeAssignmentDto: TakeAssigmentDTO): Promise<any>;
    submitAssignemt(assignmentId: string, userId: string, takeAssignmentDto: TakeAssigmentDTO): Promise<any>;
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
    deleteAssignment(userId: string, assignmentId: string): Promise<{
        message: string;
    }>;
    rateEvent(eventId: string, userId: string, ratingDto: CreateUpdateRating): Promise<{
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
    sendInvitation(eventId: string, userId: string, body: SendInvitationDTO): Promise<{
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
    respondToRequest(requestId: string, userId: string, body: RespondRequestDto): Promise<{
        message: string;
        status: string;
        requestId: string;
    }>;
    sendRequest(eventId: string, userId: string, body: SendRequestDTO): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.InvitationStatus;
        roleType: import(".prisma/client").$Enums.RoleType | null;
        sender_id: string;
        event_id: string;
        requestType: import(".prisma/client").$Enums.RequestType;
    }>;
    getRequests(eventId: string, userId: string): Promise<{
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
    getAnnouncements(eventId: string, userId: string): Promise<{
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
    sendAnnouncement(eventId: string, userId: string, body: CreateAnnouncementDto): Promise<{
        text: string;
        id: string;
        createdAt: Date;
        userId: string;
        eventId: string | null;
    }>;
    getCertificate(userId: string, eventId: string): Promise<{
        certificateUrl: any;
    }>;
    changeChatAllowance(userId: string, eventId: string, body: {
        isAttendeesAllowed: boolean;
    }): Promise<{
        message: string;
        isAttendeesAllowed: boolean;
    }>;
    setReminder(eventId: string, userId: string, { daysOffset }: CreateReminderDTO): Promise<{
        message: string;
    }>;
    delete(eventId: string, userId: string): Promise<{
        message: string;
    }>;
}
