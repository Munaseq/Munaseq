"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { UserDataDto } from "@/dtos/user-data.dto";
import getProfileAction from "@/proxy/user/get-profile-action";
import { signOut } from "@/proxy/signout-action";
import Dropdown from "./dropdown-events";
import { usePathname } from "next/navigation";
import { CirclePlusIcon, LogOutIcon, SparklesIcon, UserRoundIcon } from "lucide-react";

export default function BottomNavigation() {
    const [profileData, setProfileData] = useState<UserDataDto | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        const getProfile = async () => {
            const data = await getProfileAction();
            setProfileData(data);
        };
        getProfile();
    }, []);

    return (
        <nav className="fixed bottom-4 left-0 w-full bg-white p-4 px-10 flex shadow-[0px_0px_30px_0px_rgba(0,0,0,0.2)] justify-between items-center rounded-full lg:hidden">
            <Link
                href={"/user/" + profileData?.username}
                className="flex flex-col items-center"
            >
                <div
                    className={
                        pathname.includes("/user")
                            ? "text-custom-light-purple"
                            : "text-custom-black"
                    }
                >
                    <UserRoundIcon />
                </div>
                <span
                    className={
                        pathname === "/user/" + profileData?.username
                            ? "bg-gradient-to-l from-custom-dark-purple to-custom-light-purple bg-clip-text text-transparent"
                            : "text-custom-black"
                    }
                >
                    حسابي
                </span>
            </Link>
            <Link href="/discover" className="flex flex-col items-center">
                    <div
                        className={
                            pathname.includes("/discover")
                                ? "text-custom-light-purple"
                                : "text-custom-black"
                        }
                    >
                        <SparklesIcon />
                    </div>
                <span
                    className={
                        pathname === "/discover"
                            ? "bg-gradient-to-l from-custom-dark-purple to-custom-light-purple bg-clip-text text-transparent"
                            : "text-custom-black"
                    }
                >
                    اكتشف
                </span>
            </Link>
            <Link
                href="/create-event"
                className="bg-custom-gradient rounded-full text-white flex items-center justify-center w-12 h-12"
            >
               <CirclePlusIcon/>
            </Link>
            <Dropdown pathname={pathname} />
            <button
                onClick={async () => {
                    await signOut();
                }}
                className="flex flex-col items-center"
            >
                <LogOutIcon />
                <span className="">خروج</span>
            </button>
        </nav>
    );
}
