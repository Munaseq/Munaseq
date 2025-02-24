import calenderIcon from "@/assets/icons/calender-active.svg";
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
            eventIcon={calenderIcon}
            eventData={eventList}
        >
            {children}
        </EventsLayout>
    );
}
