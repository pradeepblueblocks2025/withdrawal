export interface Withdrawal {
  _id: string;
  withdrawalId: string;
  name: string;
  email: string;
  organisation?: string;
  amount: number;
  walletType: string;
  walletAddress: string;
  website: string;
  token: string;
  createdAt: string;
  requestamount: number;
  status: "pending" | "approved" | "rejected" | "hold";
  rejectreason?: string;
}

export interface WithdrawalResponse {
  status: boolean;
  data: Withdrawal[];
  total?: number;
  page?: number;
  pages?: number;
  totalPages?: number;
  totalCount?: number;
}
