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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const argon2 = require("argon2");
const user_service_1 = require("../user/user.service");
const prisma_service_1 = require("../prisma/prisma.service");
const dtos_1 = require("./dtos");
let AuthService = class AuthService {
    constructor(jwtService, userService, prisma) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.prisma = prisma;
    }
    async signIn(signInDto) {
        if (signInDto.email) {
            signInDto.email = signInDto.email.toLowerCase();
        }
        if (signInDto.username) {
            signInDto.username = signInDto.username.toLowerCase();
        }
        let user;
        if (signInDto.email) {
            user = await this.userService.findByEmail(signInDto.email);
        }
        else if (signInDto.username) {
            user = await this.userService.findByUsername(signInDto.username);
        }
        else {
            throw new common_1.UnauthorizedException('You must provide either an email or username');
        }
        if (!user || !(await argon2.verify(user.password, signInDto.password))) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = { sub: user.id };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
    async signup(signUpDto, profilePictureUrl, cvUrl) {
        signUpDto.email = signUpDto.email.toLowerCase();
        signUpDto.username = signUpDto.username.toLowerCase();
        const existingEmailUser = await this.prisma.user.findUnique({
            where: { email: signUpDto.email },
        });
        if (existingEmailUser) {
            throw new common_1.HttpException('This email is already in use', common_1.HttpStatus.CONFLICT);
        }
        const existingUsernameUser = await this.prisma.user.findUnique({
            where: { username: signUpDto.username },
        });
        if (existingUsernameUser) {
            throw new common_1.HttpException('This username is already in use', common_1.HttpStatus.CONFLICT);
        }
        signUpDto.categories = Array.isArray(signUpDto.categories)
            ? signUpDto.categories
            : [signUpDto.categories];
        const hash = await argon2.hash(signUpDto.password);
        const user = await this.prisma.user.create({
            data: {
                email: signUpDto.email,
                password: hash,
                firstName: signUpDto.firstName,
                lastName: signUpDto.lastName,
                username: signUpDto.username,
                gender: signUpDto.gender,
                categories: signUpDto.categories,
                description: signUpDto.description,
                profilePictureUrl: profilePictureUrl,
                cvUrl: cvUrl,
                socialAccounts: signUpDto.socialAccounts,
            },
        });
        const signInDto = new dtos_1.userSignInDto();
        signInDto.email = signUpDto.email;
        signInDto.password = signUpDto.password;
        signInDto.username = signUpDto.username;
        return { ...(await this.signIn(signInDto)), ...user };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        user_service_1.UserService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map