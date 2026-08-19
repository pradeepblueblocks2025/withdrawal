"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

const PORTAL_ID = "app-confirm-modal-root";

function getPortalRoot(): HTMLElement {
  let root = document.getElementById(PORTAL_ID);
  if (!root) {
    root = document.createElement("div");
    root.id = PORTAL_ID;
    document.body.appendChild(root);
  }
  return root;
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
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  const [allowDismiss, setAllowDismiss] = useState(false);
  const onCancelRef = useRef(onCancel);
  const onConfirmRef = useRef(onConfirm);
  const confirmingRef = useRef(false);

  onCancelRef.current = onCancel;
  onConfirmRef.current = onConfirm;

  const showReason = typeof onReasonChange === "function";
  const reasonMissing =
    reasonRequired && showReason && !reason?.trim();

  useEffect(() => {
    setMounted(true);
    // Ignore the click that opened the modal so it can't stack/dismiss instantly
    const timer = window.setTimeout(() => setAllowDismiss(true), 150);
    confirmingRef.current = false;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) {
        onCancelRef.current();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [loading]);

  const handleConfirm = () => {
    if (loading || reasonMissing || confirmingRef.current) return;
    confirmingRef.current = true;
    onConfirmRef.current();
  };

  const handleCancel = () => {
    if (loading || !allowDismiss) return;
    onCancelRef.current();
  };

  const modal = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-5"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleCancel();
      }}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-slate-900"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-700">
          <h2
            id={titleId}
            className="text-lg font-bold text-slate-900 dark:text-white"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading || !allowDismiss}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 p-5">
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
                autoFocus
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 dark:border-white/10 dark:bg-[#1c1f30] dark:text-slate-200 dark:focus:border-violet-500"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 p-5 dark:border-slate-700">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={loading || !allowDismiss}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={confirmVariant}
            loading={loading}
            disabled={reasonMissing}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;
  return createPortal(modal, getPortalRoot());
}
