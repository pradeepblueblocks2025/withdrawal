"use client";

import {
  CheckCircle2,
  Copy,
  Eye,
  User,
  Wallet,
  CalendarDays,
  XCircle,
  MoreVertical,
} from "lucide-react";

import Badge from "@/components/common/Badge";

interface Props {
  withdrawal: any;
}

function statusVariant(
  status: string
): "success" | "warning" | "danger" | "secondary" | "info" {
  switch (status) {
    case "approved":
      return "success";
    case "pending":
      return "warning";
    case "hold":
      return "info";
    case "rejected":
      return "danger";
    default:
      return "secondary";
  }
}

export default function WithdrawalRow({
  withdrawal,
}: Props) {

    const copyAddress = () => {
    navigator.clipboard.writeText(withdrawal.walletAddress);
  };
  return (
    <div
      className="bg-white dark:bg-slate-800
      rounded-xl border border-slate-200
      dark:border-slate-700
      hover:border-blue-500
      transition
      p-5"
    >
      {/* Desktop */}

      <div className="hidden lg:block">

        {/* Header */}

        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">

          <div className="flex items-center gap-3">

            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">

              {withdrawal.withdrawalId}

            </h3>

          </div>

          <div className="flex items-center gap-5">

            <Badge variant={statusVariant(withdrawal.status)}>
              {withdrawal.status}
            </Badge>

            <div className="flex items-center gap-2">

              <button
                className="
                w-10
                h-10
                rounded-xl
                bg-blue-500/10
                hover:bg-blue-500
                text-blue-400
                hover:text-white
                transition
                flex
                items-center
                justify-center
                "
              >
                <Eye size={18} />
              </button>

              <button
                className="
                w-10
                h-10
                rounded-xl
                bg-green-500/10
                hover:bg-green-500
                text-green-400
                hover:text-white
                transition
                flex
                items-center
                justify-center
                "
              >
                <CheckCircle2 size={18} />
              </button>

              <button
                className="
                w-10
                h-10
                rounded-xl
                bg-red-500/10
                hover:bg-red-500
                text-red-400
                hover:text-white
                transition
                flex
                items-center
                justify-center
                "
              >
                <XCircle size={18} />
              </button>

              <button
                className="
                w-10
                h-10
                rounded-xl
                hover:bg-slate-100
                dark:hover:bg-slate-700
                text-slate-400
                "
              >
                <MoreVertical size={18} />
              </button>

            </div>

          </div>

        </div>

        {/* Body */}

        <div className="px-6 py-5">

          <div className="grid grid-cols-4 gap-8">

            {/* Customer */}

            <div>

              <div className="flex items-center gap-2 text-slate-400 text-xs uppercase mb-3">

                <User size={14} />

                Customer

              </div>

              <h4 className="text-lg font-semibold text-slate-900 dark:text-white">

                {withdrawal.customerName}

              </h4>

              <p className="text-slate-400 mt-1">

                {withdrawal.email}

              </p>

            </div>

            {/* Amount */}

            <div>

              <div className="flex items-center gap-2 text-slate-400 text-xs uppercase mb-3">

                💰 Amount

              </div>

              <h2 className="text-3xl font-bold text-emerald-400">

                ${withdrawal.amount}

              </h2>

            </div>

            {/* Wallet */}

            <div>

              <div className="flex items-center gap-2 text-slate-400 text-xs uppercase mb-3">

                📂 Wallet

              </div>

              <span
                className="
                px-3
                py-1
                rounded-full
                bg-blue-500/15
                text-blue-400
                capitalize
                text-sm
                "
              >
                {withdrawal.walletType}
              </span>

            </div>

            {/* Date */}

            <div>

              <div className="flex items-center gap-2 text-slate-400 text-xs uppercase mb-3">

                <CalendarDays size={14} />

                Date

              </div>

              <h4 className="text-slate-900 dark:text-white">

                {withdrawal.createdAt}

              </h4>

            </div>

          </div>

          {/* Wallet Address */}

          <div className="mt-8">

            <div className="flex items-center gap-2 text-slate-400 text-xs uppercase mb-3">

              <Wallet size={14} />

              Wallet Address

            </div>

            <div className="flex items-center justify-between">

              <p className="text-slate-700 dark:text-slate-200 font-mono">

                {withdrawal.walletAddress}

              </p>

              <button
                onClick={copyAddress}
                className="
                flex
                items-center
                gap-2
                rounded-xl
                px-4
                py-2
                bg-slate-100
                text-slate-700
                dark:bg-slate-700
                dark:text-slate-100
                hover:bg-blue-600
                hover:text-white
                transition
                "
              >

                <Copy size={16} />

                Copy

              </button>

            </div>

          </div>

        </div>

      </div>

      {/* Mobile */}

      <div className="lg:hidden space-y-4">

        <div className="flex justify-between">

          <div>

            <p className="font-bold">

              {withdrawal.customerName}

            </p>

            <p className="text-sm text-slate-500">

              {withdrawal.email}

            </p>

          </div>

          <Badge variant={statusVariant(withdrawal.status)}>
            {withdrawal.status}
          </Badge>

        </div>

        <div className="grid grid-cols-2 gap-4">

          <div>

            <p className="text-xs text-slate-400">

              Withdrawal ID

            </p>

            <p>

              {withdrawal.withdrawalId}

            </p>

          </div>

          <div>

            <p className="text-xs text-slate-400">

              Amount

            </p>

            <p className="text-green-600 font-bold">

              {withdrawal.amount}

            </p>

          </div>

          <div>

            <p className="text-xs text-slate-400">

              Wallet

            </p>

            <p>

              {withdrawal.walletType}

            </p>

          </div>

          <div>

            <p className="text-xs text-slate-400">

              Date

            </p>

            <p>

              {withdrawal.createdAt}

            </p>

          </div>

        </div>

        <div>

          <p className="text-xs text-slate-400">

            Wallet Address

          </p>

          <p className="break-all text-sm">

            {withdrawal.walletAddress}

          </p>

        </div>

        <div className="grid grid-cols-3 gap-2">

          <button
            className="bg-green-600 rounded-lg h-11 text-white"
          >
            Approve
          </button>

          <button
            className="bg-red-600 rounded-lg h-11 text-white"
          >
            Reject
          </button>

          <button
            className="bg-blue-600 rounded-lg h-11 text-white"
          >
            View
          </button>

        </div>

      </div>

    </div>
  );
}