"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/tugas", label: "Tambahkan Tugas" },
  { href: "/statistik", label: "Statistik" },
  { href: "/pengaturan", label: "Pengaturan" },
];

export default function Navigation() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <nav aria-label="Navigasi utama" className="mb-8 flex flex-wrap gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            isDark
              ? "text-gray-300 hover:bg-gray-800 hover:text-gray-100"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
