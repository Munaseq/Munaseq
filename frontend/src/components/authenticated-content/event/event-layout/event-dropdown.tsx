'use client'

import cancelEventAction from "@/proxy/event/cancel-event-action";
import leaveEventAction from "@/proxy/event/leave-event-action";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/common/shadcn-ui/dropdown-menu";;
import { useRouter } from "next/navigation";
import { EllipsisVerticalIcon, LogOutIcon } from "lucide-react";
export default function EventDropdown({eventId, isEventCreator}: {eventId: string, isEventCreator: boolean}) {

    const router = useRouter();

      const leaveEvent = async () => {
        const res = await leaveEventAction(eventId);
        toast.success("تم المغادرة من الفعالية");
        router.push("/event/" + eventId);
      }
    
      const cancelEvent = async () => {
        const res = await cancelEventAction(eventId);
        toast.success("تم الغاء الفعالية");
        
      }


    return (
        <DropdownMenu dir="rtl">
            <DropdownMenuTrigger className="absolute top-5 left-5 z-30">
              <EllipsisVerticalIcon color='white' size={32}/>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white relative">

              {isEventCreator ? (
                <div
                  onClick={() => cancelEvent()}
                  className="px-4 py-2 flex items-center gap-2 transition-colors hover:bg-[#ebebeb] cursor-pointer"
                >
                  الغاء الفعالية{" "}
                  <LogOutIcon/>
                </div>
              ) : (
                <div
                  onClick={() => leaveEvent()}
                  className="px-4 py-2 flex items-center gap-2 transition-colors hover:bg-[#ebebeb] cursor-pointer"
                >
                  {" "}
                  الخروج من الفعالية{" "}
                  <LogOutIcon/>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
    )
}