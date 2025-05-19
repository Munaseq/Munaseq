import { QuestionType } from '@prisma/client';
export declare class UpdateAssignmentQuestionDTO {
    text?: string;
    questionType?: QuestionType;
    options?: object;
    correctAnswer?: string;
}
