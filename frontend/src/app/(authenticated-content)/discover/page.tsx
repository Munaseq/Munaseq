import Subtitle from "@/components/common/text/subtitle";
import Title from "@/components/common/text/title";
import Image from "next/image";
import { Metadata } from "next";
import SmallCard from "@/components/common/cards/small-card";
import getDate from "@/util/get-date";

import getEventsAction from "@/proxy/event/get-events-action";
import { SparklesIcon } from "lucide-react";
import { EventDataDto } from "@/dtos/event-data.dto";

export const metadata: Metadata = {
    title: "اكتشف",
};

export default async function Discover() {
    const eventList:EventDataDto[] = await getEventsAction();
    
    if (eventList?.length === 0) {
        return (
            <div className="mt-5 text-custom-gray">
                لا يوجد فعاليات
            </div>
        );
    }
    return (
        <div>
            <Title>
                <SparklesIcon size={32} color="var(--custom-light-purple)"/>
                اكتشف فعاليات المنسقين
            </Title>
            <Subtitle>من أعلى المنسقين تقييما </Subtitle>
            <div className="flex mt-4 gap-8 flex-wrap lg:justify-start justify-center">
                {eventList?.map((event: EventDataDto) => (
                    <SmallCard
                        key={event.id}
                        image={event.imageUrl}
                        title={event.title}
                        date={getDate(event.startDateTime)}
                        eventCreator={event.eventCreator}
                        eventId={event.id}
                        badges={event.categories}
                    />
                ))}
            </div>
        </div>
    );
}
