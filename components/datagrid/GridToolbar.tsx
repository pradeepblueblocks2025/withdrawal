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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#ebe4ff] via-[#f3eeff] to-[#f8f7fc] px-6 py-5 shadow-sm dark:from-[#2a1f5e] dark:via-[#2d2668] dark:to-[#1e293b]">
        <div className="relative z-10 grid grid-cols-1 items-center gap-4 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
          <div className="min-w-0">
            {title && (
              <h2 className="truncate text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {title}
              </h2>
            )}
            {typeof totalRecords === "number" && (
              <p className="mt-1 text-sm font-medium text-violet-500 dark:text-violet-300">
                Total Records: {totalRecords.toLocaleString()}
              </p>
            )}
          </div>

          <div
            className="pointer-events-none relative mx-auto hidden h-[88px] w-[160px] md:block lg:mx-0"
            aria-hidden
          >
            {/* Light mode: blend soft lavender bg into banner */}
            <Image
              src="/withdrawal-banner.png"
              alt=""
              fill
              sizes="160px"
              priority
              className="object-contain object-center scale-110 dark:hidden"
            />
            {/* Dark mode: lift subject, soften light plate behind image */}
            <div className="absolute inset-0 hidden dark:block">
              <div className="absolute inset-3 rounded-full bg-violet-400/15 blur-xl" />
              <Image
                src="/withdrawal-banner.png"
                alt=""
                fill
                sizes="160px"
                priority
                className="object-contain object-center scale-110 mix-blend-screen opacity-95 drop-shadow-[0_8px_20px_rgba(139,92,246,0.35)]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 lg:justify-end">
            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-white dark:text-slate-700"
            >
              <Search size={16} className="text-slate-400" />
              {showFilters ? "Hide Search" : "Show Search"}
              {showFilters ? (
                <ChevronUp size={15} className="text-slate-400" />
              ) : (
                <ChevronDown size={15} className="text-slate-400" />
              )}
              {!showFilters && hasActiveFilters && (
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
              )}
            </button>

            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-white dark:text-slate-700"
            >
              <RotateCw size={16} className="text-slate-400" />
              Refresh
            </button>

            <button
              type="button"
              onClick={onExport}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:grid-cols-2 xl:grid-cols-6 dark:border-slate-800 dark:bg-slate-900">
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
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
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
