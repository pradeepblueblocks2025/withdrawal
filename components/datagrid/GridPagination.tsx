"use client";

import Button from "@/components/common/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;

  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export default function GridPagination({
  page,
  totalPages,
  totalRecords,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: Props) {
  const start =
    totalRecords === 0
      ? 0
      : (page - 1) * pageSize + 1;

  const end = Math.min(
    page * pageSize,
    totalRecords
  );

  const pages = [];

  let from = Math.max(1, page - 2);
  let to = Math.min(totalPages, page + 2);

  for (let i = from; i <= to; i++) {
    pages.push(i);
  }

  return (
    <div
      className="
      mt-6
      bg-white
      dark:bg-slate-800
      border
      border-slate-200
      dark:border-slate-700
      rounded-2xl
      px-5
      py-4
      flex
      flex-col
      lg:flex-row
      justify-between
      items-center
      gap-4
      "
    >
      {/* Left */}

      <div className="text-sm text-slate-500">
        Showing <b>{start}</b> - <b>{end}</b> of{" "}
        <b>{totalRecords}</b> records
      </div>

      {/* Center */}

      <div className="flex items-center gap-2">

        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() =>
            onPageChange(page - 1)
          }
        >
          <ChevronLeft size={18} />
        </Button>

        {pages.map((item) => (

          <button
            key={item}
            onClick={() =>
              onPageChange(item)
            }
            className={`w-10 h-10 rounded-xl transition
            ${
              page === item
                ? "bg-blue-600 text-white"
                : "bg-slate-100 dark:bg-slate-700 hover:bg-blue-500 hover:text-white"
            }`}
          >
            {item}
          </button>

        ))}

        <Button
          variant="outline"
          disabled={page === totalPages}
          onClick={() =>
            onPageChange(page + 1)
          }
        >
          <ChevronRight size={18} />
        </Button>

      </div>

      {/* Right */}

      <div className="flex items-center gap-2">

        <span className="text-sm text-slate-500">
          Rows
        </span>

        <select
          value={pageSize}
          onChange={(e) =>
            onPageSizeChange?.(
              Number(e.target.value)
            )
          }
          className="
          h-10
          rounded-xl
          border
          border-slate-300
          dark:border-slate-700
          bg-white
          dark:bg-slate-900
          px-3
          "
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>

      </div>

    </div>
  );
}