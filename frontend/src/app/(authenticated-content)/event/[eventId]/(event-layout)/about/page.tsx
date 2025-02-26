import { EventDataDto } from "@/dtos/event-data.dto";
import getEventAction from "@/proxy/event/get-event-using-id-action";
import calendarIcon from "@/assets/icons/calender.svg";
import groupIcon from "@/assets/icons/participants.svg";
import loactionIcon from "@/assets/icons/location.svg";
import Category from "@/components/common/category";
import Image from "next/image";
import { UserDataDto } from "@/dtos/user-data.dto";
import userIcon from "@/assets/icons/user-gradiant.svg";

export default async function AboutPage({
    params,
}: {
    params: { eventId: string };
}) {
    const event: EventDataDto = await getEventAction(params.eventId);

    const user: UserDataDto = event.eventCreator

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
                    <div className="flex items-center">
                        <Image
                            src={userIcon}
                            alt="user icon"
                            className="w-10"
                        />
                        <div className="text-[#AE00FE] font-semibold text-xl">
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
                        <Image
                            src={calendarIcon}
                            alt="date icon"
                            className="w-10"
                        />
                        {"تاريخ بدأ الفعالية: " +
                            new Date(event.startDateTime).toLocaleDateString()}
                    </p>
                    <p className="flex gap-2 items-center">
                        <Image
                            src={calendarIcon}
                            alt="date icon"
                            className="w-10"
                        />
                        {"تاريخ انتهاء الفعالية: " +
                            new Date(event.endDateTime).toLocaleDateString()}
                    </p>
                    <p className="flex gap-2 items-center">
                        <Image src={groupIcon} alt="group icon" />
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
                            <Image src={loactionIcon} alt="loaction Icon" />
                            {event.location}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
