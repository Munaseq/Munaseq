"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const user_module_1 = require("./user/user.module");
const event_module_1 = require("./event/event.module");
const user_controller_1 = require("./user/user.controller");
const event_controller_1 = require("./event/event.controller");
const user_service_1 = require("./user/user.service");
const event_service_1 = require("./event/event.service");
const auth_module_1 = require("./auth/auth.module");
const config_1 = require("@nestjs/config");
const chat_module_1 = require("./chat/chat.module");
const schedule_1 = require("@nestjs/schedule");
const reminder_module_1 = require("./reminder/reminder.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            schedule_1.ScheduleModule.forRoot(),
            user_module_1.UserModule,
            event_module_1.EventModule,
            auth_module_1.AuthModule,
            chat_module_1.ChatModule,
            reminder_module_1.ReminderModule,
        ],
        controllers: [app_controller_1.AppController, user_controller_1.UserController, event_controller_1.EventController],
        providers: [app_service_1.AppService, user_service_1.UserService, event_service_1.EventService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map