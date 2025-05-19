import { UpdateQuestionDto } from './update-question.dto';
export declare class UpdateQuizDto {
    startDate?: Date;
    endDate?: Date;
    quizTitle?: string;
    timeLimit?: number;
    questions?: UpdateQuestionDto[];
}
