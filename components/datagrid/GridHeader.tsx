"use client";

import { ArrowUpDown } from "lucide-react";
import { ReactNode } from "react";

export interface GridColumn<T> {
  key: keyof T | string;
  title: string;
  width?: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  truncate?: boolean;
  render?: (row: T) => ReactNode;
}

interface Props<T> {
  columns: GridColumn<T>[];
  sortKey?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (key: string) => void;
}

export default function GridHeader<T>({
  columns,
  sortKey,
  sortOrder,
  onSort,
}: Props<T>) {
  return (
    <div
      className="
        hidden lg:grid
        sticky top-0 z-20
        bg-[#f7f8fb]
        dark:bg-slate-900
        border-b border-slate-100 dark:border-slate-800
        rounded-t-2xl
        px-6
        py-4
        text-[13px]
        font-semibold
        text-slate-500
      "
      style={{
        gridTemplateColumns: columns.map((c) => c.width || "1fr").join(" "),
      }}
    >
      {columns.map((column) => (
        <button
          key={String(column.key)}
          type="button"
          disabled={!column.sortable}
          onClick={() => column.sortable && onSort?.(String(column.key))}
          className={`
            flex items-center gap-2
            ${column.align === "center" ? "justify-center" : ""}
            ${column.align === "right" ? "justify-end" : ""}
            ${!column.sortable ? "cursor-default" : "hover:text-indigo-600 cursor-pointer"}
          `}
        >
          {column.title}

          {column.sortable && (
            <ArrowUpDown
              size={14}
              className={sortKey === column.key ? "text-indigo-500" : ""}
            />
          )}

          {sortKey === column.key && (
            <span className="text-indigo-500 text-[10px]">
              {sortOrder === "asc" ? "↑" : "↓"}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
