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
exports.AuthController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const aws_uploading_1 = require("../utils/aws.uploading");
const swagger_1 = require("@nestjs/swagger");
const dtos_1 = require("./dtos");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    signIn(signInDto) {
        return this.authService.signIn(signInDto);
    }
    signUp(body, files) {
        const cvUrl = files?.cv ? files.cv[0].location : null;
        const profilePictureUrl = files?.profilePicture
            ? files.profilePicture[0].location
            : null;
        return this.authService.signup(body, profilePictureUrl, cvUrl);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('signIn'),
    (0, swagger_1.ApiBody)({ type: dtos_1.userSignInDto }),
    (0, swagger_1.ApiOperation)({ summary: 'SignIn for old users.' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.userSignInDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signIn", null);
__decorate([
    (0, common_1.Post)('signUp'),
    (0, common_1.UseInterceptors)((0, aws_uploading_1.multerUserLogic)()),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'SignUp for new users.' }),
    (0, swagger_1.ApiBody)({
        description: 'User sign up data including file uploads',
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', format: 'email' },
                password: { type: 'string' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                username: { type: 'string' },
                gender: { type: 'string', enum: ['MALE', 'FEMALE', 'OTHER'] },
                categories: {
                    type: 'array',
                    items: { type: 'string' },
                },
                description: { type: 'string' },
                socialAccounts: { type: 'object' },
                cv: { type: 'string', format: 'binary' },
                profilePicture: { type: 'string', format: 'binary' },
            },
            required: [
                'email',
                'password',
                'firstName',
                'lastName',
                'username',
                'gender',
            ],
        },
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.userSignUpDto, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signUp", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map