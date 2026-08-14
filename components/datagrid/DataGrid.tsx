"use client";

import { ReactNode } from "react";
import EmptyState from "@/components/common/EmptyState";
import GridHeader, { GridColumn } from "./GridHeader";
import GridRow from "./GridRow";

interface Props<T> {
  columns: GridColumn<T>[];
  data: T[];
  loading?: boolean;
  sortKey?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (key: string) => void;
  renderMobile?: (row: T) => ReactNode;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

export default function DataGrid<T>({
  columns,
  data,
  loading = false,
  sortKey,
  sortOrder,
  onSort,
  renderMobile,
  onRowClick,
  emptyMessage = "No Records Found",
}: Props<T>) {
  if (loading) {
    return (
      <>
        <div className="hidden xl:block rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-[#161827] shadow-sm">
          <GridHeader
            columns={columns}
            sortKey={sortKey}
            sortOrder={sortOrder}
            onSort={onSort}
          />
          <div className="p-10 text-center text-sm text-slate-500 dark:text-slate-300">
            Loading...
          </div>
        </div>
        <div className="xl:hidden space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[148px] animate-pulse rounded-2xl border border-slate-100 bg-white dark:border-white/5 dark:bg-[#161827]"
            />
          ))}
        </div>
      </>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState title="Nothing Found" description={emptyMessage} />
    );
  }

  return (
    <>
      {/* Desktop / large tablet table */}
      <div className="hidden xl:block rounded-2xl overflow-x-auto border border-slate-100 dark:border-white/5 bg-white dark:bg-[#161827] shadow-sm">
        <GridHeader
          columns={columns}
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSort={onSort}
        />

        {data.map((row, index) => (
          <GridRow
            key={index}
            row={row}
            columns={columns}
            mode="desktop"
            onClick={onRowClick}
          />
        ))}
      </div>

      {/* Mobile / iPad card list */}
      <div className="xl:hidden space-y-3">
        {data.map((row, index) => (
          <GridRow
            key={index}
            row={row}
            columns={columns}
            mode="mobile"
            renderMobile={renderMobile}
            onClick={onRowClick}
          />
        ))}
      </div>
    </>
  );
}
