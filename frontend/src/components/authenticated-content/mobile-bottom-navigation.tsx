"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import user from "@/assets/icons/user.svg";
import userActive from "@/assets/icons/user-active.svg";
import discover from "@/assets/icons/discover.svg";
import discoverActive from "@/assets/icons/discover-active.svg";
import calender from "@/assets/icons/calender.svg";
import calenderActive from "@/assets/icons/calender-active.svg";
import plus from "@/assets/icons/plus-circle-white.svg";
import signout from "@/assets/icons/signout.svg";
import Cookies from "js-cookie";
import { UserDataDto } from "@/dtos/user-data.dto";
import getProfileAction from "@/proxy/user/get-profile-action";
import { signOut } from "@/proxy/signout-action";
import Dropdown from "./dropdown-coordinated-events";
import { usePathname } from "next/navigation";

export default function BottomNavigation() {
  const [profileData, setProfileData] = useState<UserDataDto | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const getProfile = async () => {
      const token = Cookies.get("token");
      if (token) {
        const data = await getProfileAction();
        setProfileData(data);
      }
    };
    getProfile();
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white shadow-md p-4 flex justify-between items-center md:hidden">
      <Link
        href={"/user/" + profileData?.username}
        className="flex flex-col items-center"
      >
        <Image
          src={pathname.includes("/user") ? userActive : user}
          alt="My Account"
          className="w-6 h-6"
        />
        <span>حسابي</span>
      </Link>
      <Link href="/discover" className="flex flex-col items-center">
        <Image
          src={pathname === "/discover" ? discoverActive : discover}
          alt="Discover"
          className="w-6 h-6"
        />
        <span
          className={
            pathname === "/discover"
              ? "bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent"
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
        <Image src={plus} alt="Create Event" className="w-12" />
      </Link>
      <Dropdown pathname={pathname} />
      <button
        onClick={async () => {
          await signOut();
        }}
        className="flex flex-col items-center"
      >
        <Image src={signout} alt="signout" className="w-6 h-6" />
        <span className="">خروج</span>
      </button>
    </nav>
  );
}
