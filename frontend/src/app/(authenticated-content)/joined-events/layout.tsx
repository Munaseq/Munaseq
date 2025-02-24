import joinIcon from "@/assets/icons/join-active.svg";
import EventsLayout, { EventType } from "@/components/authenticated-content/event-lists/events-layout";
import getJoinedUserEventsAction from "@/proxy/event/get-joined-events-action";

export default async function JoinedEvents({
    children,
}: {
    children: React.ReactNode;
}) {
    const eventList = await getJoinedUserEventsAction();
    return (
        <EventsLayout
            eventType={EventType.JOINED}
            eventString="الفعاليات التي انضممت إليها"
            eventIcon={joinIcon}
            eventData={eventList}
        >
            {children}
        </EventsLayout>
    );
}
