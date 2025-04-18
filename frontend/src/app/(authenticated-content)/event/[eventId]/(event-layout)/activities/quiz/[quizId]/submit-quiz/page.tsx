import React from "react";
import Quiz from "@/components/authenticated-content/event/event-layout/submit-quiz";

type Quiz = {
  id: string;
  state: "NotSubmitted" | "Submitted" | "Finished";
  timelimit: number;
  endDate: string;
  startDate: string;
  questions: {
    text: string;
    questionType: "multiple-choice" | "essay";
    options: string[];
    correctAnswer: string;
  }[];
};

const quiz: Quiz = {
  id: "1",
  state: "NotSubmitted",
  timelimit: 10,
  endDate: "2025-10-10",
  startDate: "2025-10-01",
  questions: [
    {
      text: "What is the capital of Egypt?",
      questionType: "multiple-choice",
      options: ["Cairo", "Alexandria", "Giza", "Luxor"],
      correctAnswer: "Cairo",
    },
    {
      text: "What is the capital of Egypt?",
      questionType: "essay",
      options: [],
      correctAnswer: "Cairo",
    },
  ],
};

type Question = {
  text: string;
  questionType: "multiple-choice" | "essay";
  options?: string[];
};

export default function SubmitQuiz({
  params,
}: {
  params: { eventId: string; quizId: string };
}) {
  const questions: any[] = quiz.questions.map((question) => ({
    text: question.text,
    questionType: question.questionType,
    options: question.options,
  }));

  return <Quiz questions={questions} time={quiz.timelimit} />;
}
