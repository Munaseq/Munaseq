import Title from "@/components/common/text/title";
import { Metadata } from "next";
import { SparklesIcon, TagsIcon } from "lucide-react";
import HighestRatedEvents from "@/components/authenticated-content/discover/highest-rated-events";
import PreferredCategoriesEvents from "@/components/authenticated-content/discover/preferred-categories-events";
import EventListSection from "@/components/authenticated-content/discover/event-list-section";
import LogoLoading from "@/components/common/logo-loading";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "اكتشف",
};

export default function Discover() {
    return (
        <div>
            <Title>
                <SparklesIcon size={32} color="var(--custom-light-purple)" />
                اكتشف فعاليات المنسقين
            </Title>
            <EventListSection message="فعاليات منسقين اعلى من 4.5 نجوم">
                <HighestRatedEvents />
            </EventListSection>
            <Title>
                <TagsIcon size={32} color="var(--custom-light-purple)" />
                من فئاتك المفضلة
            </Title>
            <Suspense
                fallback={
                    <div className="grid place-items-center w-full">
                        <LogoLoading className="w-20 aspect-square" />
                    </div>
                }
            >
                <PreferredCategoriesEvents />
            </Suspense>
        </div>
    );
}
