"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";

import GridToolbar from "@/components/datagrid/GridToolbar";
import DataGrid from "@/components/datagrid/DataGrid";
import { GridColumn } from "@/components/datagrid/GridHeader";

import GridPagination from "@/components/datagrid/GridPagination";

import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import ConfirmModal from "@/components/common/ConfirmModal";
import WithdrawalDetailsModal from "@/components/withdrawals/WithdrawalDetailsModal";
import ToggleSwitch from "@/components/common/ToggleSwitch";
import {
  Eye,
  Copy,
  CheckCircle2,
  PauseCircle,
  XCircle,
  ChevronDown,
} from "lucide-react";

import { Withdrawal } from "@/types/withdrawal";
import {
  bulkApproveWithdrawals,
  getWithdrawals,
  updateWithdrawalStatus,
} from "@/services/withdrawal.service";
import { formatToIST } from "@/lib/date";
import {
  isNotificationSoundUnlocked,
  notifyNewWithdrawals,
  unlockNotificationSound,
} from "@/lib/notification-sound";

const WEBSITE_SPEECH_NAMES: Record<string, string> = {
  fortunenft: "Fortune NFT",
  fortuneball: "FortuneBall",
  exora: "Exora",
  btsmart: "BTSMART",
};

const SEARCH_DEBOUNCE_MS = 400;
const POLL_INTERVAL_MS = 120_000;

function shortenAddress(address: string): string {
  if (!address || address.length <= 7) return address;
  return `${address.slice(0, 3)}...${address.slice(-4)}`;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

const AVATAR_COLORS = [
  "bg-violet-100 text-violet-600",
  "bg-sky-100 text-sky-600",
  "bg-rose-100 text-rose-600",
  "bg-amber-100 text-amber-600",
  "bg-emerald-100 text-emerald-600",
  "bg-indigo-100 text-indigo-600",
];

function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

const DEFAULT_WALLET_OPTIONS = [
  { label: "Staking", value: "staking" },
  { label: "Affiliate", value: "affiliate" },
  { label: "Royalty", value: "royalty" },
  { label: "Booster", value: "booster" },
  { label: "Swap", value: "swap" },
];

const FORTUNEBALL_WALLET_OPTIONS = [
  { label: "Affiliate", value: "bidaffiliate" },
  { label: "Reward", value: "bidreward" },
];

function getWalletFilterOptions(website: string) {
  if (website === "fortuneball") return FORTUNEBALL_WALLET_OPTIONS;
  return DEFAULT_WALLET_OPTIONS;
}

function walletBadgeVariant(
  walletType: string
): "success" | "info" | "warning" | "danger" | "secondary" {
  switch (walletType.toLowerCase()) {
    case "staking":
      return "success";
    case "affiliate":
    case "bidaffiliate":
      return "info";
    case "royalty":
      return "warning";
    case "booster":
    case "bidreward":
      return "secondary";
    default:
      return "danger";
  }
}

function statusBadgeVariant(
  status: string
): "success" | "warning" | "info" | "danger" {
  if (status === "approved") return "success";
  if (status === "pending") return "warning";
  if (status === "hold") return "info";
  return "danger";
}

function statusSerialClass(status: string): string {
  switch (status) {
    case "approved":
      return "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-400/30";
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-400/30";
    case "hold":
      return "bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-400/30";
    case "rejected":
      return "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-400/30";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/20 dark:text-slate-200 dark:border-slate-400/30";
  }
}

function tokenBadgeVariant(
  token: string
): "success" | "warning" | "danger" | "secondary" {
  const value = token.toLowerCase();
  if (value === "mtht") return "success";
  if (value === "usdt") return "warning";
  if (value === "btmeta") return "danger";
  return "secondary";
}

interface WithdrawalsPageProps {
  website: string;
  title?: string;
}

export default function WithdrawalsPage({
  website,
  title = "Withdrawal Management",
}: WithdrawalsPageProps) {
  const walletFilterOptions = getWalletFilterOptions(website);
  const [loading, setLoading] = useState(true);

  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [status, setStatus] = useState("");

  const [walletType, setWalletType] = useState("");

  const [page, setPage] = useState(1);

  const [pageSize, setPageSize] = useState(10);

  const [totalPages, setTotalPages] = useState(0);

  const [totalRecords, setTotalRecords] = useState(0);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedMeta, setSelectedMeta] = useState<
    Record<string, { token: string; amount: number }>
  >({});

  const [copiedField, setCopiedField] = useState<{
    id: string;
    field: "address" | "amount";
  } | null>(null);

  const [bulkLoading, setBulkLoading] = useState(false);
  const [statusActionLoading, setStatusActionLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<
    | { type: "bulk-approve" }
    | { type: "hold"; withdrawal: Withdrawal }
    | { type: "reject"; withdrawal: Withdrawal }
    | null
  >(null);
  const [rejectReason, setRejectReason] = useState("");
  const confirmOpenRef = useRef(false);

  const [token, setToken] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateSort, setDateSort] = useState<"asc" | "desc">("desc");

  const [selectedWithdrawal, setSelectedWithdrawal] =
    useState<Withdrawal | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const hasLoadedOnce = useRef(false);
  const requestIdRef = useRef(0);
  const knownTotalRef = useRef<number | null>(null);

  useEffect(() => {
    setSelectedIds([]);
    setSelectedMeta({});
    setWalletType("");
    setExpandedIds(new Set());
    knownTotalRef.current = null;
    hasLoadedOnce.current = false;
  }, [website]);

  useEffect(() => {
    setExpandedIds(new Set());
  }, [page, pageSize, website]);

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
    const timer = setTimeout(() => {
      if (search === debouncedSearch) return;
      setPage(1);
      setDebouncedSearch(search);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [search, debouncedSearch]);

  useEffect(() => {
    const controller = new AbortController();
    const requestId = ++requestIdRef.current;

    loadData({
      signal: controller.signal,
      requestId,
      silent: hasLoadedOnce.current,
      checkNew: false,
    });

    const intervalId = setInterval(() => {
      loadData({
        silent: true,
        checkNew: true,
        signal: controller.signal,
        requestId: ++requestIdRef.current,
      });
    }, POLL_INTERVAL_MS);

    return () => {
      controller.abort();
      clearInterval(intervalId);
    };
  }, [
    page,
    pageSize,
    debouncedSearch,
    status,
    walletType,
    website,
    token,
    dateRange,
    startDate,
    endDate,
    dateSort,
  ]);

  const updateFilter = (setter: (value: string) => void) => (value: string) => {
    setPage(1);
    setter(value);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const toggleSelect = (row: Withdrawal) => {
    const id = row._id;
    setSelectedIds((prev) => {
      const isSelected = prev.includes(id);
      setSelectedMeta((meta) => {
        if (isSelected) {
          const next = { ...meta };
          delete next[id];
          return next;
        }
        return {
          ...meta,
          [id]: {
            token: (row.token || "N/A").toUpperCase(),
            amount: Number(row.amount) || 0,
          },
        };
      });
      return isSelected ? prev.filter((x) => x !== id) : [...prev, id];
    });
  };

  const toggleSelectAll = () => {
    const allSelected =
      withdrawals.length > 0 &&
      withdrawals.every((item) => selectedIds.includes(item._id));

    if (allSelected) {
      const pageIds = new Set(withdrawals.map((item) => item._id));
      setSelectedIds((prev) => prev.filter((id) => !pageIds.has(id)));
      setSelectedMeta((meta) => {
        const next = { ...meta };
        for (const id of pageIds) delete next[id];
        return next;
      });
      return;
    }

    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const item of withdrawals) next.add(item._id);
      return Array.from(next);
    });
    setSelectedMeta((meta) => {
      const next = { ...meta };
      for (const item of withdrawals) {
        next[item._id] = {
          token: (item.token || "N/A").toUpperCase(),
          amount: Number(item.amount) || 0,
        };
      }
      return next;
    });
  };

  const selectedTokenTotals = useMemo(() => {
    const totals = new Map<string, number>();

    for (const id of selectedIds) {
      const item = selectedMeta[id];
      if (!item) continue;
      totals.set(item.token, (totals.get(item.token) || 0) + item.amount);
    }

    return Array.from(totals.entries()).sort(([a], [b]) =>
      a.localeCompare(b)
    );
  }, [selectedIds, selectedMeta]);

  const handleDateRangeChange = (value: string) => {
    setPage(1);
    setDateRange(value);
    if (value !== "custom") {
      setStartDate("");
      setEndDate("");
    }
  };

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0 || bulkLoading) return;

    const ids = [...selectedIds];

    // Close confirm immediately so it cannot reopen after loading
    confirmOpenRef.current = false;
    setConfirmDialog(null);
    setRejectReason("");

    try {
      setBulkLoading(true);
      await bulkApproveWithdrawals(ids);
      setSelectedIds([]);
      setSelectedMeta({});
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setBulkLoading(false);
      confirmOpenRef.current = false;
    }
  };

  const openConfirmDialog = (
    dialog:
      | { type: "bulk-approve" }
      | { type: "hold"; withdrawal: Withdrawal }
      | { type: "reject"; withdrawal: Withdrawal }
  ) => {
    if (confirmOpenRef.current || bulkLoading || statusActionLoading) return;
    confirmOpenRef.current = true;
    setRejectReason("");
    setConfirmDialog(dialog);
  };

  const closeConfirmDialog = () => {
    if (bulkLoading || statusActionLoading) return;
    confirmOpenRef.current = false;
    setConfirmDialog(null);
    setRejectReason("");
  };

  const handleStatusActionConfirm = async () => {
    if (!confirmDialog || confirmDialog.type === "bulk-approve") return;
    if (statusActionLoading) return;

    const action = confirmDialog;

    confirmOpenRef.current = false;
    setConfirmDialog(null);

    try {
      setStatusActionLoading(true);

      if (action.type === "hold") {
        await updateWithdrawalStatus(action.withdrawal._id, {
          status: "hold",
        });
      } else {
        const reason = rejectReason.trim();
        if (!reason) {
          setStatusActionLoading(false);
          return;
        }
        await updateWithdrawalStatus(action.withdrawal._id, {
          status: "rejected",
          rejectreason: reason,
        });
      }

      setRejectReason("");
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setStatusActionLoading(false);
      confirmOpenRef.current = false;
    }
  };

  async function loadData(options?: {
    silent?: boolean;
    checkNew?: boolean;
    signal?: AbortSignal;
    requestId?: number;
  }) {
    const requestId = options?.requestId ?? ++requestIdRef.current;

    try {
      if (!options?.silent) {
        setLoading(true);
      }

      const response = await getWithdrawals(
        page,
        pageSize,
        debouncedSearch,
        status,
        walletType,
        website,
        token,
        dateRange,
        startDate,
        endDate,
        dateSort,
        options?.signal
      );

      if (options?.signal?.aborted || requestId !== requestIdRef.current) {
        return;
      }

      const payload = response as typeof response & {
        totalRecords?: number;
      };
      const nextTotal = Number(
        payload.totalCount ?? payload.total ?? payload.totalRecords ?? 0
      );
      const previousTotal = knownTotalRef.current;
      const nextRows = response.data ?? [];

      const shouldNotify =
        Boolean(options?.checkNew) &&
        previousTotal !== null &&
        nextTotal > previousTotal;

      if (shouldNotify) {
        const siteName =
          WEBSITE_SPEECH_NAMES[website] ||
          title.replace(/\s*Withdrawals?\s*$/i, "").trim() ||
          website;
        await notifyNewWithdrawals([siteName]);
      }

      knownTotalRef.current = nextTotal;
      setWithdrawals(nextRows);
      setTotalPages(response.pages ?? response.totalPages ?? 0);
      setTotalRecords(nextTotal);
      hasLoadedOnce.current = true;
    } catch (err) {
      if (
        options?.signal?.aborted ||
        (axios.isAxiosError(err) && err.code === "ERR_CANCELED")
      ) {
        return;
      }
      console.error(err);
    } finally {
      if (
        !options?.silent &&
        requestId === requestIdRef.current &&
        !options?.signal?.aborted
      ) {
        setLoading(false);
      }
    }
  }

  const copyToClipboard = async (
    id: string,
    field: "address" | "amount",
    text: string
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField({ id, field });
      setTimeout(() => setCopiedField(null), 1800);
    } catch (err) {
      console.error(err);
    }
  };

  const CopiedTooltip = () => (
    <div
      className="
        absolute
        left-1/2
        bottom-full
        mb-1.5
        -translate-x-1/2
        whitespace-nowrap
        rounded-md
        bg-slate-900
        text-white
        text-xs
        px-2
        py-1
        shadow-lg
        z-50
        pointer-events-none
      "
    >
      Copied!
      <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
    </div>
  );

  const getSerialNumber = (row: Withdrawal) => {
    const index = withdrawals.findIndex((item) => item._id === row._id);
    if (index < 0) return 0;
    return (page - 1) * pageSize + index + 1;
  };

  const renderSerial = (row: Withdrawal) => {
    const serial = getSerialNumber(row);
    return (
      <span
        className={`inline-flex min-w-6 h-6 items-center justify-center rounded-lg border px-1.5 text-[11px] font-semibold tabular-nums ${statusSerialClass(row.status)}`}
        title={`${row.status} · #${serial}`}
      >
        {serial}
      </span>
    );
  };

  const renderRowActions = (row: Withdrawal, compact = false) => {
    const canChangeStatus =
      row.status === "pending" || row.status === "hold";

    return (
      <div className={`flex items-center gap-2 ${compact ? "w-full" : ""}`}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedWithdrawal(row);
            setShowModal(true);
          }}
          className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-[#252a40] hover:bg-indigo-500 text-slate-600 dark:text-slate-100 hover:text-white transition flex items-center justify-center cursor-pointer shrink-0"
          title="View details"
        >
          <Eye size={16} />
        </button>

        {canChangeStatus && (
          <>
            {row.status === "pending" && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openConfirmDialog({ type: "hold", withdrawal: row });
                }}
                className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-2.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-100 dark:border-amber-400/30 dark:bg-amber-500/15 dark:text-amber-300 dark:hover:bg-amber-500/25 sm:flex-none"
                title="Hold withdrawal"
              >
                <PauseCircle size={14} />
                Hold
              </button>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openConfirmDialog({ type: "reject", withdrawal: row });
              }}
              className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-2.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-400/30 dark:bg-rose-500/15 dark:text-rose-300 dark:hover:bg-rose-500/25 sm:flex-none"
              title="Reject withdrawal"
            >
              <XCircle size={14} />
              Reject
            </button>
          </>
        )}

        {!canChangeStatus && (
          <div className="flex items-center gap-2 min-w-0">
            <ToggleSwitch
              checked={row.status === "approved"}
              onChange={(checked) => {
                console.log("Approve:", row._id, checked);
              }}
            />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-300">
              Approve
            </span>
          </div>
        )}
      </div>
    );
  };

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderMobileCard = (row: Withdrawal) => {
    const { date, time } = formatToIST(row.createdAt);
    const tokenValue = (row.token || "").toLowerCase();
    const expanded = expandedIds.has(row._id);

    return (
      <div
        className="p-4 sm:p-5 cursor-pointer"
        onClick={() => toggleExpanded(row._id)}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleExpanded(row._id);
          }
        }}
      >
        {/* Top portion — always visible */}
        <div className="flex items-start gap-3">
          {renderSerial(row)}

          <input
            type="checkbox"
            checked={selectedIds.includes(row._id)}
            onChange={() => toggleSelect(row)}
            onClick={(e) => e.stopPropagation()}
            className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 accent-indigo-500"
          />

          <div
            className={`mt-0.5 h-10 w-10 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${avatarColor(row.name)}`}
          >
            {getInitials(row.name)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {row.name}
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {row.email}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <Badge variant={statusBadgeVariant(row.status)}>
                  {row.status}
                </Badge>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform duration-200 ${
                    expanded ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3.5 py-3 dark:bg-[#1c1f30]">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Amount
            </p>
            <button
              type="button"
              className="relative mt-0.5 text-lg font-bold tabular-nums text-emerald-500"
              title="Click to copy"
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(row._id, "amount", row.amount.toString());
              }}
            >
              {Number(row.amount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              {copiedField?.id === row._id && copiedField.field === "amount" && (
                <CopiedTooltip />
              )}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={tokenBadgeVariant(tokenValue)}>
              {tokenValue ? tokenValue.toUpperCase() : "N/A"}
            </Badge>
            <Badge variant={walletBadgeVariant(row.walletType)}>
              {row.walletType}
            </Badge>
          </div>
        </div>

        {/* Bottom portion — expanded only */}
        {expanded && (
          <div
            className="mt-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-100 px-3.5 py-2.5 dark:border-white/5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Wallet Address
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span
                    className="font-mono text-sm text-slate-700 dark:text-slate-200"
                    title={row.walletAddress}
                  >
                    {shortenAddress(row.walletAddress)}
                  </span>
                  <div className="relative">
                    <button
                      type="button"
                      title="Copy wallet address"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(row._id, "address", row.walletAddress);
                      }}
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-indigo-500 dark:hover:bg-white/5"
                    >
                      <Copy size={14} />
                    </button>
                    {copiedField?.id === row._id &&
                      copiedField.field === "address" && <CopiedTooltip />}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 px-3.5 py-2.5 dark:border-white/5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Date
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-white">
                  {date}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {time}
                </p>
              </div>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-3 dark:border-white/5">
              {renderRowActions(row, true)}
            </div>
          </div>
        )}
      </div>
    );
  };

  const columns: GridColumn<Withdrawal>[] = [
    {
      key: "serial",
      title: "#",
      width: "44px",
      align: "center",
      truncate: false,
      render: (row) => renderSerial(row),
    },
    {
      key: "customer",
      title: "Customer",
      width: "minmax(180px, 1.4fr)",
      truncate: false,
      render: (row) => (
        <div className="flex items-center gap-3 min-w-0">
          <input
            type="checkbox"
            checked={selectedIds.includes(row._id)}
            onChange={() => toggleSelect(row)}
            className="h-4 w-4 shrink-0 rounded border-slate-300 accent-indigo-500"
          />
          <div
            className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${avatarColor(row.name)}`}
          >
            {getInitials(row.name)}
          </div>
          <div className="min-w-0">
            <div
              className="text-sm font-semibold text-slate-900 dark:text-white truncate"
              title={row.name}
            >
              {row.name}
            </div>
            <div
              className="text-xs text-slate-500 dark:text-slate-300 truncate"
              title={row.email}
            >
              {row.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "amount",
      title: "Amount",
      width: "110px",
      truncate: false,
      render: (row) => (
        <div className="relative inline-flex">
          <span
            className="text-sm font-bold text-emerald-500 cursor-pointer"
            title="Click to copy"
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard(row._id, "amount", row.amount.toString());
            }}
          >
            {Number(row.amount).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          {copiedField?.id === row._id && copiedField.field === "amount" && (
            <CopiedTooltip />
          )}
        </div>
      ),
    },
    {
      key: "wallet",
      title: "Wallet",
      width: "110px",
      render: (row) => (
        <Badge variant={walletBadgeVariant(row.walletType)}>
          {row.walletType}
        </Badge>
      ),
    },
    {
      key: "address",
      title: "Wallet Address",
      width: "minmax(120px, 1fr)",
      truncate: false,
      render: (row) => (
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="text-sm text-slate-600 dark:text-slate-200 font-mono shrink-0"
            title={row.walletAddress}
          >
            {shortenAddress(row.walletAddress)}
          </span>
          <div className="relative shrink-0">
            <button
              type="button"
              title="Copy wallet address"
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(row._id, "address", row.walletAddress);
              }}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              <Copy size={14} />
            </button>
            {copiedField?.id === row._id && copiedField.field === "address" && (
              <CopiedTooltip />
            )}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      title: "Status",
      width: "100px",
      render: (row) => (
        <Badge variant={statusBadgeVariant(row.status)}>{row.status}</Badge>
      ),
    },
    {
      key: "token",
      title: "Token",
      width: "80px",
      render: (row) => {
        const tokenValue = (row.token || "").toLowerCase();
        return (
          <Badge variant={tokenBadgeVariant(tokenValue)}>
            {tokenValue ? tokenValue.toUpperCase() : "N/A"}
          </Badge>
        );
      },
    },
    {
      key: "date",
      title: "Date",
      width: "120px",
      sortable: true,
      render: (row) => {
        const { date, time } = formatToIST(row.createdAt);
        return (
          <div className="min-w-0" title={`${date} ${time}`}>
            <div className="text-sm font-semibold text-slate-800 dark:text-white truncate">
              {date}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-300 truncate">
              {time}
            </div>
          </div>
        );
      },
    },
    {
      key: "actions",
      title: "Actions",
      width: "220px",
      truncate: false,
      render: (row) => renderRowActions(row),
    },
  ];

  return (
    <div className="space-y-5">
      <GridToolbar
        title={title}
        totalRecords={totalRecords}
        search={search}
        onSearchChange={handleSearchChange}
        filters={[
          {
            label: "Status",
            value: status,
            onChange: updateFilter(setStatus),
            options: [
              { label: "Pending", value: "pending" },
              { label: "Hold", value: "hold" },
              { label: "Approved", value: "approved" },
              { label: "Rejected", value: "rejected" },
            ],
          },
          {
            label: "Wallet",
            value: walletType,
            onChange: updateFilter(setWalletType),
            options: walletFilterOptions,
          },
          {
            label: "Token",
            value: token,
            onChange: updateFilter(setToken),
            options: [
              { label: "MTHT", value: "mtht" },
              { label: "USDT", value: "usdt" },
              { label: "BTMETA", value: "btmeta" },
            ],
          },
          {
            label: "Date Range",
            value: dateRange,
            onChange: handleDateRangeChange,
            options: [
              { label: "All", value: "" },
              { label: "Today", value: "daily" },
              { label: "This Week", value: "weekly" },
              { label: "This Month", value: "monthly" },
              { label: "Last 3 Months", value: "3months" },
              { label: "Last 6 Months", value: "6months" },
              { label: "This Year", value: "year" },
              { label: "Custom", value: "custom" },
            ],
          },
        ]}
        onRefresh={async () => {
          await unlockNotificationSound();
          await loadData({ checkNew: true });
        }}
        onExport={() => {}}
      >
        {dateRange === "custom" && (
          <>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setPage(1);
                setStartDate(e.target.value);
              }}
              className="h-11 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm"
              aria-label="Start date"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setPage(1);
                setEndDate(e.target.value);
              }}
              className="h-11 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm"
              aria-label="End date"
            />
          </>
        )}
      </GridToolbar>

      <div className="sticky top-[72px] z-30 flex flex-row flex-wrap items-center gap-2.5 rounded-2xl border border-slate-100 bg-white/95 p-3 shadow-sm backdrop-blur-md sm:gap-4 sm:p-4 dark:border-white/5 dark:bg-[#161827]/95 dark:shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
        <label className="flex shrink-0 items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={
              withdrawals.length > 0 &&
              withdrawals.every((item) => selectedIds.includes(item._id))
            }
            onChange={toggleSelectAll}
            className="h-4 w-4 rounded border-slate-300 accent-indigo-500"
          />
          <span className="text-sm font-medium whitespace-nowrap text-slate-600 dark:text-slate-300">
            Select All
            {selectedIds.length > 0 && (
              <span className="ml-1 text-violet-500">({selectedIds.length})</span>
            )}
          </span>
        </label>

        <Button
          variant="success"
          className="!h-9 !px-3 text-xs sm:!h-10 sm:!px-5 sm:text-sm ml-auto"
          disabled={
            selectedIds.length === 0 ||
            bulkLoading ||
            confirmDialog?.type === "bulk-approve"
          }
          loading={bulkLoading}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openConfirmDialog({ type: "bulk-approve" });
          }}
        >
          <CheckCircle2 size={16} />
          <span className="sm:hidden">
            Approve{selectedIds.length > 0 ? ` (${selectedIds.length})` : ""}
          </span>
          <span className="hidden sm:inline">
            Approve Selected
            {selectedIds.length > 0 && ` (${selectedIds.length})`}
          </span>
        </Button>

        {selectedIds.length > 0 && (
          <div className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 sm:ml-0 sm:w-auto">
            {selectedTokenTotals.map(([tokenName, total]) => (
              <span
                key={tokenName}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-sm dark:bg-emerald-500/10"
              >
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {tokenName}
                </span>
                <span className="font-semibold text-emerald-500">
                  {total.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </span>
            ))}
          </div>
        )}
      </div>

      <DataGrid
        columns={columns}
        data={withdrawals}
        loading={loading}
        sortKey="date"
        sortOrder={dateSort}
        onSort={(key) => {
          if (key !== "date") return;
          setPage(1);
          setDateSort((prev) => (prev === "asc" ? "desc" : "asc"));
        }}
        renderMobile={renderMobileCard}
      />

      <GridPagination
        page={page}
        totalPages={totalPages}
        totalRecords={totalRecords}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPage(1);
          setPageSize(size);
        }}
      />

      {confirmDialog?.type === "bulk-approve" && (
        <ConfirmModal
          title="Approve Selected"
          message={`Are you sure you want to approve ${selectedIds.length} selected withdrawal${selectedIds.length === 1 ? "" : "s"}? This action cannot be undone.`}
          confirmLabel="Yes, Approve"
          cancelLabel="Cancel"
          confirmVariant="success"
          loading={false}
          onConfirm={handleBulkApprove}
          onCancel={closeConfirmDialog}
        />
      )}

      {confirmDialog?.type === "hold" && (
        <ConfirmModal
          title="Hold Withdrawal"
          message={`Put withdrawal for ${confirmDialog.withdrawal.name} on hold?`}
          confirmLabel="Hold"
          cancelLabel="Cancel"
          confirmVariant="primary"
          loading={statusActionLoading}
          onConfirm={handleStatusActionConfirm}
          onCancel={closeConfirmDialog}
        />
      )}

      {confirmDialog?.type === "reject" && (
        <ConfirmModal
          title="Reject Withdrawal"
          message={`Reject withdrawal for ${confirmDialog.withdrawal.name}? Provide a reason below.`}
          confirmLabel="Reject"
          cancelLabel="Cancel"
          confirmVariant="danger"
          loading={statusActionLoading}
          reasonLabel="Reject reason"
          reasonPlaceholder="e.g. Invalid wallet address"
          reason={rejectReason}
          onReasonChange={setRejectReason}
          reasonRequired
          onConfirm={handleStatusActionConfirm}
          onCancel={closeConfirmDialog}
        />
      )}

      {showModal && selectedWithdrawal && (
        <WithdrawalDetailsModal
          withdrawal={selectedWithdrawal}
          onClose={() => {
            setShowModal(false);
            setSelectedWithdrawal(null);
          }}
        />
      )}
    </div>
  );
}
