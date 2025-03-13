import { EventDataDto } from "@/dtos/event-data.dto";
import getEventAction from "@/proxy/event/get-event-using-id-action";
import Category from "@/components/common/category";
import Image from "next/image";
import { UserDataDto } from "@/dtos/user-data.dto";
import { notFound } from "next/navigation";
import {
    CalendarDaysIcon,
    MapPinIcon,
    UserRoundIcon,
    UsersRoundIcon,
} from "lucide-react";

export default async function AboutPage({
    params,
}: {
    params: { eventId: string };
}) {
    const event: EventDataDto = await getEventAction(params.eventId);
    if (!event) {
        notFound();
    }
    const user: UserDataDto = event.eventCreator;

    return (
        <div className="">
            <div className="flex relative md:flex-row flex-col"></div>
            <div className="">
                <div className="md:mt-5 my-5 flex flex-wrap gap-2">
                    {event.categories.map((category: string) => {
                        return <Category key={category}>{category}</Category>;
                    })}
                </div>
                <div className="grid gap-3">
                    <h1 className="font-bold text-3xl">{event.title}</h1>
                    <div className="flex items-center text-custom-light-purple">
                        <UserRoundIcon />
                        <div className=" font-semibold text-xl">
                            <p>
                                {"المنسق " +
                                    user.firstName +
                                    " " +
                                    user.lastName}
                            </p>
                        </div>
                    </div>
                    <div className="text-custom-black">{event.description}</div>
                </div>
            </div>
            <div className="mt-10">
                <h1 className="font-bold ">معلومات الحضور</h1>
                <div className="text-custom-black gap-1 flex flex-col">
                    <p className="flex gap-2 items-center">
                        <CalendarDaysIcon />
                        {"تاريخ بدأ الفعالية: " +
                            new Date(event.startDateTime).toLocaleDateString()}
                    </p>
                    <p className="flex gap-2 items-center">
                        <CalendarDaysIcon />
                        {"تاريخ انتهاء الفعالية: " +
                            new Date(event.endDateTime).toLocaleDateString()}
                    </p>
                    <p className="flex gap-2 items-center">
                        <UsersRoundIcon />
                        {(!event.isOnline ? "حضوري" : "عن بعد") +
                            " " +
                            (event.gender === "BOTH"
                                ? "للجميع"
                                : event.gender === "MALE"
                                ? "للذكور"
                                : "للإناث")}
                    </p>
                    {!event.isOnline && (
                        <p className="flex gap-2 items-center">
                            <MapPinIcon />
                            {event.location}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
