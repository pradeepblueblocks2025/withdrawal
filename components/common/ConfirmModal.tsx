"use client";

import { X } from "lucide-react";
import Button from "@/components/common/Button";

interface Props {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  confirmVariant?: "success" | "danger" | "primary";
  reasonLabel?: string;
  reasonPlaceholder?: string;
  reason?: string;
  onReasonChange?: (value: string) => void;
  reasonRequired?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  confirmVariant = "success",
  reasonLabel,
  reasonPlaceholder = "Enter reason...",
  reason,
  onReasonChange,
  reasonRequired = false,
  onConfirm,
  onCancel,
}: Props) {
  const showReason = typeof onReasonChange === "function";
  const reasonMissing =
    reasonRequired && showReason && !reason?.trim();

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-5">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 p-5">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>

          {showReason && (
            <div>
              {reasonLabel && (
                <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">
                  {reasonLabel}
                  {reasonRequired && (
                    <span className="text-rose-500"> *</span>
                  )}
                </label>
              )}
              <textarea
                value={reason ?? ""}
                onChange={(e) => onReasonChange?.(e.target.value)}
                placeholder={reasonPlaceholder}
                rows={3}
                disabled={loading}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 dark:border-white/10 dark:bg-[#1c1f30] dark:text-slate-200 dark:focus:border-violet-500"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-700 p-5">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariant}
            loading={loading}
            disabled={reasonMissing}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
