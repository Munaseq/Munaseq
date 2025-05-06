"use client";

import cancelEventAction from "@/proxy/event/cancel-event-action";
import leaveEventAction from "@/proxy/event/leave-event-action";
import toast from "react-hot-toast";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/common/shadcn-ui/dropdown-menu";
import { EllipsisVerticalIcon, LogOutIcon } from "lucide-react";
import EditEventDialog from "./edit-event-dialog";
import { EventDataDto } from "@/dtos/event-data.dto";
export default function EventDropdown({
    event,
    isEventCreator,
    isAdmin,
}: {
    event: EventDataDto;
    isEventCreator: boolean;
    isAdmin: boolean;
}) {
    const leaveEvent = async () => {
        const res = await leaveEventAction(event.id);

        if (res) {
            toast.error("حدث خطأ ما");
            return;
        }
        toast.success("تم المغادرة من الفعالية");
    };

    const cancelEvent = async () => {
        const res = await cancelEventAction(event.id);
        if (res) {
            toast.error("حدث خطأ ما");
            return;
        }
        toast.success("تم الغاء الفعالية");
    };

    return (
        <DropdownMenu dir="rtl">
            <DropdownMenuTrigger className="">
                <EllipsisVerticalIcon color="white" size={32} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white relative">
                {isEventCreator ? (
                    <div
                        onClick={() => cancelEvent()}
                        className="px-4 py-2 flex items-center gap-2 transition-colors hover:bg-[#ebebeb] cursor-pointer"
                    >
                        الغاء الفعالية <LogOutIcon />
                    </div>
                ) : (
                    <div
                        onClick={() => leaveEvent()}
                        className="px-4 py-2 flex items-center gap-2 transition-colors hover:bg-[#ebebeb] cursor-pointer"
                    >
                        {" "}
                        الخروج من الفعالية <LogOutIcon />
                    </div>
                )}
                {isAdmin && <EditEventDialog event={event} />}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
