import SmallCard from "@/components/common/cards/small-card";
import { EventDataDto } from "@/dtos/event-data.dto";
import getDate from "@/util/get-date";

export default function EventList({events}: {events: EventDataDto[]}) {
return (
    <div className="flex mt-4 gap-8 flex-wrap lg:justify-start justify-center">
                {events?.map((event: EventDataDto) => (
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
)
}