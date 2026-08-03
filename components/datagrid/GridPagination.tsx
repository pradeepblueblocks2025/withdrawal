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
  const start = totalRecords === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalRecords);

  const pages = [];
  const from = Math.max(1, page - 2);
  const to = Math.min(totalPages, page + 2);

  for (let i = from; i <= to; i++) {
    pages.push(i);
  }

  return (
    <div className="mt-5 px-1 py-2 flex flex-col lg:flex-row justify-between items-center gap-4">
      <div className="text-sm text-slate-500">
        Showing <span className="font-semibold text-slate-700 dark:text-slate-200">{start}</span> -{" "}
        <span className="font-semibold text-slate-700 dark:text-slate-200">{end}</span> of{" "}
        <span className="font-semibold text-slate-700 dark:text-slate-200">{totalRecords}</span>{" "}
        records
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="!h-10 !w-10 !px-0"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft size={18} />
        </Button>

        {pages.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            className={`w-10 h-10 rounded-xl text-sm font-semibold transition cursor-pointer ${
              page === item
                ? "bg-indigo-500 text-white shadow-sm shadow-indigo-200"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
            }`}
          >
            {item}
          </button>
        ))}

        <Button
          variant="outline"
          className="!h-10 !w-10 !px-0"
          disabled={page === totalPages || totalPages === 0}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight size={18} />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500">Rows per page</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
          className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-700 dark:text-slate-200"
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
