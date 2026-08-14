"use client";

import { X, Copy } from "lucide-react";
import Badge from "@/components/common/Badge";
import { Withdrawal } from "@/types/withdrawal";
import { formatToIST } from "@/lib/date";

interface Props {
  withdrawal: Withdrawal;
  onClose: () => void;
}

export default function WithdrawalDetailsModal({
  withdrawal,
  onClose,
}: Props) {

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const { date, time } = formatToIST(withdrawal.createdAt);

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-5">

      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 p-5">

          <div>

            <h2 className="text-xl font-bold">
              Withdrawal Details
            </h2>

            <p className="text-sm text-slate-500">
              #{withdrawal._id}
            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>

        </div>

        {/* Body */}

        <div className="p-6 space-y-5">

          <div className="grid grid-cols-2 gap-5">

            <Info
              title="Customer"
              value={withdrawal.name}
            />

            <Info
              title="Email"
              value={withdrawal.email}
            />

            <Info
              title="Amount"
              value={Number(withdrawal.amount).toFixed(2)}
            />

            <div>

              <p className="text-xs text-slate-500 mb-1">
                Status
              </p>

              <Badge
                variant={
                  withdrawal.status === "approved"
                    ? "success"
                    : withdrawal.status === "pending"
                    ? "warning"
                    : withdrawal.status === "hold"
                    ? "info"
                    : "danger"
                }
              >
                {withdrawal.status}
              </Badge>

            </div>

            <Info
              title="Wallet"
              value={withdrawal.walletType}
            />

            <div>
              <p className="text-xs text-slate-500 mb-1">Date</p>
              <p className="font-medium">{date}</p>
              <p className="text-sm text-slate-500">{time}</p>
            </div>

          </div>

          {withdrawal.rejectreason && (
            <div>
              <p className="text-xs text-slate-500 mb-2">Reject Reason</p>
              <div className="rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-400/20 p-3 text-sm text-rose-700 dark:text-rose-300">
                {withdrawal.rejectreason}
              </div>
            </div>
          )}

          <div>

            <p className="text-xs text-slate-500 mb-2">
              Wallet Address
            </p>

            <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-3 flex items-center justify-between">

              <span className="break-all text-sm">
                {withdrawal.walletAddress}
              </span>

              <button
                onClick={() =>
                  copy(withdrawal.walletAddress)
                }
                className="ml-3"
              >
                <Copy size={18} />
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

function Info({
  title,
  value,
}: {
  title: string;
  value: any;
}) {
  return (
    <div>
      <p className="text-xs text-slate-500 mb-1">
        {title}
      </p>

      <p className="font-medium">
        {value}
      </p>
    </div>
  );
}