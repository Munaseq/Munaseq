"use client";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/common/shadcn-ui/sheet";
import Button from "@/components/common/buttons/button";
import Image from "next/image";
import { Menu as MenuIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

import logo from "@/assets/logo/munaseq-logo.svg"

export default function Menu() {
    const [isOpen, setIsOpen] = useState(false);

    const handleLinkClick = (e: any, sectionId: string) => {
        setIsOpen(false);

        e.preventDefault();
        document
            .querySelector(sectionId)
            ?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="block sm:hidden">
                <MenuIcon  color="white" />
            </SheetTrigger>
            <SheetContent className="bg-white flex flex-col justify-center item py-20">
            <Image src={logo} alt="menu" className="" />
                <SheetHeader>
                    <SheetTitle className="text-lg font-semibold hidden">
                        Menu
                    </SheetTitle>
                </SheetHeader>
                <SheetDescription className="grid gap-3 px-10">
                    
                </SheetDescription>
                <Link href="/signin">
                        <Button outline className="w-full">تسجيل دخول</Button>
                    </Link>
                    <Link href="/signup">
                        <Button gradient className="w-full">انشاء الحساب</Button>
                    </Link>
            </SheetContent>
        </Sheet>
    );
}
