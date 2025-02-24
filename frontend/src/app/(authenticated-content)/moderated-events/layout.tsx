
import modeIcon from "@/assets/icons/moderator.svg";
import EventsLayout, { EventType } from "@/components/authenticated-content/event-lists/events-layout";
import getModeratedEvents from "@/proxy/event/get-moderated-events-action";

export default async function ModeratedEvents({
    children,
}: {
    children: React.ReactNode;
}) {
    const eventList = await getModeratedEvents();
    return (
        <EventsLayout
            eventType={EventType.MODERATED}
            eventString="الفعاليات التي نظمتها"
            eventIcon={modeIcon}
            eventData={eventList}
        >
            {children}
        </EventsLayout>
    );
}
