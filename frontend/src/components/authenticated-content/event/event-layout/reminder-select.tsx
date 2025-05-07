"use client";

import { useState, useEffect } from "react";
import setReminderAction from "@/proxy/reminder-action";
import { set } from "date-fns";

interface ReminderSelectProps {
  startDate: string;
  eventId: string;
}

export default function ReminderSelect({
  startDate,
  eventId,
}: ReminderSelectProps) {
  const [options, setOptions] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const now = new Date();
    const start = new Date(startDate);
    const diffDays = Math.floor(
      (start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    const validOptions = [];
    if (diffDays >= 3) validOptions.push(3);
    if (diffDays >= 2) validOptions.push(2);
    if (diffDays >= 1) validOptions.push(1);

    setOptions(validOptions);
  }, [startDate]);

  const handleSetReminder = async (daysOffset: number) => {
    setSelected(daysOffset);
    console.log("Selected days offset:", selected); // Debugging line

    try {
      await setReminderAction(eventId, daysOffset);
    } catch (err) {
      console.error(err);
    }
  };

  if (options.length === 0) return null;

  return (
    <div className="mt-6 flex flex-col gap-2">
      <label className="text-custom-black font-semibold">
        اختر موعد التذكير
      </label>
      <select
        className="p-2 border rounded-xl bg-white text-custom-black focus:outline-none focus:ring-2 focus:ring-custom-light-purple w-fit"
        value={selected ?? ""}
        onChange={(e) => handleSetReminder(Number(e.target.value))}
      >
        <option value="" disabled>
          اختر عدد الأيام قبل الحدث
        </option>
        {options.map((day) => (
          <option key={day} value={day}>
            قبل {day} {day === 1 ? "يوم" : "أيام"}
          </option>
        ))}
      </select>
    </div>
  );
}
