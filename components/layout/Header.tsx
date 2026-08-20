"use client";

import { Bell, Search, Menu, ExternalLink } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";

const BSCSCAN_TRANSACTIONS_URL =
  "https://bscscan.com/token/0xc968f1c545f2714c3140208e1e0adbf1958f2ff7?a=0xE36e5c017373486bcA2bCD733F23bbB697E16102#transactions";

interface HeaderProps {
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({ setMobileOpen }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 h-[72px] bg-white/90 dark:bg-[#0b0c14]/95 backdrop-blur border-b border-slate-100 dark:border-white/5 px-6 lg:px-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="h-10 w-10 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center cursor-pointer lg:hidden"
        >
          <Menu size={22} />
        </button>

        <h2 className="font-semibold text-xl text-slate-900 dark:text-white tracking-tight">
          Dashboard
        </h2>
      </div>

      <div className="hidden md:flex items-center bg-slate-50 dark:bg-[#161827] rounded-full px-4 py-2.5 w-full max-w-md border border-slate-100 dark:border-white/5">
        <Search size={18} className="text-slate-400 shrink-0" />
        <input
          placeholder="Search here..."
          className="bg-transparent outline-none ml-3 w-full text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <a
          href={BSCSCAN_TRANSACTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          title="View BscScan transactions"
          className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 sm:px-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-[#161827] dark:text-slate-200 dark:hover:bg-white/5"
        >
          <ExternalLink size={16} className="shrink-0 text-violet-500" />
          <span className="hidden sm:inline">BscScan</span>
        </a>

        <ThemeToggle />

        <button
          type="button"
          className="relative h-10 w-10 rounded-full bg-slate-50 dark:bg-[#161827] flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer border border-transparent dark:border-white/5"
        >
          <Bell size={18} />
          <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center">
            3
          </span>
        </button>

        <div className="flex items-center gap-2.5 pl-1">
          <div className="h-10 w-10 rounded-full brand-gradient text-white text-sm font-bold flex items-center justify-center shadow-sm shadow-violet-500/30">
            AD
          </div>

          <div className="hidden md:block">
            <p className="font-semibold text-sm text-slate-900 dark:text-white leading-tight">
              Administrator
            </p>
            <p className="text-xs text-slate-400 dark:text-violet-300/80 leading-tight">
              Super Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
