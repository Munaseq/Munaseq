import { Gender } from '@prisma/client';
export declare class UpdateEventDto {
    title?: string;
    description?: string;
    categories?: string[];
    location?: string;
    startDateTime?: Date;
    endDateTime?: Date;
    seatCapacity?: number;
    isOnline?: boolean;
    isPublic?: boolean;
    gender?: Gender;
}
