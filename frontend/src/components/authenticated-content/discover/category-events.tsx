import SmallCard from "@/components/common/cards/small-card";
import getDate from "@/util/get-date";
import getEventsAction from "@/proxy/event/get-events-action";
import { EventDataDto } from "@/dtos/event-data.dto";
import EventList from "./event-list";

export default async function CategoryEvents({
    category,
}: {
    category: string;
}) {
    const eventList: EventDataDto[] = await getEventsAction({
        pageSize: 3,
        highestRated: true,
        category: category,
    });

    if (eventList?.length === 0) {
        return (
            <div className="mt-4 text-custom-gray">
                لا يوجد فعاليات من فئة {category}
            </div>
        );
    }

    return <EventList events={eventList} />;
}
