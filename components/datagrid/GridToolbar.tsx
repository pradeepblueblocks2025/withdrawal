"use client";

import { useState } from "react";
import Image from "next/image";

import SearchBox from "@/components/common/SearchBox";
import {
  ChevronDown,
  ChevronUp,
  Download,
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
      <div className="relative overflow-hidden rounded-[20px] border border-[#ebe6f8] bg-[#f7f4ff] px-6 py-5 shadow-[0_10px_30px_rgba(124,108,200,0.10)] dark:border-white/5 dark:bg-[#161827] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
        <div className="pointer-events-none absolute inset-0 hidden dark:block bg-gradient-to-r from-violet-600/15 via-transparent to-indigo-500/10" />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-4 lg:gap-6">
            <div className="min-w-0">
              {title && (
                <h2 className="truncate text-[26px] font-bold leading-tight tracking-tight text-[#1a1a2e] dark:text-white">
                  {title}
                </h2>
              )}

              {typeof totalRecords === "number" && (
                <p className="mt-1.5 text-sm font-medium">
                  <span className="text-[#8b7bb8] dark:text-slate-400">
                    Total Records:{" "}
                  </span>
                  <span className="font-semibold text-[#6c5ce7] dark:text-violet-300">
                    {totalRecords.toLocaleString()}
                  </span>
                </p>
              )}
            </div>

            <div
              className="pointer-events-none relative ml-auto hidden h-[96px] w-[160px] shrink-0 sm:block lg:ml-0"
              aria-hidden
            >
              <Image
                src="/withdrawal-banner.png"
                alt=""
                fill
                sizes="160px"
                priority
                className="object-contain object-center scale-110 dark:hidden"
              />
              <div className="absolute inset-0 hidden dark:block">
                <div className="absolute inset-1 rounded-full bg-violet-500/25 blur-2xl" />
                <Image
                  src="/withdrawal-banner.png"
                  alt=""
                  fill
                  sizes="160px"
                  priority
                  className="object-contain object-center scale-110 mix-blend-screen opacity-95 drop-shadow-[0_10px_24px_rgba(139,92,246,0.45)]"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-4 text-sm font-medium text-[#374151] shadow-[0_2px_8px_rgba(15,23,42,0.06)] transition hover:bg-slate-50 dark:border-white/10 dark:bg-[#1c1f30] dark:text-slate-200 dark:shadow-none dark:hover:bg-[#252a40]"
            >
              <Search size={16} className="text-slate-400 dark:text-slate-400" />
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
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-4 text-sm font-medium text-[#374151] shadow-[0_2px_8px_rgba(15,23,42,0.06)] transition hover:bg-slate-50 dark:border-white/10 dark:bg-[#1c1f30] dark:text-slate-200 dark:shadow-none dark:hover:bg-[#252a40]"
            >
              <RotateCw size={16} className="text-slate-400" />
              Refresh
            </button>

            <button
              type="button"
              onClick={onExport}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#6366f1] px-5 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(124,58,237,0.45)] transition hover:opacity-95"
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
