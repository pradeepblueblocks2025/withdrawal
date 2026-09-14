import axios from "axios";
import Cookies from "js-cookie";
import api from "@/lib/axios";

const BTSMART_API_BASE = "https://btcashapi.btcashnft.com";

const CUSTOMER_LOGIN_REDIRECT: Record<string, string> = {
  fortunenft: "https://fortunenft.world/login",
  fortuneball: "https://fortuneball.playdex.live/login",
  btsmart: "https://btsmart.io/login",
};

function getAdminAuthHeader(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return (
    localStorage.getItem("admin_token") || Cookies.get("admin_token") || undefined
  );
}

function getApiClient(website: string) {
  if (website === "btsmart") {
    const client = axios.create({
      baseURL: BTSMART_API_BASE,
      timeout: 30_000,
      headers: { "Content-Type": "application/json" },
    });

    client.interceptors.request.use((config) => {
      const token = getAdminAuthHeader();
      if (token) {
        config.headers.Authorization = `${token}`;
      }
      return config;
    });

    return client;
  }

  return api;
}

function pickCustomerId(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;

  const root = payload as Record<string, unknown>;
  const data =
    root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : root;

  // Prefer nested userId._id from GET /withdrawal/{{referid}}
  const nestedUserId =
    data.userId && typeof data.userId === "object"
      ? (data.userId as Record<string, unknown>)
      : root.userId && typeof root.userId === "object"
        ? (root.userId as Record<string, unknown>)
        : null;
  if (nestedUserId) {
    const id = nestedUserId._id ?? nestedUserId.id;
    if (typeof id === "string" && id.trim()) return id.trim();
  }

  const directCandidates = [
    data.customerId,
    data.customerid,
    typeof data.userId === "string" ? data.userId : null,
    data.userid,
    data.user_id,
    root.customerId,
    root.customerid,
  ];

  for (const value of directCandidates) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  const nestedCustomer =
    data.customer && typeof data.customer === "object"
      ? (data.customer as Record<string, unknown>)
      : null;
  if (nestedCustomer) {
    const id = nestedCustomer._id ?? nestedCustomer.id;
    if (typeof id === "string" && id.trim()) return id.trim();
  }

  const nestedUser =
    data.user && typeof data.user === "object"
      ? (data.user as Record<string, unknown>)
      : null;
  if (nestedUser) {
    const id = nestedUser._id ?? nestedUser.id;
    if (typeof id === "string" && id.trim()) return id.trim();
  }

  return null;
}

function pickLoginToken(payload: unknown): string | null {
  if (typeof payload === "string" && payload.trim()) return payload.trim();
  if (!payload || typeof payload !== "object") return null;
  const root = payload as Record<string, unknown>;
  const data =
    root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : null;

  const candidates = [
    root.token,
    root.accessToken,
    root.loginToken,
    typeof root.data === "string" ? root.data : null,
    data?.token,
    data?.accessToken,
    data?.loginToken,
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  return null;
}

export function getReferId(withdrawal: {
  referid?: string;
  referId?: string;
}): string {
  return (withdrawal.referid || withdrawal.referId || "").trim();
}

export function canLoginAsCustomer(website: string): boolean {
  return Boolean(CUSTOMER_LOGIN_REDIRECT[website]);
}

export function getCustomerLoginRedirectUrl(
  website: string,
  token: string
): string {
  const base = CUSTOMER_LOGIN_REDIRECT[website];
  if (!base) {
    throw new Error("Customer login is not available for this website");
  }
  return `${base}/${encodeURIComponent(token)}`;
}

export async function getCustomerIdByReferId(
  referid: string,
  website: string
): Promise<string> {
  const client = getApiClient(website);
  const response = await client.get(`/admin/api/v2/withdrawal/${referid}`);
  const customerId = pickCustomerId(response.data);

  if (!customerId) {
    throw new Error("Customer id not found for this withdrawal");
  }

  return customerId;
}

export async function createCustomerLoginToken(
  customerId: string,
  website: string
): Promise<string> {
  const client = getApiClient(website);
  const response = await client.post(
    `/admin/api/v2/v2/logincustomer/${customerId}`
  );
  const token = pickLoginToken(response.data);

  if (!token) {
    throw new Error("Login token was not returned by the server");
  }

  return token;
}

export async function loginAsCustomerFromWithdrawal(params: {
  referid: string;
  website: string;
}): Promise<string> {
  const customerId = await getCustomerIdByReferId(
    params.referid,
    params.website
  );
  const token = await createCustomerLoginToken(customerId, params.website);
  return getCustomerLoginRedirectUrl(params.website, token);
}
