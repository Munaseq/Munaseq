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
exports.UpdateQuestionDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class UpdateQuestionDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { text: { required: false, type: () => String }, questionType: { required: false, type: () => Object }, options: { required: false, type: () => Object }, correctAnswer: { required: false, type: () => String } };
    }
}
exports.UpdateQuestionDto = UpdateQuestionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateQuestionDto.prototype, "text", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.QuestionType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateQuestionDto.prototype, "questionType", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateQuestionDto.prototype, "options", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateQuestionDto.prototype, "correctAnswer", void 0);
//# sourceMappingURL=update-question.dto.js.map