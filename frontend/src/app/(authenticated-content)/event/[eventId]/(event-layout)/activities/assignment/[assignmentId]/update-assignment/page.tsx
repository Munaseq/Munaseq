import React from "react";
import UpdateAssignmentForm from "@/components/authenticated-content/event/event-layout/update-assignment-form";
import showAssignmentAction from "@/proxy/assignments/show-assignment-action";

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

export default async function UpdateAssignment({
  params,
}: {
  params: { eventId: any; assignmentId: string };
}) {
  const assignment: any = await showAssignmentAction(params.assignmentId);

  return (
    <UpdateAssignmentForm assignment={assignment} eventId={params.eventId} />
  );
}
