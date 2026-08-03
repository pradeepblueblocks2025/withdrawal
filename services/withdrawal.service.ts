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
    },
  });

  return response.data;
};

export const bulkApproveWithdrawals = async (
  ids: string[]
): Promise<{ status: boolean; message?: string }> => {
  const response = await api.post("/admin/api/v2/batch-withdrawals/approve-all", {
    ids,
  });

  return response.data;
};