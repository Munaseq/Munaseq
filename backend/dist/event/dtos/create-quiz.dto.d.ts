import { QuizQuestionDto } from './create-question.dto';
export declare class CreateQuizDto {
    quizTitle: string;
    startDate: Date;
    endDate: Date;
    timeLimit: number;
    questions: QuizQuestionDto[];
}
