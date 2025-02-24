
import presentIcon from "@/assets/icons/presenter.svg";
import EventsLayout, { EventType } from "@/components/authenticated-content/event-lists/events-layout";
import getPresentedEvents from "@/proxy/event/get-presented-events-action";

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
            eventIcon={presentIcon}
            eventData={eventList}
        >
            {children}
        </EventsLayout>
    );
}
