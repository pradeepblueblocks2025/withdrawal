"use client";

import { useState } from "react";
import Image from "next/image";

import SearchBox from "@/components/common/SearchBox";
import {
  ChevronDown,
  ChevronUp,
  Download,
  FileDown,
  RotateCw,
  Search,
} from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
}

interface SelectFilter {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

interface GridToolbarProps {
  title?: string;
  totalRecords?: number;
  search: string;
  onSearchChange: (value: string) => void;
  filters?: SelectFilter[];
  onRefresh?: () => void;
  onExport?: () => void;
  children?: React.ReactNode;
}

function WavePattern() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.35] dark:opacity-[0.22]"
      viewBox="0 0 1200 160"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M0,40 C120,10 180,70 300,45 C420,20 480,80 600,50 C720,20 780,75 900,48 C1020,22 1100,65 1200,40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        className="text-violet-300 dark:text-violet-400"
      />
      <path
        d="M0,70 C140,45 200,95 320,68 C440,42 520,100 640,72 C760,44 840,98 960,70 C1080,42 1140,90 1200,68"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-indigo-200 dark:text-indigo-400/70"
      />
      <path
        d="M0,110 C100,90 220,130 340,108 C460,86 540,135 680,112 C820,90 900,138 1040,115 C1120,102 1160,125 1200,118"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-violet-200 dark:text-violet-500/50"
      />
    </svg>
  );
}

export default function GridToolbar({
  title,
  totalRecords,
  search,
  onSearchChange,
  filters = [],
  onRefresh,
  onExport,
  children,
}: GridToolbarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters =
    Boolean(search) || filters.some((filter) => Boolean(filter.value));

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-[#f3f4f6] px-4 py-4 shadow-[0_8px_28px_rgba(15,23,42,0.06)] dark:border-white/5 dark:bg-gradient-to-r dark:from-[#1a1530] dark:via-[#161827] dark:to-[#12141f] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] sm:px-6 sm:py-5">
        <WavePattern />

        <div className="relative z-10 grid grid-cols-1 items-center gap-4 xl:grid-cols-[minmax(0,1fr)_auto_auto]">
          {/* Left: icon + title */}
          <div className="flex min-w-0 items-center gap-3 sm:gap-3.5">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-white text-violet-600 shadow-sm ring-1 ring-slate-200/80 dark:bg-[#252a40] dark:text-violet-300 dark:ring-white/10">
              <FileDown size={20} strokeWidth={2} />
            </div>

            <div className="min-w-0">
              {title && (
                <h2 className="truncate text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-[22px] xl:text-[26px]">
                  {title}
                </h2>
              )}

              {typeof totalRecords === "number" && (
                <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400 sm:mt-1 sm:text-sm">
                  Total Records:{" "}
                  <span className="font-semibold text-violet-600 dark:text-violet-300">
                    {totalRecords.toLocaleString()}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Center: illustration */}
          <div
            className="pointer-events-none relative mx-auto hidden h-[100px] w-[170px] xl:block"
            aria-hidden
          >
            <div className="absolute bottom-1 left-1/2 h-3 w-20 -translate-x-1/2 rounded-full bg-slate-300/50 blur-[2px] dark:bg-violet-500/20" />
            <Image
              src="/withdrawal-banner-new.png"
              alt=""
              fill
              sizes="170px"
              priority
              className="object-contain object-center scale-110 dark:hidden"
            />
            <div className="absolute inset-0 hidden dark:block">
              <Image
                src="/withdrawal-banner-new.png"
                alt=""
                fill
                sizes="170px"
                priority
                className="object-contain object-center scale-110 mix-blend-screen opacity-95 drop-shadow-[0_8px_20px_rgba(139,92,246,0.35)]"
              />
            </div>
          </div>

          {/* Right: actions */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-2.5 xl:justify-end">
            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className="col-span-2 inline-flex h-10 sm:h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 sm:px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/15 dark:bg-transparent dark:text-slate-200 dark:hover:bg-white/5"
            >
              <Search size={16} className="text-slate-400" />
              {showFilters ? "Hide Search" : "Show Search"}
              {showFilters ? (
                <ChevronUp size={15} className="text-slate-400" />
              ) : (
                <ChevronDown size={15} className="text-slate-400" />
              )}
              {!showFilters && hasActiveFilters && (
                <span className="h-2 w-2 rounded-full bg-violet-500" />
              )}
            </button>

            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex h-10 sm:h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 sm:px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/15 dark:bg-transparent dark:text-slate-200 dark:hover:bg-white/5"
            >
              <RotateCw size={16} className="text-slate-400" />
              Refresh
            </button>

            <button
              type="button"
              onClick={onExport}
              className="inline-flex h-10 sm:h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-3 sm:px-5 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(124,58,237,0.35)] transition hover:opacity-95"
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:grid-cols-2 xl:grid-cols-6 dark:border-white/5 dark:bg-[#161827]">
          <div className="xl:col-span-2">
            <SearchBox
              value={search}
              onChange={onSearchChange}
              placeholder="Search..."
            />
          </div>

          {filters.map((filter, index) => (
            <select
              key={index}
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 dark:border-white/10 dark:bg-[#1c1f30] dark:text-slate-200"
            >
              <option value="">{filter.label}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ))}

          {children}
        </div>
      )}
    </div>
  );
}
