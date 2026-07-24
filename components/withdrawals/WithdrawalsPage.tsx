"use client";

import { useEffect, useRef, useState } from "react";
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
} from "lucide-react";

import { Withdrawal } from "@/types/withdrawal";
import {
  bulkApproveWithdrawals,
  getWithdrawals,
} from "@/services/withdrawal.service";
import { formatToIST } from "@/lib/date";

const SEARCH_DEBOUNCE_MS = 400;

function shortenAddress(address: string): string {
  if (!address || address.length <= 7) return address;
  return `${address.slice(0, 3)}...${address.slice(-4)}`;
}

interface WithdrawalsPageProps {
  website: string;
  title?: string;
}

export default function WithdrawalsPage({
  website,
  title = "Withdrawal Management",
}: WithdrawalsPageProps) {
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

  const [copiedField, setCopiedField] = useState<{
    id: string;
    field: "address" | "amount";
  } | null>(null);

  const [bulkLoading, setBulkLoading] = useState(false);
  const [showBulkApproveConfirm, setShowBulkApproveConfirm] = useState(false);

  const [token, setToken] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [selectedWithdrawal, setSelectedWithdrawal] =
    useState<Withdrawal | null>(null);

  const [showModal, setShowModal] = useState(false);

  const hasLoadedOnce = useRef(false);
  const requestIdRef = useRef(0);

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
    });

    const intervalId = setInterval(() => {
      loadData({
        silent: true,
        signal: controller.signal,
        requestId: ++requestIdRef.current,
      });
    }, 120_000);

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
  ]);

  const updateFilter = (setter: (value: string) => void) => (value: string) => {
    setPage(1);
    setter(value);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === withdrawals.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(withdrawals.map((item) => item._id));
    }
  };

  const handleDateRangeChange = (value: string) => {
    setPage(1);
    setDateRange(value);
    if (value !== "custom") {
      setStartDate("");
      setEndDate("");
    }
  };

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return;

    try {
      setBulkLoading(true);
      await bulkApproveWithdrawals(selectedIds);
      setSelectedIds([]);
      setShowBulkApproveConfirm(false);
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setBulkLoading(false);
    }
  };

  async function loadData(options?: {
    silent?: boolean;
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
        options?.signal
      );

      if (options?.signal?.aborted || requestId !== requestIdRef.current) {
        return;
      }

      setWithdrawals(response.data ?? []);
      setTotalPages(response.pages ?? response.totalPages ?? 0);
      setTotalRecords(response.totalCount ?? response.total ?? 0);
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

  const columns: GridColumn<Withdrawal>[] = [
    {
      key: "customer",
      title: "Customer",
      width: "minmax(140px, 1.2fr)",
      render: (row) => (
        <div className="flex items-center gap-2 min-w-0">
          <input
            type="checkbox"
            checked={selectedIds.includes(row._id)}
            onChange={() => toggleSelect(row._id)}
            className="h-4 w-4 shrink-0 rounded border-slate-300"
          />
          <div className="min-w-0">
            <div className="text-xs font-medium truncate" title={row.name}>
              {row.name}
            </div>
            <div className="text-xs text-slate-500 truncate" title={row.email}>
              {row.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "amount",
      title: "Amount",
      width: "85px",
      align: "center",
      truncate: false,
      render: (row) => (
        <div className="relative inline-flex">
          <span
            className="text-xs font-medium text-green-500 cursor-pointer"
            title="Click to copy"
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard(row._id, "amount", row.amount.toString());
            }}
          >
            {Number(row.amount).toFixed(2)}
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
      width: "85px",
      render: (row) => {
        let variant:
          | "success"
          | "info"
          | "warning"
          | "danger"
          | "secondary" = "secondary";

        switch (row.walletType.toLowerCase()) {
          case "staking":
            variant = "success";
            break;
          case "affiliate":
            variant = "info";
            break;
          case "royalty":
            variant = "warning";
            break;
          case "booster":
            variant = "secondary";
            break;
          default:
            variant = "danger";
        }

        return <Badge variant={variant}>{row.walletType}</Badge>;
      },
    },
    {
      key: "address",
      title: "Wallet Address",
      width: "minmax(110px, 1fr)",
      truncate: false,
      render: (row) => (
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className="text-xs text-slate-500 font-mono shrink-0"
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
              className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
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
      width: "85px",
      render: (row) => (
        <Badge
          variant={
            row.status === "approved"
              ? "success"
              : row.status === "pending"
                ? "warning"
                : "danger"
          }
        >
          {row.status}
        </Badge>
      ),
    },
    {
      key: "token",
      title: "Token",
      width: "70px",
      align: "center",
      render: (row) => {
        const token = (row.token || "").toLowerCase();

        return (
          <Badge
            variant={
              token === "mtht"
                ? "success"
                : token === "usdt"
                  ? "warning"
                  : token === "btmeta"
                    ? "danger"
                    : "secondary"
            }
          >
            {token ? token.toUpperCase() : "N/A"}
          </Badge>
        );
      },
    },
    {
      key: "date",
      title: "Date",
      width: "115px",
      render: (row) => {
        const { date, time } = formatToIST(row.createdAt);
        return (
          <div className="min-w-0" title={`${date} ${time}`}>
            <div className="text-xs text-slate-600 dark:text-slate-300 truncate">
              {date}
            </div>
            <div className="text-xs text-slate-500 truncate">{time}</div>
          </div>
        );
      },
    },
    {
      key: "actions",
      title: "Actions",
      width: "130px",
      truncate: false,
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedWithdrawal(row);
              setShowModal(true);
            }}
            className="w-8 h-8 rounded-lg bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white transition flex items-center justify-center cursor-pointer shrink-0"
          >
            <Eye size={16} />
          </button>
          <div className="flex items-center gap-1.5 min-w-0">
            <ToggleSwitch
              checked={row.status === "approved"}
              onChange={(checked) => {
                console.log("Approve:", row._id, checked);
              }}
            />
            <span className="text-xs text-slate-500 hidden xl:inline">
              Approve
            </span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
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
              { label: "Approved", value: "approved" },
              { label: "Rejected", value: "rejected" },
            ],
          },
          {
            label: "Wallet",
            value: walletType,
            onChange: updateFilter(setWalletType),
            options: [
              { label: "Staking", value: "staking" },
              { label: "Affiliate", value: "affiliate" },
              { label: "Royalty", value: "royalty" },
              { label: "Booster", value: "booster" },
              { label: "Swap", value: "swap" },
            ],
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
        onRefresh={loadData}
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

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={
              withdrawals.length > 0 &&
              selectedIds.length === withdrawals.length
            }
            onChange={toggleSelectAll}
            className="h-4 w-4 rounded border-slate-300"
          />
          <span className="text-sm text-slate-600 dark:text-slate-300">
            Select All
          </span>
        </label>

        <Button
          variant="success"
          disabled={selectedIds.length === 0}
          loading={bulkLoading}
          onClick={() => setShowBulkApproveConfirm(true)}
        >
          <CheckCircle2 size={18} />
          Approve Selected
          {selectedIds.length > 0 && ` (${selectedIds.length})`}
        </Button>
      </div>

      <DataGrid columns={columns} data={withdrawals} loading={loading} />

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

      {showBulkApproveConfirm && (
        <ConfirmModal
          title="Approve Selected"
          message={`Are you sure you want to approve ${selectedIds.length} selected withdrawal${selectedIds.length === 1 ? "" : "s"}?`}
          confirmLabel="Approve"
          cancelLabel="Cancel"
          loading={bulkLoading}
          onConfirm={handleBulkApprove}
          onCancel={() => {
            if (!bulkLoading) setShowBulkApproveConfirm(false);
          }}
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
