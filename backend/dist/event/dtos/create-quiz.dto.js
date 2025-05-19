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
exports.CreateQuizDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const create_question_dto_1 = require("./create-question.dto");
class CreateQuizDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { quizTitle: { required: true, type: () => String }, startDate: { required: true, type: () => Date }, endDate: { required: true, type: () => Date }, timeLimit: { required: true, type: () => Number }, questions: { required: true, type: () => [require("./create-question.dto").QuizQuestionDto] } };
    }
}
exports.CreateQuizDto = CreateQuizDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuizDto.prototype, "quizTitle", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        const localDate = new Date(value);
        const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
        return utcDate;
    }),
    __metadata("design:type", Date)
], CreateQuizDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        const localDate = new Date(value);
        const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
        return utcDate;
    }),
    __metadata("design:type", Date)
], CreateQuizDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateQuizDto.prototype, "timeLimit", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)({ each: true }),
    (0, class_transformer_1.Type)(() => create_question_dto_1.QuizQuestionDto),
    __metadata("design:type", Array)
], CreateQuizDto.prototype, "questions", void 0);
//# sourceMappingURL=create-quiz.dto.js.map