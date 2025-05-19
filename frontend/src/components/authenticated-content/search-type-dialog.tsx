"use client";
import { useSearchTypeContext } from "@/store/search-type-context";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../common/shadcn-ui/dialog";
import { CalendarDaysIcon, SlidersHorizontalIcon, UserRoundIcon } from "lucide-react";
import { SearchType } from "@/util/search-type";
import { RadioGroup, RadioGroupItem } from "../common/shadcn-ui/radio-group";
import { useState } from "react";

export default function SearchTypeDialog({
    onChangeType,
}: {
    onChangeType: () => void;
}) {
    const { searchType, setSearchType } = useSearchTypeContext();
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="mx-3">
                <SlidersHorizontalIcon size={32} />
            </DialogTrigger>
            <DialogContent className="bg-white">
                <DialogHeader className="!text-right ps-4 pb-5">
                    <DialogTitle>اختر نوع عملية البحث</DialogTitle>
                    <DialogDescription>
                        اختر نوع عملية البحث من بين عنوان الفعالية، رقم الفعالية
                        أو ابحث عن مستخدم.
                    </DialogDescription>
                </DialogHeader>

                <RadioGroup
                    onValueChange={value => {
                        setSearchType(value as SearchType);
                        setOpen(false);
                        onChangeType();
                    }}
                    name={"SearchType"}
                    id={"SearchType"}
                    defaultValue={searchType}
                    className="grid grid-cols-2 gap-2 px-4"
                >
                    <div className="grid gap-2">
                        <div className="font-bold flex gap-1"><CalendarDaysIcon/>البحث عن فعالية</div>
                        <div className="flex items-center space-x-2 gap-1 pt-2">
                            <RadioGroupItem
                                value={SearchType.TITLE}
                                id={SearchType.TITLE}
                            />
                            <label htmlFor={SearchType.TITLE}>
                                عنوان الفعالية
                            </label>
                        </div>
                        <div className="flex items-center space-x-2 gap-1">
                            <RadioGroupItem
                                value={SearchType.EVENT_ID}
                                id={SearchType.EVENT_ID}
                            />
                            <label htmlFor={SearchType.EVENT_ID}>
                                رقم الفعالية
                            </label>
                        </div>
                        <div className="flex items-center space-x-2 gap-1">
                            <RadioGroupItem
                                value={SearchType.CATEGORY}
                                id={SearchType.CATEGORY}
                            />
                            <label htmlFor={SearchType.CATEGORY}>
                                فئة الفعالية
                            </label>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="font-bold flex gap-1"><UserRoundIcon/>البحث عن مستخدم</div>
                        <div className="flex items-center space-x-2 gap-1">
                            <RadioGroupItem
                                value={SearchType.USER}
                                id={SearchType.USER}
                            />
                            <label htmlFor={SearchType.USER}>
                                الاسم المستخدم
                            </label>
                        </div>
                    </div>
                </RadioGroup>
            </DialogContent>
        </Dialog>
    );
}
