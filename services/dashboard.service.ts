import axios from "axios";
import api from "@/lib/axios";
import {
  DashboardResponse,
  WebsiteKey,
  WebsiteStats,
  WebsiteStatsRaw,
} from "@/types/dashboard";

const WEBSITE_KEYS: WebsiteKey[] = [
  "fortunenft",
  "fortuneball",
  "exora",
  "btsmart",
];

export const emptyStats = (): WebsiteStats => ({
  totalWithdrawals: 0,
  pendingWithdrawals: 0,
  completedWithdrawals: 0,
  totalAmount: 0,
  totalMtht: 0,
  totalUsdt: 0,
});

export const emptyStatsByWebsite = (): Record<WebsiteKey, WebsiteStats> => ({
  fortunenft: emptyStats(),
  fortuneball: emptyStats(),
  exora: emptyStats(),
  btsmart: emptyStats(),
});

function normalizeStats(source?: WebsiteStatsRaw): WebsiteStats {
  if (!source) return emptyStats();

  return {
    totalWithdrawals: Number(source.totalWithdrawals ?? 0),
    pendingWithdrawals: Number(source.pendingWithdrawals ?? 0),
    completedWithdrawals: Number(
      source.completed ?? source.completedWithdrawals ?? 0
    ),
    totalAmount: Number(source.totalAmount ?? 0),
    totalMtht: Number(source.totalMTHT ?? source.totalMtht ?? 0),
    totalUsdt: Number(source.totalUSDT ?? source.totalUsdt ?? 0),
  };
}

export const getDashboard = async (
  signal?: AbortSignal
): Promise<Record<WebsiteKey, WebsiteStats> | null> => {
  try {
    const response = await api.get<DashboardResponse>(
      "/admin/api/v2/withdrawal-dashboard",
      { signal }
    );

    const data = response.data?.data;
    const result = emptyStatsByWebsite();

    for (const key of WEBSITE_KEYS) {
      result[key] = normalizeStats(data?.[key]);
    }

    return result;
  } catch (err) {
    if (
      signal?.aborted ||
      (axios.isAxiosError(err) && err.code === "ERR_CANCELED")
    ) {
      return null;
    }
    return emptyStatsByWebsite();
  }
};
