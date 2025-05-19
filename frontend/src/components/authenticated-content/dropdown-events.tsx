"use client";

import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "../common/shadcn-ui/dropdown-menu";
import { Separator } from "../common/shadcn-ui/separator";
import Link from "next/link";
import { CalendarDaysIcon } from "lucide-react";

const coordinatedEvents = [
    { name: "الفعاليات التي نسقتها", path: "/coordinated-events/active" },
    { name: "الفعاليات التي نظمتها", path: "/moderated-events/active" },
    { name: "الفعاليات التي قدمتها", path: "/presented-events/active" },
    { name: "الفعاليات التي انضممت إليها", path: "/joined-events/active" },
];

export default function EventsDropdown({
    pathname,
    onLinkClick,
}: {
    onLinkClick?: () => void;
    pathname: string;
}) {
    const [open, setOpen] = useState(false);

    return (
        <DropdownMenu onOpenChange={setOpen} open={open} dir="rtl">
            <DropdownMenuTrigger asChild>
                <div className="flex flex-col items-center cursor-pointer">
                    <div className={pathname.includes("/active") ? "text-custom-light-purple" : "text-custom-black"}>
                        <CalendarDaysIcon />
                    </div>
                    <span
                        className={
                            pathname.includes("/active")
                                ? "bg-gradient-to-l from-custom-dark-purple to-custom-light-purple bg-clip-text text-transparent"
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
                            <Separator
                                orientation="horizontal"
                                className="bg-[#d3d3d3]"
                            />
                        )}
                    </div>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
