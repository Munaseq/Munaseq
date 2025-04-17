import { UserDataDto } from "./user-data.dto";

export type RoleDataDto = {
    user: UserDataDto;
    role: string;
};

export enum Role {
    MODERATOR = "moderators",
    PRESENTER = "presenters",
}
