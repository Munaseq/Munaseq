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
exports.UserController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const swagger_1 = require("@nestjs/swagger");
const get_current_user_id_decorator_1 = require("../auth/decorators/get-current-user-id.decorator");
const auth_guard_1 = require("../auth/auth.guard");
const dtos_1 = require("./dtos");
const aws_uploading_1 = require("../utils/aws.uploading");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    getMe(id) {
        return this.userService.findById(id);
    }
    findAll(query) {
        return this.userService.findAllUsers(query.username, query.pageNumber, query.pageSize, query.highestRated, query.category);
    }
    findByEmail(email) {
        return this.userService.findByEmail(email);
    }
    findByUsername(username) {
        return this.userService.findByUsername(username);
    }
    findUserRoles(userId) {
        return this.userService.findUserRoles(userId);
    }
    editUserInfo(id, EditUserDto, files, removeImage, removeCV) {
        const cvUrl = files?.cv ? files.cv[0].location : null;
        const profilePictureUrl = files?.profilePicture
            ? files.profilePicture[0].location
            : null;
        return this.userService.editUserInfo(id, EditUserDto, cvUrl, profilePictureUrl, removeImage, removeCV);
    }
    getUserRating(userId) {
        return this.userService.getUserRating(userId);
    }
    getInvitation(userId) {
        return this.userService.getInvitation(userId);
    }
    respondToInvitation(body, userId, invitationId) {
        return this.userService.resopndToInvitation(userId, invitationId, body.decision);
    }
    getRequest(userId) {
        return this.userService.getRequest(userId);
    }
    getFollowing(userId) {
        return this.userService.getFollowing(userId);
    }
    getFollowers(userId) {
        return this.userService.getFollowers(userId);
    }
    followUser(userId, followedUserId) {
        return this.userService.followUser(userId, followedUserId);
    }
    unfollowUser(userId, userIdToUnfollow) {
        return this.userService.unfollowUser(userId, userIdToUnfollow);
    }
    createFollowersAnnouncement(userId, body) {
        return this.userService.createFollowersAnnouncement(userId, body);
    }
    getFollowedUsersAnnouncement(userId) {
        return this.userService.getFollowedUsersAnnouncement(userId);
    }
    changePassword(passwordChangeDto, userId) {
        return this.userService.changeUserPassword(passwordChangeDto, userId);
    }
    findById(id) {
        return this.userService.findById(id);
    }
    async deleteUser(id) {
        return this.userService.deleteUser(id);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve the currently authenticated user.' }),
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve the currently authenticated user.' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getMe", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Search for users by username letters with optional pagination.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'username',
        required: false,
        type: String,
        description: 'Username substring to search.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'pageNumber',
        required: false,
        type: Number,
        description: 'Page number for pagination.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'pageSize',
        required: false,
        type: Number,
        description: 'Page size for pagination.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'highestRated',
        required: false,
        type: Boolean,
        description: 'Retreives the highestRated users.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'category',
        required: false,
        type: String,
        description: 'Retreives the users that have the category.',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.SeacrhUser]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('email/:email'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a user by email.' }),
    (0, swagger_1.ApiParam)({ name: 'email', description: 'Email of the user to find.' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findByEmail", null);
__decorate([
    (0, common_1.Get)('username/:username'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a user by their full username.' }),
    (0, swagger_1.ApiParam)({ name: 'username', description: 'Username of the user to find.' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findByUsername", null);
__decorate([
    (0, common_1.Get)('roles/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get roles assigned to a specific user.' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'ID of the user.' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findUserRoles", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(),
    (0, common_1.UseInterceptors)((0, aws_uploading_1.multerUserLogic)()),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Edit the current user information including optional file uploads for CV and profile picture.',
    }),
    (0, swagger_1.ApiBody)({
        description: 'Payload for editing user info. Fields correspond to EditUserInfoDto and include file uploads for cv and profilePicture.',
        schema: {
            type: 'object',
            properties: {
                firstName: { type: 'string', description: 'First name of the user.' },
                lastName: { type: 'string', description: 'Last name of the user.' },
                username: { type: 'string', description: 'Username of the user.' },
                email: {
                    type: 'string',
                    format: 'email',
                    description: 'User email address.',
                },
                gender: {
                    type: 'string',
                    enum: ['MALE', 'FEMALE', 'OTHER'],
                    description: 'Gender of the user.',
                },
                categories: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Array of user interests.',
                },
                description: { type: 'string', description: 'User biography.' },
                socialAccounts: {
                    type: 'object',
                    description: 'JSON object for social media accounts.',
                },
                cv: {
                    type: 'string',
                    format: 'binary',
                    description: 'CV file upload.',
                },
                profilePicture: {
                    type: 'string',
                    format: 'binary',
                    description: 'Profile picture file upload.',
                },
            },
        },
    }),
    (0, swagger_1.ApiQuery)({
        name: 'removeImage',
        required: false,
        type: Boolean,
        description: 'Flag to remove the profile picture.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'removeCV',
        required: false,
        type: Boolean,
        description: 'Flag to remove the CV.',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __param(3, (0, common_1.Query)('removeImage')),
    __param(4, (0, common_1.Query)('removeCV')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.EditUserInfoDto, Object, Boolean, Boolean]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "editUserInfo", null);
__decorate([
    (0, common_1.Get)('rating/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get the rating of a user by their ID.' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'ID of the user.' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getUserRating", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('invitation'),
    (0, swagger_1.ApiOperation)({
        summary: "Get all invitations, wether they've sent or received",
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getInvitation", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('invitation/:invitationId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Respond to an invitation with an accept or reject decision.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'invitationId',
        description: 'ID of the invitation to respond to.',
    }),
    (0, swagger_1.ApiBody)({
        description: 'Decision to accept or reject the invitation.',
        type: dtos_1.RespondInvitationDto,
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(2, (0, common_1.Param)('invitationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.RespondInvitationDto, String, String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "respondToInvitation", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('requests'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all requests',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getRequest", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('following'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all users that the current user is following.',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getFollowing", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('followers'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all users that are following the current user.',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getFollowers", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('follow/:userId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Follow a user by their ID.',
    }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'ID of the user to follow.' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "followUser", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)('unfollow/:userId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Unfollow a user by their ID.',
    }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'ID of the user to unfollow.' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "unfollowUser", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('followers/announcement'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create an announcement for the followers of currently  user.',
    }),
    (0, swagger_1.ApiBody)({
        description: 'Payload for creating an announcement.',
        type: dtos_1.CreateAnnouncementDto,
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.CreateAnnouncementDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "createFollowersAnnouncement", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('followingUsers/announcement'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all announcements for the followed users of currently user.',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getFollowedUsersAnnouncement", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('changePassword'),
    (0, swagger_1.ApiOperation)({
        summary: 'Change the password for the currently authenticated user.',
    }),
    (0, swagger_1.ApiBody)({
        description: 'Payload for changing user password.',
        type: dtos_1.userChangePasswordDto,
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.userChangePasswordDto, String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a user by their ID.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID of the user to find.' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findById", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete the currently authenticated user.' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, get_current_user_id_decorator_1.GetCurrentUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('user'),
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map