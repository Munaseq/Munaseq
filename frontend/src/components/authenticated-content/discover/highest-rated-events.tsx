import getEventsAction from "@/proxy/event/get-events-action";
import { EventDataDto } from "@/dtos/event-data.dto";
import EventList from "./event-list";

export default async function HighestRatedEvents() {
    let eventList: EventDataDto[] = await getEventsAction({
        highestRated: true,
    });
    if (!eventList || eventList.length === 0) {
        return (
            <div className="mt-5 text-custom-gray">
                لا يوجد فعاليات من منسفين اعلى من 4.5 نجوم
            </div>
        );
    }
    eventList = eventList.filter(
        event => (event.eventCreator.rating as number) > 4.5
    );
    return (
        <EventList events={eventList}/>
    );
}
