"use client";

import { useState } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../common/shadcn-ui/dropdown-menu";
import { Separator } from "../common/shadcn-ui/separator";
import Link from "next/link";
import calender from "@/assets/icons/calender.svg";
import calenderActive from "@/assets/icons/calender-active.svg";

const coordinatedEvents = [
  { name: "الفعاليات التي نسقتها", path: "/coordinated-events/active" },
  { name: "الفعاليات التي نظمتها", path: "/moderated-events/active" },
  { name: "الفعاليات التي قدمتها", path: "/presented-events/active" },
  { name: "الفعاليات التي انضممت إليها", path: "/joined-events/active" },
];

export default function CoordinatedEventsDropdown({
  pathname,
  onLinkClick,
}: {
  onLinkClick?: () => void;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  console.log(pathname);

  return (
    <DropdownMenu onOpenChange={setOpen} open={open} dir="rtl">
      <DropdownMenuTrigger asChild>
        <div className="flex flex-col items-center cursor-pointer">
          <Image
            src={pathname.includes("/active") ? calenderActive : calender}
            alt="Coordinated Events"
            className="w-6 h-6"
          />
          <span
            className={
              pathname.includes("/active")
                ? "bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent"
                : "text-custom-black"
            }
          >
            فعالياتي
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white relative p-0">
        {coordinatedEvents.map((event, index) => (
          <div key={event.path}>
            <Link
              onClick={() => {
                if (onLinkClick) onLinkClick();
                setOpen(false);
              }}
              href={event.path}
              className="flex gap-3 items-center p-3 transition-colors hover:bg-[#ebebeb]"
            >
              {event.name}
            </Link>
            {index < coordinatedEvents.length - 1 && (
              <Separator orientation="horizontal" className="bg-[#d3d3d3]" />
            )}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
