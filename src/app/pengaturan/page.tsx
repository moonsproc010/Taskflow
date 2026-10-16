"use client";

import Navigation from "@/components/Navigation";
import { useTheme } from "@/components/ThemeProvider";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

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
          Pengaturan
        </h1>

        <section
          className={`mt-6 rounded-xl border p-5 ${
            isDark
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <h2
            className={`text-lg font-semibold ${
              isDark ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Tampilan
          </h2>
          <p
            className={`mt-1 text-sm ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Tema Aplikasi
          </p>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => setTheme("light")}
              aria-label="Gunakan tema terang"
              aria-pressed={theme === "light"}
              className={`flex h-11 w-11 items-center justify-center rounded-lg border transition-colors ${
                theme === "light"
                  ? "border-blue-600 bg-blue-600 text-white"
                  : isDark
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-600 hover:bg-gray-100"
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
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => setTheme("dark")}
              aria-label="Gunakan tema gelap"
              aria-pressed={theme === "dark"}
              className={`flex h-11 w-11 items-center justify-center rounded-lg border transition-colors ${
                theme === "dark"
                  ? "border-blue-600 bg-blue-600 text-white"
                  : isDark
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-600 hover:bg-gray-100"
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
                <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
              </svg>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
