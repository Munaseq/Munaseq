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
exports.Answer = exports.TakeAssigmentDTO = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class TakeAssigmentDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { answers: { required: true, type: () => [require("./take-assignment.dto").Answer] } };
    }
}
exports.TakeAssigmentDTO = TakeAssigmentDTO;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => (Array.isArray(value) ? value : [value])),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => Answer),
    __metadata("design:type", Array)
], TakeAssigmentDTO.prototype, "answers", void 0);
class Answer {
    static _OPENAPI_METADATA_FACTORY() {
        return { questionTitle: { required: true, type: () => String }, answer: { required: true, type: () => String } };
    }
}
exports.Answer = Answer;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Answer.prototype, "questionTitle", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Answer.prototype, "answer", void 0);
//# sourceMappingURL=take-assignment.dto.js.map