"use client";

import dots from "@/assets/icons/dots.svg";
import user from "@/assets/icons/user-black.svg";
import signout from "@/assets/icons/signout.svg";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "../common/shadcn-ui/dropdown-menu";
import Link from "next/link";
import { Separator } from "../common/shadcn-ui/separator";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/proxy/signout-action";

export default function Dropdown({
    onLinkClick,
}: {
    onLinkClick?: () => void;
}) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    return (
        <DropdownMenu onOpenChange={setOpen} open={open} dir="rtl">
            <DropdownMenuTrigger asChild className="absoulte left-2 cursor-pointer">
                <Image className="left-2" src={dots} alt="options" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white relative p-0">
                <Link
                    onClick={() => {
                        if (onLinkClick) onLinkClick();
                        setOpen(false);
                    }}
                    href={"/account"}
                    className="flex gap-3 items-center p-3 transition-colors hover:bg-[#ebebeb]"
                >
                    {" "}
                    <Image src={user} alt="user icon" className="w-8" />
                    معلومات الحساب
                </Link>
                <Separator orientation="horizontal" className="bg-[#d3d3d3]" />
                <button
                    onClick={async () => {
                        await signOut();
                    }}
                    className="flex gap-3  items-center p-3 transition-colors hover:bg-[#ebebeb] w-full"
                >
                    {" "}
                    <Image src={signout} alt="user icon" className="w-8" />
                    تسجيل الخروج
                </button>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
