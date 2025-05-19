import EventsLayout, { EventType } from "@/components/authenticated-content/event-lists/events-layout";
import getJoinedUserEventsAction from "@/proxy/event/get-joined-events-action";
import { LogInIcon } from "lucide-react";

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
            eventIcon={<LogInIcon size={32} className="text-custom-light-purple"/>}
            eventData={eventList}
        >
            {children}
        </EventsLayout>
    );
}
