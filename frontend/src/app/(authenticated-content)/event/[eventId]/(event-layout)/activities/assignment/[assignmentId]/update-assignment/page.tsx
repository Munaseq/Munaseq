import React from "react";
import UpdateAssignmentForm from "@/components/authenticated-content/event/event-layout/update-assignment-form";

type Assignment = {
  id: string;
  state: "NotSubmitted" | "Submitted" | "Finished";
  endDate: string;
  startDate: string;
  questions: {
    text: string;
    questionType: string;
    options: string[];
    correctAnswer: string;
  }[];
};

const assignment: Assignment = {
  id: "1",
  state: "NotSubmitted",
  endDate: "2025-10-10",
  startDate: "2025-10-01",
  questions: [
    {
      text: "What is the capital of Egypt?",
      questionType: "multiple-choice",
      options: ["Cairo", "Alexandria", "Giza", "Luxor"],
      correctAnswer: "Cairo",
    },
  ],
};
export default function UpdateAssignment({}: {
  params: { eventId: string; assignmentId: string };
}) {
  // const assignment:Assignment = getAssignmentId();

  return <UpdateAssignmentForm assignment={assignment} />;
}
