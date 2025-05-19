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

export default function SelectEvents({}: {}) {
    const path = usePathname();
    const router = useRouter();
    const [selectedValue, setSelectedValue] = useState<string>("");
    
    // Update selected value when path changes
    useEffect(() => {
        const pathSegments = path.split("/");
        if (pathSegments.length >= 3) {
            setSelectedValue(pathSegments[2]);
        }
    }, [path]);

    const firstSubpath = path.split("/")[1];

    return (
        <Select 
            value={selectedValue} 
            dir="rtl" 
            onValueChange={(e) => {
                router.push(`/${firstSubpath}/${e}`);
            }}
        >
            <SelectTrigger className="m-2 !text-xl border-0">
                <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent className="bg-white ">
                <SelectItem value="active" className="!text-lg">
                    الفعاليات الحالية
                </SelectItem>
                <SelectItem value="upcoming" className="!text-lg">
                    الفعاليات القادمة
                </SelectItem>
                <SelectItem value="past" className="!text-lg">
                    الفعاليات الماضية
                </SelectItem>
            </SelectContent>
        </Select>
    );
}