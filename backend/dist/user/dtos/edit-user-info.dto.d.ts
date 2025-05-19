import { Gender } from '@prisma/client';
export declare class EditUserInfoDto {
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    gender?: Gender;
    categories?: string[];
    description?: string;
    socialAccounts?: object;
}
