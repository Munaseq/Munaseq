import { Gender } from '@prisma/client';
export declare class CreateEventDto {
    title: string;
    description?: string;
    categories?: string[];
    location?: string;
    seatCapacity: number;
    gender: Gender;
    isOnline?: boolean;
    isPublic?: boolean;
    startDateTime: Date;
    endDateTime: Date;
}
