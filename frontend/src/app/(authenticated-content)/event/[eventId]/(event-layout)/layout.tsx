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
import InviteUserDialog from "@/components/authenticated-content/event/event-layout/invite-user-dialog";
import getAllUsers from "@/proxy/user/get-all-user-event-action";
import getEventRateAction from "@/proxy/event/get-event-rate-action";

export default async function EventLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { eventId: string };
}) {
    const event: EventDataDto = await getEventAction(params.eventId);
    const rating = await getEventRateAction(params.eventId);
    if (!event) {
        notFound();
    }
    const user: UserDataDto = event.eventCreator;
    const currentUser: UserDataDto = await getProfileAction();
    const Users: {
        eventCreator: UserDataDto;
        joinedUsers: UserDataDto[];
        presenters: UserDataDto[];
        moderators: UserDataDto[];
    } = await getAllUsers(params.eventId);
    const isEventCreator = currentUser.id === user.id;
    const isEventModerator = Users.moderators.some(
        m => m.id === currentUser.id
    );
    const isEventPresenter = Users.presenters.some(
        m => m.id === currentUser.id
    );

    return (
        <div className="bg-white shadow-strong min-h-screen rounded-3xl overflow-hidden">
            <div className="h-96 rounded-t-3xl relative">
                <div className="bg-gradient-to-b from-black via-transparent to-black w-full h-full absolute z-10" />
                <Image
                    src={event.imageUrl}
                    alt="event image"
                    className="object-cover"
                    fill
                    sizes="100%"
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
                        isEventCreator={isEventCreator}
                        isAdmin={
                            isEventCreator ||
                            isEventModerator ||
                            isEventPresenter
                        }
                        event={event}
                    />

                    <EventQRDialog />
                    {(event.isPublic ||
                        isEventCreator ||
                        isEventModerator ||
                        isEventPresenter) && (
                        <InviteUserDialog
                            memberList={Users}
                            eventId={event.id}
                        />
                    )}
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
                            <span>{rating.avgRating}</span>
                        </div>
                    </div>
                    <div className=" sm:w-full sm:overflow-x-auto">
                        <div className="gap-8 sm:flex hidden text-xl">
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
                                href={`/event/${params.eventId}/chat`}
                                className="relative text-nowrap"
                            >
                                الدردشة{" "}
                                <TabIndicator
                                    layoutId="active-event-tab"
                                    tab="/chat"
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
                            <Link
                                href={`/event/${params.eventId}/announcement`}
                                className="relative text-nowrap"
                            >
                                الاخبار{" "}
                                <TabIndicator
                                    layoutId="active-event-tab"
                                    tab="/announcement"
                                />
                            </Link>
                            {(isEventCreator ||
                                isEventModerator ||
                                isEventPresenter) && (
                                <Link
                                    href={`/event/${params.eventId}/requests`}
                                    className="relative text-nowrap"
                                >
                                    الطلبات{" "}
                                    <TabIndicator
                                        layoutId="active-event-tab"
                                        tab="/requests"
                                    />
                                </Link>
                            )}
                        </div>

                        <div className="sm:hidden block">
                            <SelectEventTap eventID={params.eventId} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-5 relative">{children}</div>
        </div>
    );
}
