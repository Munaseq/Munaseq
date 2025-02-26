import getEventAction from "@/proxy/event/get-event-using-id-action";
import Image from "next/image";
import { EventDataDto } from "@/dtos/event-data.dto";
import Category from "@/components/common/category";
import userIcon from "@/assets/icons/user-gradiant.svg";
import { UserDataDto } from "@/dtos/user-data.dto";
import calendarIcon from "@/assets/icons/calender.svg";
import groupIcon from "@/assets/icons/participants.svg";
import loactionIcon from "@/assets/icons/location.svg";
import decoTop from "@/assets/event/top.png";
import decoBottom from "@/assets/event/bottom.png";
import Return from "@/components/authenticated-content/event/return";
import JoinButton from "@/components/authenticated-content/event/join";
import isInEventAction from "@/proxy/user/is-in-event-action";
import getProfileAction from "@/proxy/user/get-profile-action";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function EventPage({
    params,
}: {
    params: { eventId: string };
}) {
    const event: EventDataDto = await getEventAction(params.eventId);
    const cookiesStore = cookies();
    const token = cookiesStore.get("token");
    if (!token) {
        redirect("/signin");
    }
    const loggedInUser: UserDataDto = await getProfileAction();
    const isUserInEvent = await isInEventAction(
        event.id,
        loggedInUser.username
    );
    if (isUserInEvent) {
        redirect("/event/" + event.id + "/about");
    }
    const user: UserDataDto = event.eventCreator;

    return (
        <section className="grid place-items-center mb-10">
            <div className="bg-white w-full max-w-[1100px] shadow-custom rounded-xl md:p-8 overflow-hidden relative">
                <Image
                    className="absolute top-0 left-0 md:block hidden"
                    src={decoTop}
                    alt="deco"
                />
                <Return className="absolute top-10 left-10 md:block hidden" />

                <div className="flex relative md:flex-row flex-col">
                    <div className="w-full md:max-w-[600px] aspect-[7/5] relative">
                        <Image
                            src={event.imageUrl}
                            alt="image of the event"
                            fill
                            className="object-cover rounded-2xl shadow-menu  md:rounded-b-2xl rounded-b-none rounded-t-2xl"
                        />
                    </div>
                    <div className="flex-1 text-xl gap-5 flex flex-col md:min-w-72 px-8 pt-4 relative">
                        <Image
                            className="absolute top-0 left-0 block md:hidden"
                            src={decoTop}
                            alt="deco"
                        />
                        <Return className="absolute top-5 left-5 block md:hidden" />
                        <h1 className="font-bold ">معلومات الحضور</h1>
                        <div className="text-custom-black gap-2 flex flex-col">
                            <p className="flex gap-2 items-center">
                                <Image
                                    src={calendarIcon}
                                    alt="date icon"
                                    className="w-10"
                                />
                                {"تاريخ بدأ الفعالية: " +
                                    new Date(
                                        event.startDateTime
                                    ).toLocaleDateString()}
                            </p>
                            <p className="flex gap-2 items-center">
                                <Image
                                    src={calendarIcon}
                                    alt="date icon"
                                    className="w-10"
                                />
                                {"تاريخ انتهاء الفعالية: " +
                                    new Date(
                                        event.endDateTime
                                    ).toLocaleDateString()}
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
                                    <Image
                                        src={loactionIcon}
                                        alt="loaction Icon"
                                    />
                                    {event.location}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="md:p-0 px-8 pb-4">
                    <div className="md:mt-5 my-5 flex flex-wrap">
                        {event.categories.map((category: string) => {
                            return (
                                <Category key={category}>{category}</Category>
                            );
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
                        <div className="text-custom-black">
                            {event.description}
                        </div>
                    </div>

                    <JoinButton eventId={params.eventId}>
                        <Image
                            className="absolute bottom-0 left-0 "
                            src={decoBottom}
                            alt="deco"
                        />
                    </JoinButton>
                </div>
            </div>
        </section>
    );
}
