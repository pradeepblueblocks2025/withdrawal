"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        mounted && theme === "dark"
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      title={
        mounted && theme === "dark"
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      className="
        h-10 w-10 rounded-full
        flex items-center justify-center
        text-slate-500 dark:text-slate-300
        bg-slate-50 dark:bg-slate-800
        hover:bg-slate-100 dark:hover:bg-slate-700
        transition cursor-pointer
      "
    >
      {!mounted ? (
        <Sun size={20} className="opacity-0" />
      ) : theme === "dark" ? (
        <Sun size={20} />
      ) : (
        <Moon size={20} />
      )}
    </button>
  );
}
