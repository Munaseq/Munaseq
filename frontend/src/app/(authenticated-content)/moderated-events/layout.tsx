import EventsLayout, { EventType } from "@/components/authenticated-content/event-lists/events-layout";
import getModeratedEvents from "@/proxy/event/get-moderated-events-action";
import { PencilRulerIcon } from "lucide-react";

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
            eventIcon={<PencilRulerIcon className="text-custom-light-purple" size={32} />}
            eventData={eventList}
        >
            {children}
        </EventsLayout>
    );
}
