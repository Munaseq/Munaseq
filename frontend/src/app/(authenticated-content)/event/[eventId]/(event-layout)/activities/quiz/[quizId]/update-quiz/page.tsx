import React from "react";
import UpdateQuizForm from "@/components/authenticated-content/event/event-layout/update-quiz-form";

type Quiz = {
  id: string;
  state: "NotSubmitted" | "Submitted" | "Finished";
  endDate: string;
  startDate: string;
  timeLimit: number;
  questions: {
    text: string;
    questionType: string;
    options: string[];
    correctAnswer: string;
  }[];
};

const quiz: Quiz = {
  id: "1",
  state: "Submitted",
  endDate: "2025-10-10",
  startDate: "2025-10-01",
  timeLimit: 10,
  questions: [
    {
      text: "What is the capital of Egypt?",
      questionType: "multiple-choice",
      options: ["Cairo", "Alexandria", "Giza", "Luxor"],

      correctAnswer: "Cairo",
    },
  ],
};

export default function UpdateQuiz(params: {
  eventId: string;
  quizId: string;
}) {
  // const assignment:Assignment = getAssignmentId();
  return <UpdateQuizForm quiz={quiz} />;
}
