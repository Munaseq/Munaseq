import showQuizAction from "@/proxy/quizzes/show-quiz-action";
import React from "react";
import QuizResult from "@/components/authenticated-content/event/event-layout/show-quiz-result";

export default async function showAssignmentResult({
  params,
}: {
  params: { eventId: string; quizId: string };
}) {
  const result: any = await showQuizAction(params.quizId);

  return <QuizResult result={result} />;
}
