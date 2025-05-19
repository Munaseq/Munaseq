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
exports.UpdateQuizDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const update_question_dto_1 = require("./update-question.dto");
const class_transformer_1 = require("class-transformer");
class UpdateQuizDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { startDate: { required: false, type: () => Date }, endDate: { required: false, type: () => Date }, quizTitle: { required: false, type: () => String }, timeLimit: { required: false, type: () => Number }, questions: { required: false, type: () => [require("./update-question.dto").UpdateQuestionDto] } };
    }
}
exports.UpdateQuizDto = UpdateQuizDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        const localDate = new Date(value);
        const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
        return utcDate;
    }),
    __metadata("design:type", Date)
], UpdateQuizDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        const localDate = new Date(value);
        const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
        return utcDate;
    }),
    __metadata("design:type", Date)
], UpdateQuizDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateQuizDto.prototype, "quizTitle", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateQuizDto.prototype, "timeLimit", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => update_question_dto_1.UpdateQuestionDto),
    __metadata("design:type", Array)
], UpdateQuizDto.prototype, "questions", void 0);
//# sourceMappingURL=update-quiz.dto.js.map