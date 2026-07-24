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
        bg-slate-100
        dark:bg-slate-900
        border-b
        border-slate-200
        dark:border-slate-700
        rounded-t-2xl
        px-5
        py-3
        text-xs
        uppercase
        tracking-wider
        font-semibold
        text-slate-500
      "
      style={{
        gridTemplateColumns: columns
          .map((c) => c.width || "1fr")
          .join(" "),
      }}
    >
      {columns.map((column) => (
        <button
          key={String(column.key)}
          disabled={!column.sortable}
          onClick={() =>
            column.sortable &&
            onSort?.(String(column.key))
          }
          className={`
            flex items-center gap-2
            ${column.align === "center" ? "justify-center" : ""}
            ${column.align === "right" ? "justify-end" : ""}
            ${!column.sortable ? "cursor-default" : "hover:text-blue-600"}
          `}
        >
          {column.title}

          {column.sortable && (
            <ArrowUpDown
              size={14}
              className={
                sortKey === column.key
                  ? "text-blue-500"
                  : ""
              }
            />
          )}

          {sortKey === column.key && (
            <span className="text-blue-500 text-[10px]">
              {sortOrder === "asc"
                ? "↑"
                : "↓"}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}