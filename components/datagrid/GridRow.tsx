"use client";

import { ReactNode } from "react";
import clsx from "clsx";
import { GridColumn } from "./GridHeader";

interface Props<T> {
  row: T;
  columns: GridColumn<T>[];
  mode?: "desktop" | "mobile";
  renderMobile?: (row: T) => ReactNode;
  onClick?: (row: T) => void;
}

export default function GridRow<T>({
  row,
  columns,
  mode = "desktop",
  renderMobile,
  onClick,
}: Props<T>) {
  if (mode === "desktop") {
    return (
      <div
        onClick={() => onClick?.(row)}
        className="
          grid gap-4
          px-6 py-5
          items-center
          border-b border-slate-100 dark:border-white/5
          hover:bg-slate-50/80 dark:hover:bg-white/[0.03]
          transition-colors
          last:border-b-0
        "
        style={{
          gridTemplateColumns: columns.map((c) => c.width || "1fr").join(" "),
        }}
      >
        {columns.map((column) => (
          <div
            key={String(column.key)}
            className={clsx(
              "min-w-0",
              column.truncate !== false && "truncate",
              column.align === "center" && "text-center",
              column.align === "right" && "text-right"
            )}
          >
            {"render" in column && column.render
              ? column.render(row)
              : String(row[column.key as keyof T])}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      onClick={() => onClick?.(row)}
      className="
        overflow-hidden
        rounded-2xl
        border border-slate-200/80
        bg-white
        shadow-[0_4px_18px_rgba(15,23,42,0.04)]
        dark:border-white/10
        dark:bg-[#161827]
        dark:shadow-[0_8px_24px_rgba(0,0,0,0.25)]
      "
    >
      {renderMobile ? (
        renderMobile(row)
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-white/5">
          {columns.map((column) => (
            <div
              key={String(column.key)}
              className="flex items-start justify-between gap-4 px-4 py-3"
            >
              <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 pt-0.5">
                {column.title}
              </span>
              <div className="min-w-0 max-w-[70%] text-right text-sm text-slate-800 dark:text-slate-100">
                {"render" in column && column.render
                  ? column.render(row)
                  : String(row[column.key as keyof T])}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
