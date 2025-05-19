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
exports.UpdateEventDto = void 0;
const openapi = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class UpdateEventDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: false, type: () => String }, description: { required: false, type: () => String }, categories: { required: false, type: () => [String] }, location: { required: false, type: () => String }, startDateTime: { required: false, type: () => Date }, endDateTime: { required: false, type: () => Date }, seatCapacity: { required: false, type: () => Number }, isOnline: { required: false, type: () => Boolean }, isPublic: { required: false, type: () => Boolean }, gender: { required: false, type: () => Object } };
    }
}
exports.UpdateEventDto = UpdateEventDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEventDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEventDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Transform)(({ value }) => (Array.isArray(value) ? value : [value])),
    __metadata("design:type", Array)
], UpdateEventDto.prototype, "categories", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEventDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        const localDate = new Date(value);
        const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
        return utcDate;
    }),
    __metadata("design:type", Date)
], UpdateEventDto.prototype, "startDateTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        const localDate = new Date(value);
        const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
        return utcDate;
    }),
    __metadata("design:type", Date)
], UpdateEventDto.prototype, "endDateTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value, 10)),
    __metadata("design:type", Number)
], UpdateEventDto.prototype, "seatCapacity", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'boolean')
            return value;
        if (typeof value === 'string')
            return value.toLowerCase() === 'true';
        if (typeof value === 'number')
            return value === 1;
        return false;
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateEventDto.prototype, "isOnline", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'boolean')
            return value;
        if (typeof value === 'string')
            return value.toLowerCase() === 'true';
        if (typeof value === 'number')
            return value === 1;
        return false;
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateEventDto.prototype, "isPublic", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.Gender),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateEventDto.prototype, "gender", void 0);
//# sourceMappingURL=update-event.dto.js.map