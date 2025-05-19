import Subtitle from "@/components/common/text/subtitle";
import Title from "@/components/common/text/title";
import { Metadata } from "next";
import { Rss, SparklesIcon } from "lucide-react";
import AnnouncementsPage from "@/components/authenticated-content/announcements/page";
import { Suspense } from "react";
import LogoLoading from "@/components/common/logo-loading";
import { get } from "http";
import getAnnouncementAction from "@/proxy/announcements/get-announcement-action";

export const metadata: Metadata = {
  title: "الاخبار",
};

export default async function announcements() {
  let announcements: any = await getAnnouncementAction();
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
        <AnnouncementsPage announcements={announcements} />
      </Suspense>
    </div>
  );
}
