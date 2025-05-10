import React from "react";
import Quiz from "@/components/authenticated-content/event/event-layout/submit-quiz";
import showQuizAction from "@/proxy/quizzes/show-quiz-action";

export default async function SubmitQuiz({
  params,
}: {
  params: { eventId: string; quizId: string };
}) {
  const quiz: any = await showQuizAction(params.quizId);

  const questions: any[] = quiz.questions.map((question: any) => ({
    text: question.text,
    questionType: question.questionType,
    options: question.options,
  }));


  return (
    <Quiz
      questions={questions}
      time={quiz.timeLimit}
      quizId={params.quizId}
      eventId={params.eventId}
    />
  );
}
