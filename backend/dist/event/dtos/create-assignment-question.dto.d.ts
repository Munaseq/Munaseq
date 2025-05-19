import { QuestionType } from '@prisma/client';
export declare class AssignmentQuestionDTO {
    text: string;
    questionType: QuestionType;
    options?: object;
    correctAnswer?: string;
}
