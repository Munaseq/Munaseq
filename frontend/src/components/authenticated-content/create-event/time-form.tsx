"use client";

import Image from "next/image";
import timeIcon from "@/assets/icons/time-filled.svg";
import CreateEventCard from "./create-event-card";
import { Input } from "@/components/common/shadcn-ui/input";
import Button from "@/components/common/buttons/button";
import Radio from "@/components/common/radio-group";
import {useState } from "react";
export default function TimeForm({
  step,
  prevStepHandler,
  nextStepHandler,
}: Readonly<{
  step: number;
  prevStepHandler: () => void;
  nextStepHandler: () => void;
}>) {
  const today = new Date().toISOString();
  const [endDateMin, setEndDateMin] = useState(today);
  const [endDateVal, setEndDateVal] = useState(today);
  const [startDate, setStartDate] = useState(today);

  return (
    <CreateEventCard actual={step} goal={3}>
      <h1 className="flex items-center gap-2 font-bold text-xl">
        <Image src={timeIcon} alt="puzzle icon" />
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
            onChange={(e) => {
              setEndDateMin(e.target.value);
              setEndDateVal(e.target.value);
              setStartDate(e.target.value);
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
            onChange={(e) => {
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
            onClick={(e) => {
              e.preventDefault();
              nextStepHandler();
            }}
            gradient
            className="!px-10"
          >
            التالي
          </Button>
          <Button
            onClick={(e) => {
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
