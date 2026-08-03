"use client";

import clsx from "clsx";

export type BadgeVariant =
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "secondary"
  | "purple";

interface Props {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
}

export default function Badge({
  children,
  variant = "secondary",
  size = "sm",
}: Props) {
  const variants = {
    success:
      "bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-400/30",

    danger:
      "bg-rose-50 text-rose-700 border border-rose-100 dark:bg-red-500/20 dark:text-red-300 dark:border-red-400/30",

    warning:
      "bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-400/30",

    info:
      "bg-sky-50 text-sky-700 border border-sky-100 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-400/30",

    purple:
      "bg-violet-50 text-violet-700 border border-violet-100 dark:bg-violet-500/20 dark:text-violet-300 dark:border-violet-400/30",

    secondary:
      "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-500/20 dark:text-slate-200 dark:border-slate-400/30",
  };

  const sizes = {
    sm: "px-2.5 py-1 text-[11px]",
    md: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center rounded-full font-semibold capitalize",
        variants[variant],
        sizes[size]
      )}
    >
      {children}
    </span>
  );
}
