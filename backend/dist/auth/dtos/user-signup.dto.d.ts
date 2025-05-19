import { Gender } from '@prisma/client';
export declare class userSignUpDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username: string;
    gender: Gender;
    categories?: string[];
    description?: string;
    socialAccounts?: object;
}
