import Image from "next/image";
import CreateEventCard from "./create-event-card";
import TextField from "@/components/common/text/text-field";
import { Input } from "@/components/common/shadcn-ui/input";
import Button from "@/components/common/buttons/button";
import Radio from "@/components/common/radio-group";
import { UsersRoundIcon } from "lucide-react";
import { useRef, useState } from "react";
export default function ParticipantsForm({
    nextStepHandler,
    step,
    prevStepHandler,
}: Readonly<{
    nextStepHandler: () => void;
    step: number;
    prevStepHandler: () => void;
}>) {
    const [isEmpty, setIsEmpty] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const locationInputRef = useRef({} as HTMLInputElement);
    const capacityInputRef = useRef({} as HTMLInputElement);
    return (
        <CreateEventCard actual={step} goal={2}>
            <h1 className="flex items-center gap-2 font-bold text-xl">
                <UsersRoundIcon
                    size={32}
                    className="text-custom-light-purple"
                />
                معلومات الحضور
            </h1>
            <div className="max-w-96 w-full grid gap-5 mt-2">
                <label className="block text-lg text-custom-gray">
                    طريقة حضور الفعالية
                </label>
                <Radio
                    onChange={() => {
                        setIsOnline(prev => !prev);
                    }}
                    name={"isOnline"}
                    options={["حضوري", "عن بعد"]}
                    values={["false", "true"]}
                />
                <label className="block text-lg text-custom-gray">
                    جنس الحاضرين
                </label>
                <Radio
                    name={"gender"}
                    options={["ذكر", "انثى", "الجميع"]}
                    values={["MALE", "FEMALE", "BOTH"]}
                />
                <TextField
                    ref={locationInputRef}
                    placeholder={isOnline ? "رابط الفعالية" : "مكان الفعالية"}
                    name="location"
                />
                <div className="flex gap-4">
                    <label
                        htmlFor="seatCapacity"
                        className="block text-lg text-custom-gray text-nowrap"
                    >
                        عدد الحاضرين
                    </label>
                    <Input
                        ref={capacityInputRef}
                        type="number"
                        name="seatCapacity"
                        defaultValue={50}
                        min={1}
                        max={1000}
                    />
                </div>
            </div>
            {isEmpty && (
                <p className="text-red-500 text-sm w-full text-center mt-5">
                    يجب ملئ جميع الحقول المطلوبة
                </p>
            )}
            <div className="flex flex-row-reverse justify-between w-full mt-20">
                <Button
                    onClick={e => {
                        e.preventDefault();
                        if (
                            locationInputRef.current.value === "" ||
                            capacityInputRef.current.value === ""
                        ) {
                            setIsEmpty(true);
                            return;
                        }
                        setIsEmpty(false);
                        nextStepHandler();
                    }}
                    gradient
                    className="!px-10"
                >
                    التالي
                </Button>
                <Button
                    onClick={e => {
                        e.preventDefault();
                        prevStepHandler();
                    }}
                    className="!px-10"
                >
                    السابق
                </Button>
            </div>
        </CreateEventCard>
    );
}
