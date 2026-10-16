"use client";

import { useState } from "react";

type TaskCalendarProps = {
  value: string;
  onChange: (date: string) => void;
  isDark: boolean;
};

const WEEKDAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MONTH_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  month: "long",
  year: "numeric",
});
const DATE_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "long",
});

function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function dateFromKey(value: string) {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

export default function TaskCalendar({
  value,
  onChange,
  isDark,
}: TaskCalendarProps) {
  const selectedDate = dateFromKey(value);
  const [isOpen, setIsOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(
    () => selectedDate ?? new Date(),
  );
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarCells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  function changeMonth(offset: number) {
    setVisibleMonth(new Date(year, month + offset, 1));
  }

  function selectDate(day: number) {
    onChange(toDateKey(year, month, day));
    setIsOpen(false);
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none ${
          isDark
            ? "border-gray-700 bg-gray-800 text-gray-100 hover:bg-gray-700"
            : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
        }`}
      >
        <span>
          {selectedDate ? DATE_FORMATTER.format(selectedDate) : "Pilih tanggal"}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-5 w-5"
        >
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18" />
        </svg>
      </button>

      <div
        className={`grid transition-all duration-300 ease-out ${
          isOpen
            ? "mt-3 grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className={`overflow-hidden ${isOpen ? "visible" : "invisible"}`}>
          <div
            className={`rounded-xl border p-3 ${
              isDark
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                aria-label="Bulan sebelumnya"
                className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                  isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              <p
                className={`font-semibold capitalize ${
                  isDark ? "text-gray-100" : "text-gray-900"
                }`}
              >
                {MONTH_FORMATTER.format(visibleMonth)}
              </p>

              <button
                type="button"
                onClick={() => changeMonth(1)}
                aria-label="Bulan berikutnya"
                className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                  isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>

            <div className="mt-3 grid grid-cols-7 gap-1 text-center">
              {WEEKDAYS.map((day) => (
                <span
                  key={day}
                  className={`py-2 text-xs font-medium ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {day}
                </span>
              ))}

              {calendarCells.map((day, index) =>
                day === null ? (
                  <span key={`empty-${index}`} />
                ) : (
                  <button
                    key={day}
                    type="button"
                    onClick={() => selectDate(day)}
                    aria-label={`${day} ${MONTH_FORMATTER.format(visibleMonth)}`}
                    aria-pressed={value === toDateKey(year, month, day)}
                    className={`flex aspect-square min-h-10 items-center justify-center rounded-lg text-sm transition-colors ${
                      value === toDateKey(year, month, day)
                        ? "bg-blue-600 font-semibold text-white"
                        : isDark
                          ? "text-gray-200 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {day}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
