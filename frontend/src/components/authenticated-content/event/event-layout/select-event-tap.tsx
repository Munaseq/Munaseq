"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/common/shadcn-ui/select";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SelectEventTap({eventID}: { eventID: string }) {
    const path = usePathname();
    const router = useRouter();
    const [selectedValue, setSelectedValue] = useState<string>("");
    
    // Update selected value when path changes
    useEffect(() => {
        const pathSegments = path.split("/");
        if (pathSegments.length >= 4) {
            setSelectedValue(pathSegments[3]);
        }
    }, [path]);

    return (
        <Select 
            value={selectedValue} 
            dir="rtl" 
            onValueChange={(e) => {
                router.push(`/event/${eventID}/${e}`);
            }}
        >
            <SelectTrigger className="m-2 !text-xl border-0 rounded-none border-b-2 border-custom-black">
                <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent className="bg-white ">
                <SelectItem value="about" className="!text-lg">
                حول
                </SelectItem>
                <SelectItem value="content" className="!text-lg">
                المحتوى
                </SelectItem>
                <SelectItem value="activities" className="!text-lg">
                الأنشطة
                </SelectItem>
                <SelectItem value="chat" className="!text-lg">
                الدردشة
                </SelectItem>
                <SelectItem value="members" className="!text-lg">
                الأعضاء
                </SelectItem>
                <SelectItem value="rate" className="!text-lg">
                التقييم 
                </SelectItem>
                <SelectItem value="announcement" className="!text-lg">
                الاخبار 
                </SelectItem>
            </SelectContent>
        </Select>
    );
}