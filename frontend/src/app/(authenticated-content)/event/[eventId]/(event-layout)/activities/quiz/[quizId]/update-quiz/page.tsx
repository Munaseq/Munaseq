import React from "react";
import UpdateQuizForm from "@/components/authenticated-content/event/event-layout/update-quiz-form";
import showQuizAction from "@/proxy/quizzes/show-quiz-action";

export default async function UpdateQuiz({
  params,
}: {
  params: { eventId: any; quizId: string };
}) {
  // const assignment:Assignment = getAssignmentId();
  const quiz: any = await showQuizAction(params.quizId);


  return <UpdateQuizForm quiz={quiz} eventId={params.eventId} />;
}
