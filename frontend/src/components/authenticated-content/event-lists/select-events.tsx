"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/common/shadcn-ui/select";
import { usePathname, useRouter } from "next/navigation";

export default function SelectEvents({}: {}) {
    const path = usePathname();
    const firstSubpath = path.split("/")[1];
    const secSubpath = path.split("/")[2];

    const router = useRouter();

    return (
        <Select defaultValue={secSubpath} dir="rtl" onValueChange={(e) => {
            
            router.push(`/${firstSubpath}/${e}`);
        }}>
            <SelectTrigger className="m-2 !text-xl border-0">
                <SelectValue placeholder="Theme" defaultValue={secSubpath} />
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
