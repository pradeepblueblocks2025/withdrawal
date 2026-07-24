"use client";

import WithdrawalRow from "./WithdrawalRow";
import EmptyState from "./EmptyState";
import { Withdrawal } from "@/types/withdrawal";

interface Props {
  withdrawals: Withdrawal[];
}

export default function WithdrawalList({
  withdrawals,
}: Props) {
  if (withdrawals.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">

      {/* Desktop Header */}

      <div
        className="
          hidden
          lg:grid
          grid-cols-12
          gap-4
          bg-slate-200
          dark:bg-slate-900
          rounded-xl
          px-5
          py-4
          text-sm
          font-semibold
          text-slate-600
          dark:text-slate-300
        "
      >
       

        <div className="col-span-2">
          Customer
        </div>

        <div>
          Amount
        </div>

        <div>
          Wallet
        </div>

        <div className="col-span-3">
          Wallet Address
        </div>

        <div>
          Status
        </div>

        <div>
          Date
        </div>

        <div>
          Actions
        </div>
      </div>

      {/* Rows */}

      <div className="space-y-3">

        {withdrawals.map((withdrawal) => (

          <WithdrawalRow
            key={withdrawal._id}
            withdrawal={withdrawal}
          />

        ))}

      </div>

    </div>
  );
}