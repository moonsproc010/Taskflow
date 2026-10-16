"use client";

import { useEffect, useRef, useState } from "react";
import Navigation from "@/components/Navigation";
import TaskCalendar from "@/components/TaskCalendar";
import { useTheme } from "@/components/ThemeProvider";
import {
  DEFAULT_TASKS,
  parseStoredTasks,
  TASKS_STORAGE_KEY,
  type Priority,
  type Task,
} from "@/lib/tasks";

type Filter = "all" | "active" | "completed";
const DEADLINE_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
});
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export default function TasksPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [newTask, setNewTask] = useState("");
  const [newTaskPriority, setNewTaskPriority] =
    useState<Priority>("medium");
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [hasDeadline, setHasDeadline] = useState(false);
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("");
  const [deadlineError, setDeadlineError] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const hasLoadedTasks = useRef(false);
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);

  useEffect(() => {
    const loadTasks = window.setTimeout(() => {
      const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);

      if (savedTasks) {
        const parsedTasks = parseStoredTasks(savedTasks);

        if (parsedTasks) {
          setTasks(parsedTasks);
        }
      } else {
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(DEFAULT_TASKS));
      }

      hasLoadedTasks.current = true;
    }, 0);

    return () => window.clearTimeout(loadTasks);
  }, []);

  useEffect(() => {
    if (hasLoadedTasks.current) {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks]);

  function addTask() {
    const task = newTask.trim();

    if (!task) return;

    let deadline: string | undefined;

    if (hasDeadline) {
      if (!deadlineDate) {
        setDeadlineError("Pilih tanggal deadline.");
        return;
      }

      if (!TIME_PATTERN.test(deadlineTime)) {
        setDeadlineError("Masukkan waktu dengan format HH:MM, misalnya 20:30.");
        return;
      }

      const selectedDeadline = new Date(`${deadlineDate}T${deadlineTime}:00`);

      if (Number.isNaN(selectedDeadline.getTime())) {
        setDeadlineError("Tanggal atau waktu deadline tidak valid.");
        return;
      }

      deadline = selectedDeadline.toISOString();
    }

    const createdAt = new Date().toISOString();

    setTasks((currentTasks) => [
      ...currentTasks,
      {
        id: Date.now(),
        title: task,
        completed: false,
        priority: newTaskPriority,
        deadline,
        createdAt,
        completedAt: null,
      },
    ]);
    setNewTask("");
    setNewTaskPriority("medium");
    setIsPriorityOpen(false);
    setHasDeadline(false);
    setDeadlineDate("");
    setDeadlineTime("");
    setDeadlineError("");
  }

  function toggleTask(taskId: number) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              completedAt: task.completed ? null : new Date().toISOString(),
            }
          : task,
      ),
    );
  }

  function deleteTask(taskId: number) {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    );
  }

  function closeSearch() {
    setIsSearchOpen(false);
    setSearchQuery("");
  }

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "active") return !task.completed;
      if (filter === "completed") return task.completed;
      return true;
    })
    .filter((task) =>
      task.title.toLowerCase().includes(searchQuery.trim().toLowerCase()),
    );

  const filters: { value: Filter; label: string }[] = [
    { value: "all", label: "Semua" },
    { value: "active", label: "Aktif" },
    { value: "completed", label: "Selesai" },
  ];

  return (
    <main
      className={`min-h-screen flex items-center justify-center p-6 transition-colors ${
        isDark ? "bg-gray-950" : "bg-gray-100"
      }`}
    >
      <div
        className={`w-full max-w-lg rounded-2xl shadow-lg p-6 transition-colors sm:p-8 ${
          isDark ? "bg-gray-900" : "bg-white"
        }`}
      >
        <Navigation />

        <div>
          <div>
            <h1
              className={`text-3xl font-bold ${
                isDark ? "text-gray-50" : "text-gray-900"
              }`}
            >
              TaskFlow
            </h1>

            <p className={`mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Kelola aktivitasmu dengan lebih sederhana.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <input
            type="text"
            placeholder="Tulis tugas baru..."
            value={newTask}
            onChange={(event) => setNewTask(event.target.value)}
            className={`w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 ${
              isDark
                ? "border-gray-700 bg-gray-800 text-gray-100 placeholder:text-gray-500"
                : "border-gray-300 bg-white text-gray-900 placeholder:text-gray-400"
            }`}
          />

          {!isPriorityOpen && (
            <button
              type="button"
              onClick={() => setIsPriorityOpen(true)}
              className={`mt-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isDark
                  ? "text-blue-400 hover:bg-gray-800"
                  : "text-blue-600 hover:bg-blue-50"
              }`}
            >
              + Tentukan prioritas
            </button>
          )}

          <div
            className={`grid transition-all duration-300 ease-out ${
              isPriorityOpen
                ? "mt-3 grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <label
                className={`mb-2 block text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
                htmlFor="task-priority"
              >
                Prioritas
              </label>
              <select
                id="task-priority"
                value={newTaskPriority}
                onChange={(event) =>
                  setNewTaskPriority(event.target.value as Priority)
                }
                tabIndex={isPriorityOpen ? 0 : -1}
                className={`w-full rounded-lg border px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? "border-gray-700 bg-gray-800 text-gray-100"
                    : "border-gray-300 bg-white text-gray-900"
                }`}
              >
                <option value="low">Rendah</option>
                <option value="medium">Sedang</option>
                <option value="high">Tinggi</option>
              </select>
            </div>
          </div>

          <label
            className={`mt-4 inline-flex cursor-pointer items-center gap-2 text-sm ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <input
              type="checkbox"
              checked={hasDeadline}
              onChange={(event) => {
                setHasDeadline(event.target.checked);

                if (!event.target.checked) {
                  setDeadlineDate("");
                  setDeadlineTime("");
                  setDeadlineError("");
                }
              }}
              className="h-4 w-4 accent-blue-600"
            />
            Tambahkan deadline
          </label>

          <div
            className={`grid transition-all duration-300 ease-out ${
              hasDeadline
                ? "mt-3 grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className={`overflow-hidden ${hasDeadline ? "visible" : "invisible"}`}>
              <TaskCalendar
                value={deadlineDate}
                onChange={(date) => {
                  setDeadlineDate(date);
                  setDeadlineError("");
                }}
                isDark={isDark}
              />

              <label
                htmlFor="deadline-time"
                className={`mt-3 mb-2 block text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Waktu
              </label>
              <input
                id="deadline-time"
                type="text"
                inputMode="numeric"
                maxLength={5}
                value={deadlineTime}
                onChange={(event) => {
                  const value = event.target.value;

                  if (/^[0-9:]{0,5}$/.test(value)) {
                    setDeadlineTime(value);
                    setDeadlineError("");
                  }
                }}
                onBlur={() => {
                  if (deadlineTime && !TIME_PATTERN.test(deadlineTime)) {
                    setDeadlineError(
                      "Masukkan waktu dengan format HH:MM, misalnya 20:30.",
                    );
                  }
                }}
                placeholder="HH:MM"
                aria-describedby={deadlineError ? "deadline-error" : undefined}
                tabIndex={hasDeadline ? 0 : -1}
                className={`w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? "border-gray-700 bg-gray-800 text-gray-100 placeholder:text-gray-500"
                    : "border-gray-300 bg-white text-gray-900 placeholder:text-gray-400"
                }`}
              />

              {deadlineError && (
                <p id="deadline-error" className="mt-2 text-sm text-red-500">
                  {deadlineError}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={addTask}
            className="mt-4 w-full rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Tambah
          </button>
        </div>

        <div className="mt-4 flex justify-end">
          <div
            className={`relative flex items-center overflow-hidden transition-all duration-300 ease-out ${
              isSearchOpen ? "w-full gap-2 opacity-100" : "w-10 gap-0 opacity-100"
            }`}
          >
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Buka pencarian task"
              tabIndex={isSearchOpen ? -1 : 0}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                isSearchOpen
                  ? "pointer-events-none absolute opacity-0"
                  : isDark
                    ? "border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
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
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
            </button>

            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Cari task..."
              aria-label="Cari task berdasarkan judul"
              tabIndex={isSearchOpen ? 0 : -1}
              className={`min-w-0 flex-1 rounded-lg border px-4 py-2 outline-none transition-opacity duration-300 focus:ring-2 focus:ring-blue-500 ${
                isSearchOpen ? "opacity-100" : "pointer-events-none opacity-0"
              } ${
                isDark
                  ? "border-gray-700 bg-gray-800 text-gray-100 placeholder:text-gray-500"
                  : "border-gray-300 bg-white text-gray-900 placeholder:text-gray-400"
              }`}
            />

            <button
              type="button"
              onClick={closeSearch}
              aria-label="Tutup pencarian task"
              tabIndex={isSearchOpen ? 0 : -1}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-opacity duration-300 ${
                isSearchOpen
                  ? isDark
                    ? "border-gray-700 bg-gray-800 text-gray-300 opacity-100 hover:bg-gray-700"
                    : "border-gray-300 bg-white text-gray-600 opacity-100 hover:bg-gray-100"
                  : "pointer-events-none opacity-0"
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
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-6 flex gap-2" aria-label="Filter task">
          {filters.map((item) => {
            const isActive = filter === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
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

        <div className="mt-5 space-y-3">

          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`flex flex-wrap items-center gap-3 rounded-lg border p-4 sm:flex-nowrap ${
                isDark
                  ? "border-gray-700 bg-gray-800 text-gray-100"
                  : "border-gray-200 bg-gray-50 text-gray-900"
              }`}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                aria-label={`Tandai ${task.title} sebagai ${
                  task.completed ? "belum selesai" : "selesai"
                }`}
                className="h-5 w-5 shrink-0 accent-blue-600"
              />

              <div className="min-w-0 flex-1">
                <p
                  className={`break-words ${
                    task.completed
                      ? `line-through ${isDark ? "text-gray-500" : "text-gray-400"}`
                      : ""
                  }`}
                >
                  {task.title}
                </p>

                {task.deadline && (
                  <p
                    className={`mt-1 text-xs ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Deadline: {DEADLINE_FORMATTER.format(new Date(task.deadline))}
                  </p>
                )}
              </div>

              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                  task.priority === "high"
                    ? isDark
                      ? "bg-red-950 text-red-300"
                      : "bg-red-100 text-red-700"
                    : task.priority === "medium"
                      ? isDark
                        ? "bg-yellow-950 text-yellow-300"
                        : "bg-yellow-100 text-yellow-700"
                      : isDark
                        ? "bg-green-950 text-green-300"
                        : "bg-green-100 text-green-700"
                }`}
              >
                {task.priority === "high"
                  ? "Tinggi"
                  : task.priority === "medium"
                    ? "Sedang"
                    : "Rendah"}
              </span>

              <button
                type="button"
                onClick={() => deleteTask(task.id)}
                aria-label={`Hapus ${task.title}`}
                className={`shrink-0 rounded-md px-3 py-1.5 text-sm font-medium ${
                  isDark
                    ? "text-red-400 hover:bg-red-950"
                    : "text-red-600 hover:bg-red-50"
                }`}
              >
                Hapus
              </button>
            </div>
          ))}

        </div>

      </div>
    </main>
  );
}
