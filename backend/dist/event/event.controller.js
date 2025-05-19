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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const event_service_1 = require("./event.service");
const auth_guard_1 = require("../auth/auth.guard");
const get_current_user_id_decorator_1 = require("../auth/decorators/get-current-user-id.decorator");
const dtos_1 = require("./dtos");
const aws_uploading_1 = require("../utils/aws.uploading");
const client_1 = require("@prisma/client");
const create_announcement_dto_1 = require("../user/dtos/create-announcement.dto");
let EventController = class EventController {
    constructor(eventService) {
        this.eventService = eventService;
    }
    create(createEventDto, eventCreatorId, files) {
        const imageUrl = files?.image ? files.image[0].location : null;
        return this.eventService.createEvent(createEventDto, eventCreatorId, imageUrl);
    }
    getAllEvents(query) {
        return this.eventService.getAllEvents(query.title, query.pageNumber, query.pageSize, query.category, query.highestRated);
    }
    findAllCurrentUserEvents(eventCreatorId, query) {
        return this.eventService.findAllCurrentUserEvents(eventCreatorId, query.title, query.pageNumber, query.pageSize);
    }
    findJoinedEvents(userId, query) {
        return this.eventService.findJoinedEvents(userId, query.title, query.pageNumber, query.pageSize);
    }
    assignRole(eventId, userId, assignRoleDto) {
        return this.eventService.assignRole(userId, eventId, assignRoleDto.assignedUserId, assignRoleDto.role);
    }
    findAllUsersOfEvent(eventId) {
        return this.eventService.findAllUsersOfEvent(eventId);
    }
    findUsersAttendEvent(eventId, query) {
        return this.eventService.findUsersParticipateInEvent(eventId, 'joinedUsers', query.username, query.pageNumber, query.pageSize);
    }
    findUsersModerateEvent(eventId, query) {
        return this.eventService.findUsersParticipateInEvent(eventId, 'moderators', query.username, query.pageNumber, query.pageSize);
    }
    findUsersPresentEvent(eventId, query) {
        return this.eventService.findUsersParticipateInEvent(eventId, 'presenters', query.username, query.pageNumber, query.pageSize);
    }
    findEventCreator(eventId) {
        return this.eventService.findEventCreator(eventId);
    }
    getRecommendedEvents(userId, query) {
        return this.eventService.getRecommendedEvents(userId, query.pageNumber, query.pageSize);
    }
    getById(eventId) {
        return this.eventService.getById(eventId);
    }
    update(userId, eventId, updateEventDto, removeImage, files) {
        const imageUrl = files?.image ? files.image[0].location : null;
        return this.eventService.updateEvent(userId, eventId, updateEventDto, imageUrl, removeImage);
    }
    async joinEvent(userId, joinEventDto) {
        await this.eventService.joinEvent(userId, joinEventDto);
        return { message: 'Successfully joined the event' };
    }
    async leaveEvent(userId, leaveEventDto) {
        await this.eventService.leaveEvent(userId, leaveEventDto.eventId);
        return { message: 'Successfully left the event' };
    }
    addMaterialToEvent(eventId, files, userId) {
        if (!files.materials || files.materials.length === 0) {
            throw new common_1.BadRequestException('No materials uploaded');
        }
        const materialUrls = files.materials.map((material) => ({
            materialUrl: material.location,
        }));
        return this.eventService.addMaterialsToEvent(eventId, userId, materialUrls);
    }
    deleteMaterial(userid, materialId) {
        return this.eventService.deleteMaterial(userid, materialId);
    }
    getMaterials(eventId, userId) {
        return this.eventService.getMaterials(userId, eventId);
    }
    getQuizzes(eventId, userId) {
        return this.eventService.getQuizzes(userId, eventId);
    }
    addQuiz(eventId, userId, CreateQuizDto) {
        return this.eventService.addQuizToEvent(userId, eventId, CreateQuizDto);
    }
    updateQuiz(quizId, userId, UpdateQuizDto) {
        return this.eventService.updateQuiz(userId, quizId, UpdateQuizDto);
    }
    showQuiz(quizId, userId) {
        return this.eventService.showQuiz(userId, quizId);
    }
    saveQuiz(quizId, userId, submitQuizDto) {
        return this.eventService.saveQuiz(userId, quizId, submitQuizDto.answers, 'SAVED_ANSWERS');
    }
    submitQuiz(quizId, userId, submitQuizDto) {
        return this.eventService.saveQuiz(userId, quizId, submitQuizDto.answers, 'SUBMITTED');
    }
    deleteQuiz(quizId, userId) {
        return this.eventService.deleteQuiz(userId, quizId);
    }
    getAssignments(eventId, userId) {
        return this.eventService.getAssignments(userId, eventId);
    }
    showAssignments(assignmentId, userId) {
        return this.eventService.showAssignment(userId, assignmentId);
    }
    saveAssignemt(assignmentId, userId, takeAssignmentDto) {
        return this.eventService.saveAssignment(userId, assignmentId, takeAssignmentDto.answers, 'SAVED_ANSWERS');
    }
    submitAssignemt(assignmentId, userId, takeAssignmentDto) {
        return this.eventService.saveAssignment(userId, assignmentId, takeAssignmentDto.answers, 'SUBMITTED');
    }
    addAssignment(eventId, userId, body) {
        return this.eventService.addAssignment(eventId, userId, body);
    }
    updateAssignment(assignmentId, userId, body) {
        return this.eventService.updateAssignment(assignmentId, userId, body);
    }
    deleteAssignment(userId, assignmentId) {
        return this.eventService.deleteAssignment(assignmentId, userId);
    }
    rateEvent(eventId, userId, ratingDto) {
        const { rating, comment } = ratingDto;
        return this.eventService.rateEvent(userId, eventId, rating, comment);
    }
    eventRating(eventId) {
        return this.eventService.eventRating(eventId);
    }
    sendInvitation(eventId, userId, body) {
        return this.eventService.sendInvitation(userId, eventId, body.receiverId, body.invitationType, body.roleType);
    }
    respondToRequest(requestId, userId, body) {
        return this.eventService.respondToRequest(userId, requestId, body.decision);
    }
    sendRequest(eventId, userId, body) {
        return this.eventService.sendRequest(userId, eventId, body.requestType, body.roleType);
    }
    getRequests(eventId, userId) {
        return this.eventService.getRequests(userId, eventId);
    }
    getAnnouncements(eventId, userId) {
        return this.eventService.getAnnouncements(userId, eventId);
    }
    sendAnnouncement(eventId, userId, body) {
        return this.eventService.sendAnnouncement(userId, eventId, body.text);
    }
    getCertificate(userId, eventId) {
        return this.eventService.getCertificate(userId, eventId);
    }
    changeChatAllowance(userId, eventId, body) {
        return this.eventService.changeChatAllowance(userId, eventId, body.isAttendeesAllowed);
    }
    setReminder(eventId, userId, { daysOffset }) {
        return this.eventService.setEventReminder(userId, eventId, daysOffset);
    }
    delete(eventId, userId) {
        return this.eventService.delete(userId, eventId);
    }
};
exports.EventController = EventController;
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseInterceptors)((0, aws_uploading_1.multerEventLogic)()),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new event' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: 'Payload for creating an event. Include all fields from CreateEventDto and an optional image file.',
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                categories: {
                    type: 'array',
                    items: { type: 'string' },
                },
                location: { type: 'string' },
                seatCapacity: { type: 'number' },
                isPublic: { type: 'boolean' },
                isOnline: { type: 'boolean' },
                gender: { type: 'string', enum: Object.values(client_1.Gender) },
                startDateTime: { type: 'string', format: 'date-time' },
                endDateTime: { type: 'string', format: 'date-time' },
                image: { type: 'string', format: 'binary' },
            },
        },
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true }))),
    __param(1, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.CreateEventDto, String, Object]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all public events' }),
    (0, swagger_1.ApiQuery)({ name: 'title', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'pageNumber', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({
        name: 'highestRated',
        required: false,
        type: Boolean,
        description: 'Retreives the highestRated events.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'category',
        required: false,
        type: String,
        description: 'Retreives the events that have the category.',
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.SearchEvent]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "getAllEvents", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('current'),
    (0, swagger_1.ApiOperation)({ summary: 'Get events created by the current user' }),
    (0, swagger_1.ApiQuery)({ name: 'title', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'pageNumber', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, type: Number }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.SearchEvent]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "findAllCurrentUserEvents", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('joinedEvents'),
    (0, swagger_1.ApiOperation)({ summary: 'Get events joined by the current user' }),
    (0, swagger_1.ApiQuery)({ name: 'title', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'pageNumber', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, type: Number }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.SearchEvent]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "findJoinedEvents", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('assignRole/:eventId'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign a role to a user for an event' }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'ID of the event' }),
    (0, swagger_1.ApiBody)({
        description: 'Payload containing assignedUserId and role',
        type: dtos_1.AssignRoles,
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dtos_1.AssignRoles]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "assignRole", null);
__decorate([
    (0, common_1.Get)('allUsers/:eventId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all users of an event' }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'ID of the event' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "findAllUsersOfEvent", null);
__decorate([
    (0, common_1.Get)('attendees/:eventId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all attendees of an event' }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'ID of the event' }),
    (0, swagger_1.ApiQuery)({ name: 'username', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'pageNumber', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, type: Number }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.SeacrhUser]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "findUsersAttendEvent", null);
__decorate([
    (0, common_1.Get)('moderators/:eventId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all moderators of an event' }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'ID of the event' }),
    (0, swagger_1.ApiQuery)({ name: 'username', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'pageNumber', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, type: Number }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.SeacrhUser]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "findUsersModerateEvent", null);
__decorate([
    (0, common_1.Get)('presenters/:eventId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all presenters of an event' }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'ID of the event' }),
    (0, swagger_1.ApiQuery)({ name: 'username', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'pageNumber', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, type: Number }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.SeacrhUser]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "findUsersPresentEvent", null);
__decorate([
    (0, common_1.Get)('eventCreator/:eventId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get the creator of an event' }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'ID of the event' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "findEventCreator", null);
__decorate([
    (0, common_1.Get)('recommended'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recommended events for user' }),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiQuery)({ name: 'pageNumber', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, type: Number }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "getRecommendedEvents", null);
__decorate([
    (0, common_1.Get)(':eventId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get event details by ID' }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'ID of the event' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "getById", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(':eventId'),
    (0, common_1.UseInterceptors)((0, aws_uploading_1.multerEventLogic)()),
    (0, swagger_1.ApiOperation)({ summary: 'Update an event' }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'ID of the event' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiQuery)({
        name: 'removeImage',
        required: false,
        type: Boolean,
        description: 'Flag to remove the profile picture.',
    }),
    (0, swagger_1.ApiBody)({
        description: 'Payload for updating an event. Include all fields from UpdateEventDto and an optional image file.',
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                categories: {
                    type: 'array',
                    items: { type: 'string' },
                },
                location: { type: 'string' },
                seatCapacity: { type: 'number' },
                isPublic: { type: 'boolean' },
                isOnline: { type: 'boolean' },
                gender: { type: 'string', enum: Object.values(client_1.Gender) },
                startDateTime: { type: 'string', format: 'date-time' },
                endDateTime: { type: 'string', format: 'date-time' },
                image: { type: 'string', format: 'binary' },
            },
        },
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Query)('removeImage')),
    __param(4, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dtos_1.UpdateEventDto, Boolean, Object]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('join'),
    (0, swagger_1.ApiOperation)({ summary: 'Join an event' }),
    (0, swagger_1.ApiBody)({
        description: 'Payload for joining an event',
        type: dtos_1.JoinEventDto,
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.JoinEventDto]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "joinEvent", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)('leave'),
    (0, swagger_1.ApiOperation)({ summary: 'Leave an event' }),
    (0, swagger_1.ApiBody)({
        description: 'Payload for leaving an event',
        type: dtos_1.LeaveEventDto,
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.LeaveEventDto]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "leaveEvent", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseInterceptors)((0, aws_uploading_1.multerMaterialtLogic)()),
    (0, common_1.Post)('addMaterial/:eventId'),
    (0, swagger_1.ApiOperation)({ summary: 'Add materials to an event' }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'ID of the event' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: 'Payload for adding material. Expects a file upload with field name "materials".',
        schema: {
            type: 'object',
            properties: {
                materials: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                },
            },
        },
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "addMaterialToEvent", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)('deleteMaterial/:materialId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete material from an event' }),
    (0, swagger_1.ApiParam)({ name: 'materialId', description: 'ID of the material' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Param)('materialId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "deleteMaterial", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('materials/:eventId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get materials for an event' }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'ID of the event' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "getMaterials", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('quizzes/:eventId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get quizzes for an event' }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'ID of the event' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "getQuizzes", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('quiz/:eventId'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a quiz to an event' }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'ID of the event' }),
    (0, swagger_1.ApiBody)({
        description: 'Payload for creating a quiz',
        type: dtos_1.CreateQuizDto,
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dtos_1.CreateQuizDto]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "addQuiz", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)('quiz/:quizId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a quiz for an event' }),
    (0, swagger_1.ApiParam)({ name: 'quizId', description: 'ID of the quiz' }),
    (0, swagger_1.ApiBody)({
        description: 'Payload for updating a quiz',
        type: dtos_1.UpdateQuizDto,
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('quizId')),
    __param(1, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dtos_1.UpdateQuizDto]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "updateQuiz", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('quiz/show/:quizId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Show quiz details. Adds takeQuizStatus if the user is an attendee, or numberParticipatedUsers if the user is a moderator, event creator, or presenter.',
    }),
    (0, swagger_1.ApiParam)({ name: 'quizId', description: 'ID of the quiz' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('quizId')),
    __param(1, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "showQuiz", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('quiz/save/:quizId'),
    (0, swagger_1.ApiOperation)({ summary: 'Save quiz answers' }),
    (0, swagger_1.ApiParam)({ name: 'quizId', description: 'ID of the quiz' }),
    (0, swagger_1.ApiBody)({
        description: 'Payload containing quiz answers',
        type: dtos_1.SubmitQuizDto,
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('quizId')),
    __param(1, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dtos_1.SubmitQuizDto]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "saveQuiz", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('quiz/submit/:quizId'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit quiz answers' }),
    (0, swagger_1.ApiParam)({ name: 'quizId', description: 'ID of the quiz' }),
    (0, swagger_1.ApiBody)({
        description: 'Payload containing quiz answers',
        type: dtos_1.SubmitQuizDto,
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('quizId')),
    __param(1, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dtos_1.SubmitQuizDto]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "submitQuiz", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)('quiz/:quizId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a quiz from an event' }),
    (0, swagger_1.ApiParam)({ name: 'quizId', description: 'ID of the quiz' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('quizId')),
    __param(1, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "deleteQuiz", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('assignments/:eventId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get assignments for an event' }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'ID of the event' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "getAssignments", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('assignment/show/:assignmentId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Show assignment details. Adds takeAssignmentStatus if the user is an attendee, or numberParticipatedUsers if the user is a moderator, event creator, or presenter.',
    }),
    (0, swagger_1.ApiParam)({ name: 'assignmentId', description: 'ID of the assignment' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('assignmentId')),
    __param(1, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "showAssignments", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('assignment/save/:assignmentId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Save assignment answers. The user must be an attendee to save answers.',
    }),
    (0, swagger_1.ApiBody)({
        description: 'Payload for saving an assignment',
        type: dtos_1.TakeAssigmentDTO,
    }),
    (0, swagger_1.ApiParam)({ name: 'assignmentId', description: 'ID of the assignment' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('assignmentId')),
    __param(1, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dtos_1.TakeAssigmentDTO]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "saveAssignemt", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('assignment/submit/:assignmentId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Submit assignment answers. The user must be an attendee to save answers.',
    }),
    (0, swagger_1.ApiBody)({
        description: 'Payload for submitting an assignment',
        type: dtos_1.TakeAssigmentDTO,
    }),
    (0, swagger_1.ApiParam)({ name: 'assignmentId', description: 'ID of the assignment' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('assignmentId')),
    __param(1, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dtos_1.TakeAssigmentDTO]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "submitAssignemt", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('assignment/:eventId'),
    (0, swagger_1.ApiOperation)({
        summary: 'create an assignment for an event. The user must be an event creator, moderator, or presenter to create an assignment.',
    }),
    (0, swagger_1.ApiBody)({
        description: 'Payload for creating an assignment',
        type: dtos_1.CreateAssignment,
    }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'ID of the event' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dtos_1.CreateAssignment]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "addAssignment", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)('assignment/:assignmentId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update an assignment. The user must be an event creator, moderator, or presenter to update an assignment.',
    }),
    (0, swagger_1.ApiBody)({
        description: 'Payload for updating an assignment',
        type: dtos_1.CreateAssignment,
    }),
    (0, swagger_1.ApiParam)({ name: 'assignmentId', description: 'ID of the assignment' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('assignmentId')),
    __param(1, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dtos_1.UpdateAssignmentDTO]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "updateAssignment", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)('assignment/:assignmentId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete an assignment. The user must be an event creator, moderator, or presenter to delete an assignment.',
    }),
    (0, swagger_1.ApiParam)({ name: 'assignmentId', description: 'ID of the assignment' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Param)('assignmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "deleteAssignment", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('ratingEvent/:eventId'),
    (0, swagger_1.ApiOperation)({ summary: 'Rate an event' }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'ID of the event' }),
    (0, swagger_1.ApiBody)({
        description: 'Payload for rating an event',
        type: dtos_1.CreateUpdateRating,
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dtos_1.CreateUpdateRating]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "rateEvent", null);
__decorate([
    (0, common_1.Get)('ratings/:eventId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get event rating' }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'ID of the event' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "eventRating", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('invitation/:eventId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Send Invitation to users in order to join or to be assigned to certain role',
    }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'ID of the event' }),
    (0, swagger_1.ApiBody)({
        description: 'Payload for sending an invitation',
        type: dtos_1.SendInvitationDTO,
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dtos_1.SendInvitationDTO]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "sendInvitation", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('request/respond/:requestId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Respond to a request',
    }),
    (0, swagger_1.ApiParam)({ name: 'requestId', description: 'ID of the request' }),
    (0, swagger_1.ApiBody)({
        description: 'Decision to accept or reject the request',
        type: dtos_1.RespondRequestDto,
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('requestId')),
    __param(1, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dtos_1.RespondRequestDto]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "respondToRequest", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('request/:eventId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Request to join an event',
    }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'ID of the event' }),
    (0, swagger_1.ApiBody)({
        description: 'Payload for sending a request for joining an event or to be assigned to certain role',
        type: dtos_1.SendRequestDTO,
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dtos_1.SendRequestDTO]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "sendRequest", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('requests/:eventId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all requests for an event',
    }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'ID of the event' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "getRequests", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('announcement/:eventId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all announcements for an event',
    }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'ID of the event' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "getAnnouncements", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('announcement/:eventId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create an announcement for an event',
    }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'ID of the event' }),
    (0, swagger_1.ApiBody)({
        description: 'Payload for creating an announcement',
        type: create_announcement_dto_1.CreateAnnouncementDto,
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_announcement_dto_1.CreateAnnouncementDto]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "sendAnnouncement", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a certificate for an event. The user must an attendee to generate the certificate.',
    }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'ID of the event' }),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('certificate/:eventId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Param)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "getCertificate", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)('chat/:eventId'),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'ID of the event' }),
    (0, swagger_1.ApiBody)({
        description: 'Payload for changing chat allowance',
        type: dtos_1.UpdateChatAllowanceDto,
    }),
    (0, swagger_1.ApiOperation)({
        summary: 'Change the chat allowance for attendees to send a chat (the default is true). The authorized user must be an event creator, moderator, or presenter.',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Param)('eventId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "changeChatAllowance", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Put)('reminder/:eventId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create/update a reminder for an event',
    }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'ID of the event' }),
    (0, swagger_1.ApiBody)({
        description: 'Payload for defining the number of offset days. To clarify, if the date is 2025/1/5 and daysOffset=2 then the reminder will be send in 2025/1/3',
        type: dtos_1.CreateReminderDTO,
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dtos_1.CreateReminderDTO]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "setReminder", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)(':eventId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an event' }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'ID of the event' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "delete", null);
exports.EventController = EventController = __decorate([
    (0, swagger_1.ApiTags)('event'),
    (0, common_1.Controller)('event'),
    __metadata("design:paramtypes", [event_service_1.EventService])
], EventController);
//# sourceMappingURL=event.controller.js.map