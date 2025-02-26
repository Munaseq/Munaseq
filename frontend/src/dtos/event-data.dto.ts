import { UserDataDto } from "./user-data.dto";

export interface EventDataDto {
    id: string;
    title: string;
    description?: string;
    categories: string[];
    location?: string;
    seatCapacity: number;
    isPublic?: boolean;
    isOnline?: boolean;
    gender: string;
    startDateTime: string;
    endDateTime: string;
    imageUrl: string;
    price?: number;
    eventCreator: UserDataDto;
}
