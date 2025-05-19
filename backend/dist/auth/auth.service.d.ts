import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { userSignUpDto, userSignInDto } from './dtos';
export declare class AuthService {
    private jwtService;
    private userService;
    private prisma;
    constructor(jwtService: JwtService, userService: UserService, prisma: PrismaService);
    signIn(signInDto: userSignInDto): Promise<any>;
    signup(signUpDto: userSignUpDto, profilePictureUrl?: any, cvUrl?: any): Promise<any>;
}
