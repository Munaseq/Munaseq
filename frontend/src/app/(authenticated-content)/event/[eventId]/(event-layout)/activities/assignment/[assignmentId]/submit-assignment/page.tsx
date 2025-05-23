import React from "react";
import Assignment from "@/components/authenticated-content/event/event-layout/submit-assignment";
import { get } from "http";
import getAssignmentAction from "@/proxy/assignments/get-assignments-action";
import showAssignmentAction from "@/proxy/assignments/show-assignment-action";

type Assignment = {
  id: string;
  state: "NotSubmitted" | "Submitted" | "Finished";
  endDate: string;
  startDate: string;
  questions: {
    text: string;
    questionType: "multiple-choice" | "essay";
    options: string[];
    correctAnswer: string;
  }[];
};

// const assignment: Assignment = {
//   id: "1",
//   state: "NotSubmitted",
//   endDate: "2025-10-10",
//   startDate: "2025-10-01",
//   questions: [
//     {
//       text: "What is the capital of Egypt?",
//       questionType: "multiple-choice",
//       options: ["Cairo", "Alexandria", "Giza", "Luxor"],
//       correctAnswer: "Cairo",
//     },
//     {
//       text: "What is the capital of Egypt?",
//       questionType: "essay",
//       options: [],
//       correctAnswer: "Cairo",
//     },
//   ],
// };

type Question = {
  text: string;
  questionType: "multiple-choice" | "essay";
  options?: string[];
};

export default async function SubmitAssignment({
  params,
}: {
  params: { eventId: string; assignmentId: string };
}) {
  const assignment: any = await showAssignmentAction(params.assignmentId);

  const questions: any[] = assignment.questions.map((question: any) => ({
    text: question.text,
    questionType: question.questionType,
    options: question.options,
  }));

  return (
    <Assignment
      questions={questions}
      assignmentId={params.assignmentId}
      eventId={params.eventId}
    />
  );
}
