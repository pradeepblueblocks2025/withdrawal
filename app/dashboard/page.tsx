"use client";

import { useEffect, useState } from "react";
import {
  Wallet,
  Clock3,
  CircleCheckBig,
  Coins,
  DollarSign,
} from "lucide-react";

import DashboardSection, {
  DashboardCardItem,
} from "@/components/dashboard/DashboardSection";
import {
  emptyStatsByWebsite,
  getDashboard,
} from "@/services/dashboard.service";
import { WebsiteKey, WebsiteStats } from "@/types/dashboard";

const WEBSITES: { key: WebsiteKey; title: string; isExora?: boolean }[] = [
  { key: "fortunenft", title: "Fortune NFT" },
  { key: "fortuneball", title: "FortuneBall" },
  { key: "exora", title: "Exora", isExora: true },
  { key: "btsmart", title: "BTSMART" },
];

function formatAmount(value: number | undefined): string {
  return Number(value ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function buildStandardCards(stats: WebsiteStats): DashboardCardItem[] {
  return [
    {
      title: "Total Withdrawals",
      value: stats.totalWithdrawals,
      icon: Wallet,
      bg: "bg-blue-600",
    },
    {
      title: "Pending Withdrawals",
      value: stats.pendingWithdrawals,
      icon: Clock3,
      bg: "bg-orange-500",
    },
    {
      title: "Completed",
      value: stats.completedWithdrawals,
      icon: CircleCheckBig,
      bg: "bg-green-600",
    },
    {
      title: "Total Amount",
      value: formatAmount(stats.totalAmount),
      icon: DollarSign,
      bg: "bg-cyan-600",
    },
  ];
}

function buildExoraCards(stats: WebsiteStats): DashboardCardItem[] {
  return [
    {
      title: "Total Withdrawals",
      value: stats.totalWithdrawals,
      icon: Wallet,
      bg: "bg-blue-600",
    },
    {
      title: "Pending Withdrawals",
      value: stats.pendingWithdrawals,
      icon: Clock3,
      bg: "bg-orange-500",
    },
    {
      title: "Completed",
      value: stats.completedWithdrawals,
      icon: CircleCheckBig,
      bg: "bg-green-600",
    },
    {
      title: "Total MTHT",
      value: formatAmount(stats.totalMtht),
      icon: Coins,
      bg: "bg-amber-500",
    },
    {
      title: "Total USDT",
      value: formatAmount(stats.totalUsdt),
      icon: DollarSign,
      bg: "bg-emerald-600",
    },
  ];
}

export default function DashboardPage() {
  const [statsByWebsite, setStatsByWebsite] = useState<
    Record<WebsiteKey, WebsiteStats>
  >(emptyStatsByWebsite);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);

    getDashboard(controller.signal).then((stats) => {
      if (controller.signal.aborted || stats === null) return;
      setStatsByWebsite(stats);
      setLoading(false);
    });

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          Dashboard
        </h1>

        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Welcome back, Administrator
        </p>
      </div>

      {loading ? (
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          Loading dashboard stats…
        </p>
      ) : null}

      <div className="space-y-8">
        {WEBSITES.map((site) => {
          const stats = statsByWebsite[site.key];
          const cards = site.isExora
            ? buildExoraCards(stats)
            : buildStandardCards(stats);

          return (
            <DashboardSection
              key={site.key}
              title={site.title}
              cards={cards}
              columns={site.isExora ? 5 : 4}
            />
          );
        })}
      </div>
    </div>
  );
}
