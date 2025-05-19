import { CalendarDaysIcon } from "lucide-react"; 
import GetUserEventsAction from "@/proxy/user/get-user-events-action";
import EventsLayout from "@/components/authenticated-content/event-lists/events-layout";
import { EventType } from "@/components/authenticated-content/event-lists/events-layout";

export default async function CoordinatedEvents({
    children,
}: {
    children: React.ReactNode;
}) {
    const eventList = await GetUserEventsAction();
    return (
        <EventsLayout
            eventType={EventType.COORDINATED}
            eventString="الفعاليات التي نسقتها"
            eventIcon={<CalendarDaysIcon size={32} color="#AE00FE"/>}
            eventData={eventList}
        >
            {children}
        </EventsLayout>
    );
}
