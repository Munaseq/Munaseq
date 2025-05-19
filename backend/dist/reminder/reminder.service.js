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
var ReminderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReminderService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
const aws_uploading_1 = require("../utils/aws.uploading");
let ReminderService = ReminderService_1 = class ReminderService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(ReminderService_1.name);
    }
    async handleCron() {
        const currentDate = new Date();
        currentDate.setUTCHours(0, 0, 0, 0);
        const nextDate = new Date(currentDate);
        nextDate.setUTCDate(currentDate.getUTCDate() + 1);
        nextDate.setUTCHours(0, 0, 0, 0);
        const reminders = await this.prisma.reminder.findMany({
            where: {
                reminderDate: {
                    gte: currentDate,
                    lt: nextDate,
                },
            },
            include: {
                User: {
                    select: {
                        firstName: true,
                        email: true,
                    },
                },
                Event: {
                    select: {
                        id: true,
                        title: true,
                        startDateTime: true,
                        eventCreator: { select: { email: true } },
                    },
                },
            },
        });
        reminders.forEach(async (reminder) => {
            const firstName = reminder.User.firstName;
            const eventTitle = reminder.Event.title;
            const userEmail = reminder.User.email;
            const startDate = reminder.Event.startDateTime.toLocaleDateString('en-CA', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
            });
            const eventCreatorEmail = reminder.Event.eventCreator.email;
            await (0, aws_uploading_1.sendEmailSendGrid)(firstName, startDate, eventTitle, reminder.Event.id, userEmail, eventCreatorEmail);
        });
    }
};
exports.ReminderService = ReminderService;
__decorate([
    (0, schedule_1.Cron)('00 00 12 * * *', { timeZone: 'Asia/Riyadh' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReminderService.prototype, "handleCron", null);
exports.ReminderService = ReminderService = ReminderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReminderService);
//# sourceMappingURL=reminder.service.js.map