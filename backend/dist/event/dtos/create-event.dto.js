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
exports.CreateEventDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class CreateEventDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String }, description: { required: false, type: () => String }, categories: { required: false, type: () => [String] }, location: { required: false, type: () => String }, seatCapacity: { required: true, type: () => Number }, gender: { required: true, type: () => Object }, isOnline: { required: false, type: () => Boolean }, isPublic: { required: false, type: () => Boolean }, startDateTime: { required: true, type: () => Date }, endDateTime: { required: true, type: () => Date } };
    }
}
exports.CreateEventDto = CreateEventDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (Array.isArray(value) ? value : [value])),
    __metadata("design:type", Array)
], CreateEventDto.prototype, "categories", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "location", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateEventDto.prototype, "seatCapacity", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.Gender),
    __metadata("design:type", String)
], CreateEventDto.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === 'true')
            return true;
        if (value === 'false')
            return false;
        return value;
    }),
    __metadata("design:type", Boolean)
], CreateEventDto.prototype, "isOnline", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === 'true')
            return true;
        if (value === 'false')
            return false;
        return value;
    }),
    __metadata("design:type", Boolean)
], CreateEventDto.prototype, "isPublic", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        const localDate = new Date(value);
        const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
        return utcDate;
    }),
    __metadata("design:type", Date)
], CreateEventDto.prototype, "startDateTime", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        const localDate = new Date(value);
        const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
        return utcDate;
    }),
    __metadata("design:type", Date)
], CreateEventDto.prototype, "endDateTime", void 0);
//# sourceMappingURL=create-event.dto.js.map