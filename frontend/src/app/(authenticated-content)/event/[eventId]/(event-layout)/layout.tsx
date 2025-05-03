import { EventDataDto } from "@/dtos/event-data.dto";
import getEventAction from "@/proxy/event/get-event-using-id-action";
import Image from "next/image";
import leftDeco from "@/assets/event/left-deco.png";
import rightDeco from "@/assets/event/right-deco.png";
import { UserDataDto } from "@/dtos/user-data.dto";
import Link from "next/link";
import TabIndicator from "@/components/common/tab-indicator";
import getUserRating from "@/proxy/user/get-user-rating-action";
import getProfileAction from "@/proxy/user/get-profile-action";
import EventDropdown from "@/components/authenticated-content/event/event-layout/event-dropdown";
import { notFound } from "next/navigation";
import { StarIcon, UserRound, UserRoundIcon } from "lucide-react";
import SelectEventTap from "@/components/authenticated-content/event/event-layout/select-event-tap";
import EventQRDialog from "@/components/authenticated-content/event/event-layout/event-qr-dialog";

export default async function EventLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { eventId: string };
}) {
    const event: EventDataDto = await getEventAction(params.eventId);
    if (!event) {
        notFound();
    }
    const user: UserDataDto = event.eventCreator;
    const currentUser: UserDataDto = await getProfileAction();
    const isEventCreator = currentUser.id === user.id;
    const rating: any = await getUserRating(user.id);

    return (
        <div className="bg-white shadow-strong min-h-screen rounded-3xl overflow-hidden">
            <div className="h-96 rounded-t-3xl relative">
                <div className="bg-gradient-to-b from-black via-transparent to-black w-full h-full absolute z-10" />
                <Image
                    src={event.imageUrl}
                    alt="event image"
                    className="object-cover"
                    fill
                />
                <Image
                    src={leftDeco}
                    className="absolute top-0 left-0 z-10 sm:block hidden"
                    alt="deco"
                />
                <Image
                    src={rightDeco}
                    className="absolute top-0 right-0 z-10 sm:block hidden"
                    alt="deco"
                />

                <div className="absolute z-20 flex gap-1 top-3 right-3">
                    {event.categories.map(category => (
                        <span
                            key={category}
                            className="rounded-full bg-white text-custom-light-purple px-2.5 py-1 ml-2 text-md font-medium "
                        >
                            {category}
                        </span>
                    ))}
                </div>

                <div className="absolute z-20 top-3 left-3 flex flex-row-reverse gap-2">
                    <EventDropdown
                        eventId={params.eventId}
                        isEventCreator={isEventCreator}
                    />

                    <EventQRDialog eventId={params.eventId} />
                </div>

                <div className="absolute z-20 text-white bottom-0 right-0 grid p-4 pb-2">
                    <div className="mb-10">
                        <h1 className="text-4xl font-bold mb-1">
                            {event.title}
                        </h1>
                        <div className="flex items-center gap-2 font-light text-xl">
                            {" "}
                            <UserRoundIcon className="text-custom-light-purple" />{" "}
                            <span>{user.firstName + " " + user.lastName}</span>{" "}
                            <StarIcon className="text-custom-light-purple" />{" "}
                            {rating?.avgRating ? (
                                <span>{rating?.avgRating}</span>
                            ) : (
                                <span>0</span>
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="gap-8 sm:flex hidden text-xl ">
                            <Link
                                href={`/event/${params.eventId}/about`}
                                className="relative text-nowrap"
                            >
                                حول
                                <TabIndicator
                                    layoutId="active-event-tab"
                                    tab="/about"
                                />
                            </Link>
                            <Link
                                href={`/event/${params.eventId}/content`}
                                className="relative text-nowrap"
                            >
                                المحتوى{" "}
                                <TabIndicator
                                    layoutId="active-event-tab"
                                    tab="/content"
                                />
                            </Link>
                            <Link
                                href={`/event/${params.eventId}/activities`}
                                className="relative text-nowrap"
                            >
                                الأنشطة{" "}
                                <TabIndicator
                                    layoutId="active-event-tab"
                                    tab="/activities"
                                />
                            </Link>
                            <Link
                                href={`/event/${params.eventId}/members`}
                                className="relative text-nowrap"
                            >
                                الأعضاء{" "}
                                <TabIndicator
                                    layoutId="active-event-tab"
                                    tab="/members"
                                />
                            </Link>
                            <Link
                                href={`/event/${params.eventId}/rate`}
                                className="relative text-nowrap"
                            >
                                التقييم{" "}
                                <TabIndicator
                                    layoutId="active-event-tab"
                                    tab="/rate"
                                />
                            </Link>
                        </div>

                        <div className="sm:hidden block">
                            <SelectEventTap />
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}
