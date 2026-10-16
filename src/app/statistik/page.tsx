"use client";

import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { useTheme } from "@/components/ThemeProvider";
import { readTasksFromStorage, type Task } from "@/lib/tasks";

type Period = "week" | "month" | "year";

const periods: { value: Period; label: string }[] = [
  { value: "week", label: "1 Minggu" },
  { value: "month", label: "1 Bulan" },
  { value: "year", label: "1 Tahun" },
];

function getPeriodStart(period: Period, now: Date) {
  const start = new Date(now);

  if (period === "week") {
    start.setDate(start.getDate() - 7);
  } else if (period === "month") {
    start.setMonth(start.getMonth() - 1);
  } else {
    start.setFullYear(start.getFullYear() - 1);
  }

  return start.getTime();
}

function isWithinPeriod(
  timestamp: string | null,
  startTime: number,
  endTime: number,
) {
  if (!timestamp) return false;

  const time = Date.parse(timestamp);
  return !Number.isNaN(time) && time >= startTime && time <= endTime;
}

export default function StatisticsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [period, setPeriod] = useState<Period>("week");
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loadTasks = window.setTimeout(() => {
      setTasks(readTasksFromStorage());
    }, 0);

    return () => window.clearTimeout(loadTasks);
  }, []);

  const now = new Date();
  const endTime = now.getTime();
  const startTime = getPeriodStart(period, now);
  const completedCount = tasks.filter((task) =>
    isWithinPeriod(task.completedAt, startTime, endTime),
  ).length;
  const activeCount = tasks.filter(
    (task) =>
      !task.completed &&
      isWithinPeriod(task.createdAt, startTime, endTime),
  ).length;
  const activityCount = completedCount + activeCount;
  const progress =
    activityCount === 0 ? 0 : Math.round((completedCount / activityCount) * 100);

  return (
    <main
      className={`flex min-h-screen items-center justify-center p-6 transition-colors ${
        isDark ? "bg-gray-950" : "bg-gray-100"
      }`}
    >
      <div
        className={`w-full max-w-lg rounded-2xl p-6 shadow-lg transition-colors sm:p-8 ${
          isDark ? "bg-gray-900" : "bg-white"
        }`}
      >
        <Navigation />

        <h1
          className={`text-3xl font-bold ${
            isDark ? "text-gray-50" : "text-gray-900"
          }`}
        >
          Statistik
        </h1>
        <p className={`mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Progres aktivitas tugas berdasarkan periode.
        </p>

        <div className="mt-6 flex flex-wrap gap-2" aria-label="Periode statistik">
          {periods.map((item) => {
            const isActive = period === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setPeriod(item.value)}
                aria-pressed={isActive}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : isDark
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <section
          className={`mt-6 rounded-xl border p-5 ${
            isDark
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className={isDark ? "text-gray-400" : "text-gray-500"}>
                Progres
              </p>
              <p
                className={`mt-1 text-4xl font-bold ${
                  isDark ? "text-gray-50" : "text-gray-900"
                }`}
              >
                {progress}%
              </p>
            </div>

            <div className="text-right text-sm">
              <p className={isDark ? "text-gray-300" : "text-gray-700"}>
                {completedCount} selesai
              </p>
              <p className={isDark ? "text-gray-400" : "text-gray-500"}>
                {activeCount} belum selesai
              </p>
            </div>
          </div>

          <div
            className={`mt-5 h-3 overflow-hidden rounded-full ${
              isDark ? "bg-gray-700" : "bg-gray-200"
            }`}
            role="progressbar"
            aria-label="Progres aktivitas tugas"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
