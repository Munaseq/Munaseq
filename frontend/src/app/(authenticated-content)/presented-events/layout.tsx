
import EventsLayout, { EventType } from "@/components/authenticated-content/event-lists/events-layout";
import getPresentedEvents from "@/proxy/event/get-presented-events-action";
import { MicIcon } from "lucide-react";

export default async function PresentedEvents({
    children,
}: {
    children: React.ReactNode;
}) {
    const eventList = await getPresentedEvents();
    return (
        <EventsLayout
            eventType={EventType.PRESENTED}
            eventString="الفعاليات التي قدمتها"
            eventIcon={<MicIcon className="text-custom-light-purple" size={32}/>}
            eventData={eventList}
        >
            {children}
        </EventsLayout>
    );
}
