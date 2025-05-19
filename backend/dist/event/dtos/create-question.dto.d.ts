import { QuestionType } from '@prisma/client';
export declare class QuizQuestionDto {
    text: string;
    questionType: QuestionType;
    options: object;
    correctAnswer: string;
}
