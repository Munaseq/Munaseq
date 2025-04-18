import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import isEventPresenterAction from "@/proxy/user/is-event-presenter-action";
import getProfileAction from "@/proxy/user/get-profile-action";
import { UserDataDto } from "@/dtos/user-data.dto";
import Activities from "@/components/authenticated-content/event/event-layout/activities";

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

  return <Activities eventId={params.eventId} isPresenter={isPresenter} />;
}
