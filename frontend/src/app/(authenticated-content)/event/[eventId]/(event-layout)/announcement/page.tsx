import Subtitle from "@/components/common/text/subtitle";
import Title from "@/components/common/text/title";
import { Metadata } from "next";
import { Rss, SparklesIcon } from "lucide-react";
import AnnouncementsPage from "@/components/authenticated-content/announcements/page";
import { Suspense } from "react";
import LogoLoading from "@/components/common/logo-loading";
import { get } from "http";
import getAnnouncementAction from "@/proxy/announcements/get-announcement-action";
import getEventAnnouncementAction from "@/proxy/announcements/get-event-announcement-action";
import EventAnnouncementsPage from "@/components/authenticated-content/event/event-layout/event-announcement";
import { UserDataDto } from "@/dtos/user-data.dto";
import getProfileAction from "@/proxy/user/get-profile-action";
import isEventPresenterAction from "@/proxy/user/is-event-presenter-action";

export default async function eventAnnouncements({
  params,
}: {
  params: { eventId: string };
}) {
  const loggedUser: UserDataDto = await getProfileAction();
  const isPresenter: boolean = await isEventPresenterAction(
    params.eventId,
    loggedUser.username
  );
  let announcements: any = await getEventAnnouncementAction(params.eventId);
  if (announcements === undefined) {
    announcements = [];
  }
  return (
    <div>
      <Title>
        <Rss size={32} color="var(--custom-light-purple)" />
        اخر الاخبار
      </Title>

      <Suspense
        fallback={
          <div className="grid place-items-center w-full">
            <LogoLoading className="w-20 aspect-square" />
          </div>
        }
      >
        <EventAnnouncementsPage
          announcements={announcements}
          eventId={params.eventId}
          isPresenter={isPresenter}
        />
      </Suspense>
    </div>
  );
}
