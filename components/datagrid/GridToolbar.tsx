"use client";

import { useState } from "react";

import SearchBox from "@/components/common/SearchBox";
import {
  ChevronDown,
  ChevronUp,
  Coins,
  Download,
  FileText,
  RotateCw,
  Search,
  Wallet,
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
      <div className="rounded-2xl bg-gradient-to-r from-[#ebe4ff] via-[#f3eeff] to-[#f8f7fc] px-6 py-5 shadow-sm dark:from-[#2a1f5e] dark:via-[#2d2668] dark:to-[#1e293b]">
        <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-[minmax(0,1fr)_140px_auto]">
          {/* Left: title */}
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

          {/* Center: simple graphic */}
          <div className="hidden items-center justify-center lg:flex" aria-hidden>
            <div className="relative h-14 w-24">
              <span className="absolute left-0 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-300 text-amber-700 shadow-sm">
                <Coins size={16} />
              </span>
              <span className="absolute left-7 top-0 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-md">
                <Wallet size={22} />
              </span>
              <span className="absolute right-0 top-4 flex h-8 w-7 items-center justify-center rounded-md bg-white text-violet-500 shadow-sm dark:bg-slate-100">
                <FileText size={14} />
              </span>
            </div>
          </div>

          {/* Right: actions */}
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
