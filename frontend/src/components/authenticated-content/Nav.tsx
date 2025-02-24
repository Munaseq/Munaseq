"use client";

import { usePathname } from "next/navigation";
import user from "@/assets/icons/user.svg";
import userActive from "@/assets/icons/user-active.svg";
import discover from "@/assets/icons/discover.svg";
import discoverActive from "@/assets/icons/discover-active.svg";
import calender from "@/assets/icons/calender.svg";
import calenderActive from "@/assets/icons/calender-active.svg";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/common/shadcn-ui/collapsible";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { useState } from "react";

type NavLink = {
    name: string;
    path: string;
    icon: StaticImport;
    iconActive: StaticImport;
};

type EventLink = {
    name: string;
    path: string;
};

export default function Nav(props: {
    username: string;
    onLinkClick?: () => void;
}) {
    const pathname = usePathname();
    const navLinks: NavLink[] = [
        {
            name: "اكتشف",
            path: "/discover",
            icon: discover,
            iconActive: discoverActive,
        },
        {
            name: "الملف الشخصي",
            path: "/user/" + props.username,
            icon: user,
            iconActive: userActive,
        },
    ];
    const eventLinks = [
        {
            name: "الفعاليات التي نسقتها",
            path: "/coordinated-events/active",
        },
        {
            name: "الفعاليات التي نظمتها",
            path: "/moderated-events/active",
        },
        {
            name: "الفعاليات التي قدمتها",
            path: "/presented-events/active",
        },
        {
            name: "الفعاليات التي انضممت إليها",
            path: "/joined-events/active",
        },
    ];
    const isOnEventLink: boolean = eventLinks.some(link =>
        pathname.includes(link.path.split("/")[1])
    );
    const [isEventOpen, setIsEventOpen] = useState(isOnEventLink);
    return (
        <nav className=" mt-10 text-xl grid gap-5 text-[#525252] relative overflow-y-auto">
            {navLinks.map((link: NavLink) => {
                let isActive: boolean;
                isActive = pathname.endsWith(link.path);
                return (
                    <Link
                        key={link.name}
                        href={link.path}
                        onClick={() => {
                            if (props.onLinkClick) {
                                props.onLinkClick();
                            }
                        }}
                    >
                        <motion.div
                            whileHover={"active"}
                            className="flex gap-2 items-center py-1 relative w-full group"
                        >
                            <div>
                                <span
                                    className={
                                        "absolute transition-opacity z-10 " +
                                        (isActive
                                            ? "opacity-1"
                                            : "group-hover:opacity-100 opacity-0")
                                    }
                                >
                                    <Image
                                        priority
                                        className="w-8 ms-5"
                                        src={link.iconActive}
                                        alt="link image"
                                    />
                                </span>
                                <span className={" transition-opacity "}>
                                    <Image
                                        priority
                                        className="w-8 ms-5"
                                        src={link.icon}
                                        alt="link image"
                                    />
                                </span>
                            </div>
                            <p
                                className={
                                    "bg-custom-gradient bg-clip-text transition-colors " +
                                    (isActive
                                        ? "text-transparent font-bold"
                                        : "group-hover:text-transparent")
                                }
                            >
                                {link.name}
                            </p>
                            {isActive ? (
                                <motion.span
                                    layoutId="active-bar"
                                    className="absolute right-0 w-1 h-full bg-custom-gradient"
                                />
                            ) : null}
                        </motion.div>
                    </Link>
                );
            })}
            <Collapsible open={isEventOpen} onOpenChange={setIsEventOpen}>
                <CollapsibleTrigger>
                    <span>
                        <motion.div
                            whileHover={"active"}
                            className="flex gap-2 items-center py-1 relative w-full group"
                        >
                            <div className="grid place-items-center">
                                <span
                                    className={
                                        "absolute transition-opacity z-10 " +
                                        (isOnEventLink
                                            ? "opacity-1"
                                            : "group-hover:opacity-100 opacity-0")
                                    }
                                >
                                    <Image
                                        priority
                                        className="w-8 ms-5"
                                        src={calenderActive}
                                        alt="link image"
                                    />
                                </span>
                                <span className={" transition-opacity "}>
                                    <Image
                                        priority
                                        className="w-8 ms-5"
                                        src={calender}
                                        alt="link image"
                                    />
                                </span>
                            </div>
                            <p
                                className={
                                    "bg-custom-gradient bg-clip-text transition-colors " +
                                    (isOnEventLink
                                        ? "text-transparent font-bold"
                                        : "group-hover:text-transparent")
                                }
                            >
                                الفعاليات
                            </p>
                            
                            <div
                                className={
                                    " transition-transform " +
                                    (isEventOpen
                                        ? " -rotate-90 "
                                        : " rotate-0 ")
                                }
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 19.5 8.25 12l7.5-7.5"
                                    />
                                </svg>
                            </div>
                        </motion.div>
                    </span>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <nav className="text-lg grid text-[#525252] relative mt-2">
                        {eventLinks.map((link: EventLink) => {
                            let isActive: boolean;
                            isActive = pathname.includes(
                                link.path.split("/")[1]
                            );
                            return (
                                <Link
                                    key={link.name}
                                    href={link.path}
                                    onClick={() => {
                                        if (props.onLinkClick) {
                                            props.onLinkClick();
                                        }
                                    }}
                                >
                                    <motion.div
                                        whileHover={"active"}
                                        className="flex gap-5 items-center relative w-full group "
                                    >
                                        <p
                                            className={
                                                "bg-custom-gradient bg-clip-text transition-colors ms-10 ps-4 py-2 border-r " +
                                                (isActive
                                                    ? "text-transparent font-bold"
                                                    : "group-hover:text-transparent")
                                            }
                                        >
                                            {link.name}
                                        </p>
                                        {isActive ? (
                                            <motion.span
                                                layoutId="active-bar"
                                                className="absolute right-0 w-1 h-full bg-custom-gradient"
                                            />
                                        ) : null}
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </nav>
                </CollapsibleContent>
            </Collapsible>
        </nav>
    );
}
