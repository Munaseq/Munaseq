'use client'

import cancelEventAction from "@/proxy/event/cancel-event-action";
import leaveEventAction from "@/proxy/event/leave-event-action";
import signout from "@/assets/icons/signout.svg";
import dots from "@/assets/icons/dots-white.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/common/shadcn-ui/dropdown-menu";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function EventDropdown({eventId, isEventCreator}: {eventId: string, isEventCreator: boolean}) {

    const router = useRouter();

      const leaveEvent = async () => {
        const res = await leaveEventAction(eventId);
        router.push("/event/" + eventId);
      }
    
      const cancelEvent = async () => {
        const res = await cancelEventAction(eventId);
        // setTimeout(() => {
        //   router.push("/coordinated-events/active");
        // }
        // , 1000);
      }


    return (
        <DropdownMenu dir="rtl">
            <DropdownMenuTrigger className="absolute top-2 left-2 z-30">
              <Image src={dots} alt="options"  />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white relative">

              {isEventCreator ? (
                <div
                  onClick={() => cancelEvent()}
                  className="px-4 py-2 flex items-center gap-2 transition-colors hover:bg-[#ebebeb] cursor-pointer"
                >
                  الغاء الفعالية{" "}
                  <Image src={signout} alt="user icon" className="w-8" />
                </div>
              ) : (
                <div
                  onClick={() => leaveEvent()}
                  className="px-4 py-2 flex items-center gap-2 transition-colors hover:bg-[#ebebeb] cursor-pointer"
                >
                  {" "}
                  الخروج من الفعالية{" "}
                  <Image src={signout} alt="user icon" className="w-8" />
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
    )
}