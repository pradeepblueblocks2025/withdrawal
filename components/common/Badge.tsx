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
      "bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/20",

    danger:
      "bg-rose-50 text-rose-600 border border-rose-100 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/20",

    warning:
      "bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/20",

    info:
      "bg-sky-50 text-sky-600 border border-sky-100 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/20",

    purple:
      "bg-violet-50 text-violet-600 border border-violet-100 dark:bg-purple-500/15 dark:text-purple-400 dark:border-purple-500/20",

    secondary:
      "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-500/15 dark:text-slate-300 dark:border-slate-500/20",
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
