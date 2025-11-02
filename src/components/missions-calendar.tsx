"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar";
import { es } from "date-fns/locale";

interface Mission {
  date: Date;
  status: "completed" | "pending";
}

interface MissionsCalendarProps {
  missions?: Mission[];
}

export function MissionsCalendar({ missions = [] }: MissionsCalendarProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="flex justify-center w-full">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        locale={es}
        weekStartsOn={1}
        captionLayout="dropdown"
        className="rounded-sm border-2 border-purple-500/50 bg-gradient-to-br from-gray-900 to-gray-950 p-8 shadow-xl shadow-purple-500/20 w-full max-w-5xl [--cell-size:4rem]"
      />
    </div>
  );
}

