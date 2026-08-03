"use client";

import { useState } from "react";

import Button from "@/components/common/Button";
import SearchBox from "@/components/common/SearchBox";
import {
  ChevronDown,
  ChevronUp,
  Download,
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
      <div className="flex flex-col xl:flex-row xl:items-stretch gap-4">
        <div className="banner-gradient relative overflow-hidden rounded-2xl px-6 py-5 flex-1 min-h-[110px] flex items-center justify-between gap-4 border border-violet-100/70 dark:border-violet-500/20">
          <div className="relative z-10">
            {title && (
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {title}
              </h2>
            )}

            {typeof totalRecords === "number" && (
              <p className="text-sm text-slate-500 dark:text-slate-300 mt-1.5 font-medium">
                Total Records: {totalRecords}
              </p>
            )}
          </div>

          <div className="relative z-10 hidden sm:flex h-16 w-16 rounded-2xl bg-white/70 dark:bg-white/10 items-center justify-center text-violet-500 shadow-sm">
            <Wallet size={30} />
          </div>

          <div className="pointer-events-none absolute -right-6 -bottom-8 h-32 w-32 rounded-full bg-white/40 dark:bg-white/5 blur-xl" />
        </div>

        <div className="flex flex-wrap items-center gap-3 xl:justify-end">
          <Button
            variant="secondary"
            onClick={() => setShowFilters((prev) => !prev)}
          >
            <Search size={18} />
            {showFilters ? "Hide Search" : "Show Search"}
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {!showFilters && hasActiveFilters && (
              <span className="h-2 w-2 rounded-full bg-indigo-500" aria-hidden />
            )}
          </Button>

          <Button variant="secondary" onClick={onRefresh}>
            <RotateCw size={18} />
            Refresh
          </Button>

          <Button variant="primary" onClick={onExport}>
            <Download size={18} />
            Export
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3 shadow-sm">
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
              className="h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-700 dark:text-slate-200"
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
