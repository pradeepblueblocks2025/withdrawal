"use client";

import { ReactNode } from "react";
import clsx from "clsx";
import { GridColumn } from "./GridHeader";

interface Props<T> {
  row: T;
  columns: GridColumn<T>[];
  renderMobile?: (row: T) => ReactNode;
  onClick?: (row: T) => void;
}

export default function GridRow<T>({
  row,
  columns,
  renderMobile,
  onClick,
}: Props<T>) {
  return (
    <>
      <div
        onClick={() => onClick?.(row)}
        className="
          hidden lg:grid gap-4
          px-6 py-5
          items-center
          border-b border-slate-100 dark:border-slate-800
          hover:bg-slate-50/80 dark:hover:bg-slate-800/40
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

      <div
        onClick={() => onClick?.(row)}
        className="
          lg:hidden
          bg-white dark:bg-slate-800
          rounded-xl
          border border-slate-100 dark:border-slate-700
          p-4 mb-3
        "
      >
        {renderMobile ? (
          renderMobile(row)
        ) : (
          <div className="space-y-3">
            {columns.map((column) => (
              <div
                key={String(column.key)}
                className="flex justify-between gap-5"
              >
                <span className="text-slate-500 text-sm">{column.title}</span>
                <div className="text-right">
                  {"render" in column && column.render
                    ? column.render(row)
                    : String(row[column.key as keyof T])}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
