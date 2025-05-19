import { PrismaService } from 'src/prisma/prisma.service';
export declare class ReminderService {
    private prisma;
    constructor(prisma: PrismaService);
    private readonly logger;
    handleCron(): Promise<void>;
}
