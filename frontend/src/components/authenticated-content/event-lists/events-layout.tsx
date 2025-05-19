import Subtitle from "@/components/common/text/subtitle";
import Link from "next/link";
import TabIndicator from "@/components/common/tab-indicator";
import SelectEvents from "@/components/authenticated-content/event-lists/select-events";
import Title from "@/components/common/text/title";
import { EventProvider } from "@/store/event-context";
import StoreEventData from "@/components/authenticated-content/event-lists/store-event-data";

export enum EventType {
    COORDINATED = "coordinated",
    JOINED = "joined",
    MODERATED = "moderated",
    PRESENTED = "presented",
}


export default async function EventsLayout({
    children,
    eventType,
    eventString,
    eventIcon,
    eventData
}: {
    children: React.ReactNode;
    eventType: string;
    eventString: string;
    eventIcon: React.ReactElement;
    eventData: any;
}) {
    
    return (
        <>
            <Title>
                {eventIcon}
                {eventString}
            </Title>
            <Subtitle>
                <div className="gap-8 sm:flex hidden mt-8">
                    <Link
                        href={`/${eventType}-events/active`}
                        className="relative text-nowrap"
                    >
                        الفعاليات الحالية
                        <TabIndicator
                            layoutId={`active-${eventType}-events-tab`}
                            tab={`/${eventType}-events/active`}
                        />
                    </Link>
                    <Link
                        href={`/${eventType}-events/upcoming`}
                        className="relative text-nowrap"
                    >
                        الفعاليات القادمة{" "}
                        <TabIndicator
                            layoutId={`active-${eventType}-events-tab`}
                            tab={`/${eventType}-events/upcoming`}
                        />
                    </Link>
                    <Link
                        href={`/${eventType}-events/past`}
                        className="relative text-nowrap"
                    >
                        الفعاليات الماضية{" "}
                        <TabIndicator
                            layoutId={`active-${eventType}-events-tab`}
                            tab={`/${eventType}-events/past`}
                        />
                    </Link>
                </div>
                <div className="sm:hidden block">
                    <SelectEvents />
                </div>
            </Subtitle>
            <EventProvider>
                <StoreEventData data={eventData}>{children}</StoreEventData>
            </EventProvider>
        </>
    );
}
