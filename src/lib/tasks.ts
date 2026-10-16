export type Priority = "low" | "medium" | "high";

export type Task = {
  id: number;
  title: string;
  completed: boolean;
  priority: Priority;
  deadline?: string;
  createdAt: string | null;
  completedAt: string | null;
};

export const TASKS_STORAGE_KEY = "taskflow-tasks";

export const DEFAULT_TASKS: Task[] = [
  {
    id: 1,
    title: "Belajar React",
    completed: false,
    priority: "medium",
    createdAt: null,
    completedAt: null,
  },
  {
    id: 2,
    title: "Membaca buku",
    completed: false,
    priority: "medium",
    createdAt: null,
    completedAt: null,
  },
  {
    id: 3,
    title: "Olahraga",
    completed: false,
    priority: "medium",
    createdAt: null,
    completedAt: null,
  },
];

function isPriority(value: unknown): value is Priority {
  return value === "low" || value === "medium" || value === "high";
}

function validTimestamp(value: unknown): string | null {
  if (typeof value !== "string") return null;
  return Number.isNaN(Date.parse(value)) ? null : value;
}

function createdAtFromLegacyId(id: number): string | null {
  const earliestValidTime = Date.UTC(2000, 0, 1);
  const latestValidTime = Date.now() + 24 * 60 * 60 * 1000;

  if (id < earliestValidTime || id > latestValidTime) return null;
  return new Date(id).toISOString();
}

export function parseStoredTasks(serializedTasks: string): Task[] | null {
  try {
    const value: unknown = JSON.parse(serializedTasks);

    if (!Array.isArray(value)) return null;

    return value.flatMap((item) => {
      if (
        typeof item !== "object" ||
        item === null ||
        !("id" in item) ||
        !("title" in item) ||
        !("completed" in item) ||
        typeof item.id !== "number" ||
        typeof item.title !== "string" ||
        typeof item.completed !== "boolean"
      ) {
        return [];
      }

      const priority =
        "priority" in item && isPriority(item.priority)
          ? item.priority
          : "medium";
      const deadline =
        "deadline" in item && typeof item.deadline === "string"
          ? item.deadline
          : undefined;
      const storedCreatedAt =
        "createdAt" in item ? validTimestamp(item.createdAt) : null;
      const completedAt =
        "completedAt" in item ? validTimestamp(item.completedAt) : null;

      return [
        {
          id: item.id,
          title: item.title,
          completed: item.completed,
          priority,
          deadline,
          createdAt: storedCreatedAt ?? createdAtFromLegacyId(item.id),
          completedAt,
        },
      ];
    });
  } catch {
    return null;
  }
}

export function readTasksFromStorage(): Task[] {
  const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);

  if (!savedTasks) return DEFAULT_TASKS;
  return parseStoredTasks(savedTasks) ?? DEFAULT_TASKS;
}
