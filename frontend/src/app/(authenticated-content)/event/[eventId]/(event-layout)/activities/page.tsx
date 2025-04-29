import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import isEventPresenterAction from "@/proxy/user/is-event-presenter-action";
import getProfileAction from "@/proxy/user/get-profile-action";
import { UserDataDto } from "@/dtos/user-data.dto";
import Activities from "@/components/authenticated-content/event/event-layout/activities";
import { get } from "http";
import getAssignmentAction from "@/proxy/assignments/get-assignments-action";
import getQuizAction from "@/proxy/quizzes/get-quiz-action";

export default async function ActivitiesPage({
  params,
}: {
  params: { eventId: string };
}) {
  const cookiesStore = cookies();
  const token = cookiesStore.get("token");

  if (!token) {
    redirect("/signin");
  }

  const loggedUser: UserDataDto = await getProfileAction();
  const isPresenter: boolean = await isEventPresenterAction(
    params.eventId,
    loggedUser.username
  );
  let assignments: any = await getAssignmentAction(params.eventId);
  if (assignments === undefined) {
    assignments = [];
  }

  let quizzes: any = await getQuizAction(params.eventId);
  if (quizzes === undefined) {
    quizzes = [];
  }

  return (
    <Activities
      eventId={params.eventId}
      isPresenter={isPresenter}
      assignments={assignments}
      quizzes={quizzes}
    />
  );
}
