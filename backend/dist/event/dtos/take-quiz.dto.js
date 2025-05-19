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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TakeQuizDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class TakeQuizDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { answers: { required: true, type: () => [String] }, quizId: { required: true, type: () => String, format: "uuid" }, userId: { required: true, type: () => String, format: "uuid" } };
    }
}
exports.TakeQuizDto = TakeQuizDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)({ each: true }),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], TakeQuizDto.prototype, "answers", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], TakeQuizDto.prototype, "quizId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], TakeQuizDto.prototype, "userId", void 0);
//# sourceMappingURL=take-quiz.dto.js.map