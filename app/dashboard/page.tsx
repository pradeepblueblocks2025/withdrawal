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
      accent: "purple",
      subtitle: "All time",
    },
    {
      title: "Pending Withdrawals",
      value: stats.pendingWithdrawals,
      icon: Clock3,
      accent: "orange",
      subtitle: "Awaiting action",
    },
    {
      title: "Completed",
      value: stats.completedWithdrawals,
      icon: CircleCheckBig,
      accent: "green",
      subtitle: "Successfully processed",
    },
    {
      title: "Total Amount",
      value: formatAmount(stats.totalAmount),
      icon: DollarSign,
      accent: "blue",
      subtitle: "All wallets",
    },
  ];
}

function buildExoraCards(stats: WebsiteStats): DashboardCardItem[] {
  return [
    {
      title: "Total Withdrawals",
      value: stats.totalWithdrawals,
      icon: Wallet,
      accent: "purple",
      subtitle: "All time",
    },
    {
      title: "Pending Withdrawals",
      value: stats.pendingWithdrawals,
      icon: Clock3,
      accent: "orange",
      subtitle: "Awaiting action",
    },
    {
      title: "Completed",
      value: stats.completedWithdrawals,
      icon: CircleCheckBig,
      accent: "green",
      subtitle: "Successfully processed",
    },
    {
      title: "Total MTHT",
      value: formatAmount(stats.totalMtht),
      icon: Coins,
      accent: "amber",
      subtitle: "All wallets",
    },
    {
      title: "Total USDT",
      value: formatAmount(stats.totalUsdt),
      icon: DollarSign,
      accent: "teal",
      subtitle: "All wallets",
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
    <div className="space-y-7">
      {loading ? (
        <p className="text-sm text-slate-400">Loading dashboard stats…</p>
      ) : null}

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
  );
}
