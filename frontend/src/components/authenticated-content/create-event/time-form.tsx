"use client";

import CreateEventCard from "./create-event-card";
import { Input } from "@/components/common/shadcn-ui/input";
import Button from "@/components/common/buttons/button";
import Radio from "@/components/common/radio-group";
import { useState } from "react";
import { ClockIcon } from "lucide-react";
export default function TimeForm({
    step,
    prevStepHandler,
    nextStepHandler,
}: Readonly<{
    step: number;
    prevStepHandler: () => void;
    nextStepHandler: () => void;
}>) {
    const today = new Date().toISOString().split("T")[0];
    const [startDate, setStartDate] = useState(today);
    // make another date that is 1 day from startDate
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(startDateObj);
    endDateObj.setDate(endDateObj.getDate() + 1);
    const endDate = endDateObj.toISOString().split("T")[0];
    const [endDateMin, setEndDateMin] = useState(endDate);
    const [endDateVal, setEndDateVal] = useState(endDate);

    return (
        <CreateEventCard actual={step} goal={3}>
            <h1 className="flex items-center gap-2 font-bold text-xl">
                <ClockIcon className="text-custom-light-purple" size={32} />
                جدولة الفعالية
            </h1>
            <div className="max-w-96 w-full grid gap-5 mt-2">
                <div className="flex gap-4 flex-col">
                    <label
                        htmlFor="startDateTime"
                        className="block text-lg text-custom-gray text-nowrap"
                    >
                        تاريخ بدأ الفعالية
                    </label>
                    <Input
                        className="w-min"
                        type="date"
                        name="startDateTime"
                        min={today}
                        value={startDate}
                        onChange={e => {
                            const startDateObj = new Date(e.target.value);
                            const endDateObj = new Date(startDateObj);
                            endDateObj.setDate(endDateObj.getDate() + 1);
                            const endDate = endDateObj
                                .toISOString()
                                .split("T")[0];
                            setStartDate(e.target.value);
                            setEndDateMin(endDate);
                            setEndDateVal(endDate);
                        }}
                    />
                    <label
                        htmlFor="endDateTime"
                        className="block text-lg text-custom-gray text-nowrap"
                    >
                        تاريخ انتهاء الفعالية
                    </label>
                    <Input
                        className="w-min"
                        type="date"
                        name="endDateTime"
                        min={endDateMin}
                        value={endDateVal}
                        onChange={e => {
                            setEndDateVal(e.target.value);
                        }}
                    />
                </div>
                <label className="block text-lg text-custom-gray">
                    هل هي فعالية عامة ام خاصة
                </label>
                <Radio
                    name={"isPublic"}
                    options={["عامة", "خاصة"]}
                    values={["true", "false"]}
                />
            </div>

            <div className="flex flex-row-reverse justify-between w-full mt-10">
                <Button
                    onClick={e => {
                        e.preventDefault();
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
