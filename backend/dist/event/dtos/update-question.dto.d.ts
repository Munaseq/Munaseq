import { QuestionType } from '@prisma/client';
export declare class UpdateQuestionDto {
    text?: string;
    questionType?: QuestionType;
    options?: object;
    correctAnswer?: string;
}
