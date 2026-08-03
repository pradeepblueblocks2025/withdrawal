"use client";

import { ArrowUpDown } from "lucide-react";
import clsx from "clsx";
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
        hidden lg:grid gap-4
        sticky top-0 z-20
        bg-[#f7f8fb]
        dark:bg-[#121626]
        border-b border-slate-100 dark:border-white/5
        rounded-t-2xl
        px-6
        py-4
        items-center
        text-[13px]
        font-semibold
        text-slate-500
        dark:text-slate-300
      "
      style={{
        gridTemplateColumns: columns.map((c) => c.width || "1fr").join(" "),
      }}
    >
      {columns.map((column) => (
        <div key={String(column.key)} className="min-w-0 w-full">
          <button
            type="button"
            disabled={!column.sortable}
            onClick={() => column.sortable && onSort?.(String(column.key))}
            className={clsx(
              "flex w-full items-center gap-1.5 max-w-full text-left",
              column.align === "center" && "justify-center text-center",
              column.align === "right" && "justify-end text-right",
              !column.sortable
                ? "cursor-default"
                : "hover:text-indigo-500 dark:hover:text-indigo-300 cursor-pointer"
            )}
          >
            <span className="truncate">{column.title}</span>

            {column.sortable && (
              <ArrowUpDown
                size={14}
                className={clsx(
                  "shrink-0",
                  sortKey === column.key && "text-indigo-500"
                )}
              />
            )}

            {sortKey === column.key && (
              <span className="text-indigo-500 text-[10px] shrink-0">
                {sortOrder === "asc" ? "↑" : "↓"}
              </span>
            )}
          </button>
        </div>
      ))}
    </div>
  );
}
