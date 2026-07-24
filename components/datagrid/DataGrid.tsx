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
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">

        <GridHeader
          columns={columns}
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSort={onSort}
        />

        <div className="p-8 text-center">
          Loading...
        </div>

      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title="Nothing Found"
        description={emptyMessage}
      />
    );
  }

  return (
    <div
      className="
      rounded-2xl
      overflow-x-auto
      border
      border-slate-200
      dark:border-slate-700
      bg-white
      dark:bg-slate-900
      "
    >

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
          renderMobile={renderMobile}
          onClick={onRowClick}
        />

      ))}

    </div>
  );
}