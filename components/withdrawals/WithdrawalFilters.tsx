"use client";

import { Search, CalendarDays, Download, RotateCcw } from "lucide-react";

interface Props {
  search: string;
  walletType: string;
  status: string;
  fromDate: string;
  toDate: string;

  onSearchChange: (value: string) => void;
  onWalletTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;

  onReset: () => void;
  onExport: () => void;
}

export default function WithdrawalFilters({
  search,
  walletType,
  status,
  fromDate,
  toDate,
  onSearchChange,
  onWalletTypeChange,
  onStatusChange,
  onFromDateChange,
  onToDateChange,
  onReset,
  onExport,
}: Props) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">

        <div className="relative lg:col-span-2">
          <Search
            className="absolute left-3 top-3.5 text-gray-400"
            size={18}
          />

          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="w-full h-11 pl-10 rounded-lg border dark:bg-slate-900"
          />
        </div>

        <select
          value={walletType}
          onChange={(e) => onWalletTypeChange(e.target.value)}
          className="h-11 rounded-lg border dark:bg-slate-900"
        >
          <option value="">Wallet Type</option>
          <option value="staking">Staking</option>
          <option value="affiliate">Affiliate</option>
        </select>

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="h-11 rounded-lg border dark:bg-slate-900"
        >
          <option value="">Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <input
          type="date"
          value={fromDate}
          onChange={(e) => onFromDateChange(e.target.value)}
          className="h-11 rounded-lg border dark:bg-slate-900 px-3"
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => onToDateChange(e.target.value)}
          className="h-11 rounded-lg border dark:bg-slate-900 px-3"
        />

      </div>

      <div className="flex justify-end gap-3 mt-5">

        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 h-11 border rounded-lg"
        >
          <RotateCcw size={16} />
          Reset
        </button>

        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 h-11 rounded-lg bg-blue-600 text-white"
        >
          <Download size={16} />
          Export
        </button>

      </div>

    </div>
  );
}