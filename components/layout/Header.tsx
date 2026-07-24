"use client";

import {
  Bell,
  Search,
  UserCircle2,
  Menu,
} from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";

interface HeaderProps {
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

export default function Header({
  setMobileOpen,
}: HeaderProps) {
  return (
    <header
      className="
        sticky
        top-0
        z-40
        h-16
        bg-white
        dark:bg-slate-950
        border-b
        border-slate-200
        dark:border-slate-800
        px-6
        flex
        items-center
        justify-between
      "
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="
            lg:hidden h-10 w-10 rounded-lg
            text-slate-700 dark:text-slate-200
            hover:bg-slate-100 dark:hover:bg-slate-800
            flex items-center justify-center
          "
        >
          <Menu size={22} />
        </button>

        <h2 className="font-semibold text-xl text-slate-900 dark:text-white">
          Dashboard
        </h2>
      </div>

      <div
        className="
          hidden md:flex items-center
          bg-slate-100 dark:bg-slate-800
          rounded-xl px-4 py-2 w-80
        "
      >
        <Search
          size={18}
          className="text-slate-500"
        />

        <input
          placeholder="Search..."
          className="
            bg-transparent outline-none ml-3 w-full
            text-slate-900 dark:text-slate-100
            placeholder:text-slate-400
          "
        />
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <ThemeToggle />

        <button
          className="
            relative
            text-slate-600 dark:text-slate-300
            hover:text-slate-900 dark:hover:text-white
          "
        >
          <Bell />
          <span className="absolute -top-1 -right-1 bg-red-500 h-2 w-2 rounded-full" />
        </button>

        <div className="flex items-center gap-2">
          <UserCircle2
            size={36}
            className="text-slate-600 dark:text-slate-300"
          />

          <div className="hidden md:block">
            <p className="font-semibold text-slate-900 dark:text-white">
              Administrator
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Super Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
