"use client";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger,
} from "@/components/common/shadcn-ui/sheet";
import {MenuIcon} from 'lucide-react'
import { useState, useEffect } from "react";
import Menu from "./menu";
import { UserDataDto } from "@/dtos/user-data.dto";

export default function MenuMobile({ profileData }: { profileData: UserDataDto }) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        window.onresize = () => {
            if (window.innerWidth > 1024) {
                setIsOpen(false);
            }
        };
    }, []);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="lg:hidden block">
                <MenuIcon/>
            </SheetTrigger>
            <SheetContent className="max-w-[22rem] w-screen h-screen rounded-e-3xl fixed p-0 pt-10 bg-white flex">
                <SheetTitle className="hidden">القائمة</SheetTitle>
                <SheetDescription className="hidden">القائمة</SheetDescription>
                <Menu profileData={profileData} mobile onLinkClick={() => setIsOpen(false)} />
            </SheetContent>
        </Sheet>
    );
}
