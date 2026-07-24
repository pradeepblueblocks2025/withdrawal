export interface WebsiteStats {
  totalWithdrawals: number;
  pendingWithdrawals: number;
  completedWithdrawals: number;
  totalAmount: number;
  totalMtht?: number;
  totalUsdt?: number;
}

export type WebsiteKey = "fortunenft" | "fortuneball" | "exora" | "btsmart";

/** Raw per-website payload from the API */
export interface WebsiteStatsRaw {
  totalWithdrawals?: number;
  pendingWithdrawals?: number;
  completed?: number;
  completedWithdrawals?: number;
  totalAmount?: number;
  totalMTHT?: number;
  totalUSDT?: number;
  totalMtht?: number;
  totalUsdt?: number;
}

export interface DashboardResponse {
  success?: boolean;
  status?: boolean;
  data?: Partial<Record<WebsiteKey, WebsiteStatsRaw>>;
}
