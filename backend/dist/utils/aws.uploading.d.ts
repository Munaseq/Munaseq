export declare function multerEventLogic(): import("@nestjs/common").Type<import("@nestjs/common").NestInterceptor<any, any>>;
export declare function multerUserLogic(): import("@nestjs/common").Type<import("@nestjs/common").NestInterceptor<any, any>>;
export declare function multerMaterialtLogic(): import("@nestjs/common").Type<import("@nestjs/common").NestInterceptor<any, any>>;
export declare function uploadCertificate(pdfBytes: Uint8Array, certifId: string): Promise<string>;
export declare function sendEmailSendGrid(firstName: string, startEventDate: string, eventTitle: string, userEmail: string, eventCreatorEmail: string): Promise<string>;
