import api from "@/lib/axios";
import { WithdrawalResponse } from "@/types/withdrawal";

export const getWithdrawals = async (
  page = 1,
  limit = 10,
  search = "",
  status = "",
  walletType = "",
  website = "fortunenft",
  token = "",
  dateRange = "",
  startDate = "",
  endDate = "",
  dateSort = "",
  signal?: AbortSignal,
): Promise<WithdrawalResponse> => {
  const response = await api.get("/admin/api/v2/allwithdrawals", {
    signal,
    params: {
      page,
      limit,
      search,
      status,
      walletType,
      website,
      token,
      dateRange,
      startDate,
      endDate,
      ...(dateSort ? { dateSort } : {}),
    },
  });

  return response.data;
};

export const bulkApproveWithdrawals = async (
  ids: string[]
): Promise<{ status: boolean; message?: string }> => {
  const response = await api.post(
    "/admin/api/v2/batch-withdrawals/approve-all",
    { ids },
    { timeout: 60_000 }
  );

  return response.data;
};

export type ExportPeriod =
  | "today"
  | "this_week"
  | "this_month"
  | "last_3_months"
  | "last_6_months"
  | "this_year"
  | "custom";

/** Maps withdrawals list dateRange filter values → export API period */
export const DATE_RANGE_TO_EXPORT_PERIOD: Record<string, ExportPeriod> = {
  daily: "today",
  weekly: "this_week",
  monthly: "this_month",
  "3months": "last_3_months",
  "6months": "last_6_months",
  year: "this_year",
  custom: "custom",
};

function getExportFilename(contentDisposition?: string, fallback = "withdrawals-export.xlsx") {
  if (!contentDisposition) return fallback;
  const utfMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utfMatch?.[1]) return decodeURIComponent(utfMatch[1]);
  const plainMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
  if (plainMatch?.[1]) return plainMatch[1];
  return fallback;
}

export const exportWithdrawals = async (params: {
  period: ExportPeriod;
  website: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  status?: string;
  walletType?: string;
  token?: string;
}): Promise<void> => {
  const response = await api.get("/admin/api/v2/allwithdrawals/export", {
    params: {
      period: params.period,
      website: params.website,
      ...(params.period === "custom"
        ? {
            startDate: params.startDate,
            endDate: params.endDate,
          }
        : {}),
      ...(params.search ? { search: params.search } : {}),
      ...(params.status ? { status: params.status } : {}),
      ...(params.walletType ? { walletType: params.walletType } : {}),
      ...(params.token ? { token: params.token } : {}),
    },
    responseType: "blob",
    timeout: 120_000,
  });

  const contentType = String(response.headers["content-type"] || "");
  if (contentType.includes("application/json")) {
    const text = await (response.data as Blob).text();
    let message = "Export failed";
    try {
      const json = JSON.parse(text) as { message?: string };
      if (json.message) message = json.message;
    } catch {
      // keep default message
    }
    throw new Error(message);
  }

  const filename = getExportFilename(
    response.headers["content-disposition"],
    `withdrawals-${params.website}-${params.period}.xlsx`
  );

  const url = window.URL.createObjectURL(response.data as Blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export type WithdrawalStatusUpdate =
  | { status: "hold" }
  | { status: "rejected"; rejectreason: string };

export const updateWithdrawalStatus = async (
  id: string,
  payload: WithdrawalStatusUpdate
): Promise<{ status: boolean; message?: string }> => {
  const response = await api.put(
    `/admin/api/v2/withdrawals-record/${id}/status`,
    payload
  );

  return response.data;
};