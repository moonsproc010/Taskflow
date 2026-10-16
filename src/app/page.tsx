"use client";

import Navigation from "@/components/Navigation";
import { useTheme } from "@/components/ThemeProvider";

export default function HomePage() {
  const { theme } = useTheme();
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
          Beranda
        </h1>
        <p className={`mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Selamat datang di TaskFlow.
        </p>
      </div>
    </main>
  );
}
