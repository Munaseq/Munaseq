import { EventDataDto } from "@/dtos/event-data.dto";
import EventList from "./event-list";
import getRecommendedEvents from "@/proxy/event/get-recommended-events";

export default async function RecommendedEvents() {
    let eventList: EventDataDto[] = await getRecommendedEvents();
    
    if (eventList?.length === 0) {
        return (
            <>
                <div className="mt-4 text-custom-gray">
                    لا يوجد فعاليات مقترحة
                </div>
            </>
        );
    }
    return (
        
        <EventList events={eventList}/>
    );
}
