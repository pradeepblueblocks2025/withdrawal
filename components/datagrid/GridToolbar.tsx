"use client";

import { useState } from "react";

import Button from "@/components/common/Button";
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
      <div className="relative overflow-hidden rounded-2xl border border-violet-100/80 bg-gradient-to-r from-[#efe9ff] via-[#f7f4ff] to-white px-6 py-6 shadow-[0_8px_30px_rgba(99,102,241,0.08)] dark:border-violet-500/20 dark:from-[#2e1065] dark:via-[#312e81] dark:to-slate-900">
        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            {title && (
              <h2 className="text-[26px] font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
                {title}
              </h2>
            )}

            {typeof totalRecords === "number" && (
              <p className="mt-2 text-sm font-medium text-violet-500 dark:text-violet-300">
                Total Records: {totalRecords}
              </p>
            )}
          </div>

          <div className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-end gap-1 opacity-90 md:flex lg:static lg:translate-x-0 lg:translate-y-0 lg:opacity-100">
            <div className="relative flex h-20 w-28 items-end justify-center">
              <div className="absolute bottom-2 left-1 h-10 w-10 rounded-xl bg-amber-300/90 shadow-md" />
              <div className="absolute bottom-4 left-5 h-8 w-8 rounded-full bg-amber-400 shadow" />
              <div className="relative z-10 flex h-14 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-lg shadow-violet-300/50">
                <Wallet size={26} />
              </div>
              <div className="absolute -right-1 bottom-6 flex h-9 w-8 items-center justify-center rounded-lg bg-white text-violet-500 shadow-md">
                <FileText size={16} />
              </div>
              <Coins
                size={18}
                className="absolute -left-1 top-1 text-amber-400 drop-shadow"
              />
            </div>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-3 lg:justify-end">
            <Button
              variant="secondary"
              className="!h-11 !rounded-full !bg-white !px-5 shadow-sm"
              onClick={() => setShowFilters((prev) => !prev)}
            >
              <Search size={18} />
              {showFilters ? "Hide Search" : "Show Search"}
              {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {!showFilters && hasActiveFilters && (
                <span
                  className="h-2 w-2 rounded-full bg-indigo-500"
                  aria-hidden
                />
              )}
            </Button>

            <Button
              variant="secondary"
              className="!h-11 !rounded-full !bg-white !px-5 shadow-sm"
              onClick={onRefresh}
            >
              <RotateCw size={18} />
              Refresh
            </Button>

            <Button
              variant="primary"
              className="!h-11 !rounded-full !px-6"
              onClick={onExport}
            >
              <Download size={18} />
              Export
            </Button>
          </div>
        </div>

        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/50 blur-2xl dark:bg-white/5" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-24 w-40 rounded-full bg-violet-200/40 blur-2xl dark:bg-violet-500/10" />
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
