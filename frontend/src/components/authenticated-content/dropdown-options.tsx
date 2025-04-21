"use client";


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "../common/shadcn-ui/dropdown-menu";
import Link from "next/link";
import { Separator } from "../common/shadcn-ui/separator";
import Image from "next/image";
import { useState } from "react";
import { signOut } from "@/proxy/signout-action";
import { EllipsisVerticalIcon, LogOutIcon, UserRoundIcon } from "lucide-react";

export default function Dropdown({
    onLinkClick,
}: {
    onLinkClick?: () => void;
}) {
    const [open, setOpen] = useState(false);
    return (
        <DropdownMenu onOpenChange={setOpen} open={open} dir="rtl">
            <DropdownMenuTrigger asChild className="absoulte left-2 cursor-pointer">
                <EllipsisVerticalIcon className="left-2"/>
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
                    <UserRoundIcon />
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
                    <LogOutIcon />
                    تسجيل الخروج
                </button>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
