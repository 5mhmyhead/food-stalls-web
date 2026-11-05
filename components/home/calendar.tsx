"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TOTAL_GRID_SLOTS = 42;

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const leadingPaddingSlots = Array.from({ length: firstDayOfWeek });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const trailingPaddingSlots = Array.from({
    length: TOTAL_GRID_SLOTS - (firstDayOfWeek + daysInMonth),
  });

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const isToday = (day: number) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-surface p-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          className="flex size-9 items-center justify-center rounded-xl bg-surface-container text-muted transition-colors hover:bg-primary/10 hover:text-primary"
          title="Previous Month"
        >
          <ChevronLeft className="size-5 stroke-[2.5]" />
        </button>
        <h2 className="font-serif text-2xl font-bold text-onSurface">
          {monthName}
        </h2>
        <button
          type="button"
          onClick={nextMonth}
          className="flex size-9 items-center justify-center rounded-xl bg-surface-container text-muted transition-colors hover:bg-primary/10 hover:text-primary"
          title="Next Month"
        >
          <ChevronRight className="size-5 stroke-[2.5]" />
        </button>
      </div>

      <div className="grid grid-cols-7 justify-items-center gap-1 font-bold text-md text-muted">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="flex size-9 items-center justify-center">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 justify-items-center gap-1">
        {leadingPaddingSlots.map((_, index) => (
          <div key={`lead-${index}`} className="size-9" />
        ))}

        {days.map((day) => {
          const currentDayIsToday = isToday(day);

          return (
            <div
              key={day}
              className={`flex size-9 items-center justify-center rounded-xl text-md font-semibold transition-colors ${
                currentDayIsToday
                  ? "bg-primary text-background font-black"
                  : "text-onSurface hover:bg-surface-container"
              }`}
            >
              {day}
            </div>
          );
        })}

        {trailingPaddingSlots.map((_, index) => (
          <div key={`trail-${index}`} className="size-9" />
        ))}
      </div>
    </div>
  );
}