"use client";

import { useState } from "react";

import Button from "@/components/common/Button";
import SearchBox from "@/components/common/SearchBox";
import { ChevronDown, ChevronUp, Download, RotateCw, Search } from "lucide-react";

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
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-5">

      {/* Top */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">

        <div>

          {title && (
            <h2 className="text-xl font-bold">
              {title}
            </h2>
          )}

          {typeof totalRecords === "number" && (
            <p className="text-sm text-slate-500 mt-1">
              Total Records : {totalRecords}
            </p>
          )}

        </div>

        <div className="flex flex-wrap gap-3">

          <Button
            variant="secondary"
            onClick={() => setShowFilters((prev) => !prev)}
          >
            <Search size={18} />
            {showFilters ? "Hide Search" : "Show Search"}
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {!showFilters && hasActiveFilters && (
              <span className="h-2 w-2 rounded-full bg-blue-500" aria-hidden />
            )}
          </Button>

          <Button
            variant="secondary"
            onClick={onRefresh}
          >
            <RotateCw size={18} />

            Refresh
          </Button>

          <Button
            variant="primary"
            onClick={onExport}
          >
            <Download size={18} />

            Export
          </Button>

        </div>

      </div>

      {/* Filters — hidden on initial load */}

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">

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
              onChange={(e) =>
                filter.onChange(e.target.value)
              }
              className="
                h-11
                rounded-xl
                border
                border-slate-300
                dark:border-slate-700
                bg-white
                dark:bg-slate-900
                px-3
                text-sm
              "
            >
              <option value="">
                {filter.label}
              </option>

              {filter.options.map((option) => (

                <option
                  key={option.value}
                  value={option.value}
                >
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
