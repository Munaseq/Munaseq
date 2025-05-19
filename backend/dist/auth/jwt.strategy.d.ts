import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private userService;
    private configService;
    constructor(userService: UserService, configService: ConfigService);
    validate(payload: any): Promise<{
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
}
export {};
