"use client";

import { useEffect, useRef, useState } from "react";
import {
  Wallet,
  Clock3,
  CircleCheckBig,
  Coins,
  DollarSign,
  PauseCircle,
} from "lucide-react";

import DashboardSection, {
  DashboardCardItem,
} from "@/components/dashboard/DashboardSection";
import {
  emptyStatsByWebsite,
  getDashboard,
} from "@/services/dashboard.service";
import { WebsiteKey, WebsiteStats } from "@/types/dashboard";
import {
  isNotificationSoundUnlocked,
  notifyNewWithdrawals,
  unlockNotificationSound,
} from "@/lib/notification-sound";

const POLL_INTERVAL_MS = 120_000;

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
      title: "Hold Withdrawals",
      value: stats.holdWithdrawals,
      icon: PauseCircle,
      accent: "amber",
      subtitle: "On hold",
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

function getIncreasedSites(
  previous: Record<WebsiteKey, WebsiteStats> | null,
  next: Record<WebsiteKey, WebsiteStats>
): string[] {
  if (!previous) return [];

  const increased: string[] = [];

  for (const site of WEBSITES) {
    const prev = previous[site.key];
    const curr = next[site.key];
    if (!prev || !curr) continue;

    const hasNew =
      curr.totalWithdrawals > prev.totalWithdrawals ||
      curr.pendingWithdrawals > prev.pendingWithdrawals;

    if (hasNew) {
      increased.push(site.title);
    }
  }

  return increased;
}

export default function DashboardPage() {
  const [statsByWebsite, setStatsByWebsite] = useState<
    Record<WebsiteKey, WebsiteStats>
  >(emptyStatsByWebsite);
  const [loading, setLoading] = useState(true);
  const previousStatsRef = useRef<Record<WebsiteKey, WebsiteStats> | null>(
    null
  );

  useEffect(() => {
    const unlock = async () => {
      await unlockNotificationSound();
      if (isNotificationSoundUnlocked()) {
        window.removeEventListener("pointerdown", unlock);
        window.removeEventListener("keydown", unlock);
      }
    };

    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const load = async (checkNew: boolean) => {
      if (!checkNew) setLoading(true);

      const stats = await getDashboard(controller.signal);
      if (controller.signal.aborted || stats === null) return;

      if (checkNew) {
        const sites = getIncreasedSites(previousStatsRef.current, stats);
        if (sites.length > 0) {
          void notifyNewWithdrawals(sites);
        }
      }

      previousStatsRef.current = stats;
      setStatsByWebsite(stats);
      setLoading(false);
    };

    void load(false);

    const intervalId = setInterval(() => {
      void load(true);
    }, POLL_INTERVAL_MS);

    return () => {
      controller.abort();
      clearInterval(intervalId);
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
            columns={5}
          />
        );
      })}
    </div>
  );
}
