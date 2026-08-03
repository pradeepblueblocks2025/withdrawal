"use client";

import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Variant =
  | "primary"
  | "success"
  | "danger"
  | "secondary"
  | "outline";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  loading = false,
  className,
  ...props
}: Props) {
  const styles = {
    primary:
      "brand-gradient text-white shadow-sm shadow-indigo-200/60 hover:opacity-95",

    success:
      "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-200/50",

    danger:
      "bg-red-500 hover:bg-red-600 text-white",

    secondary:
      "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm",

    outline:
      "border border-slate-200 dark:border-slate-600 bg-white dark:bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800",
  };

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={clsx(
        "h-11 px-5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer",
        styles[variant],
        className
      )}
    >
      {loading && (
        <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
      )}

      {children}
    </button>
  );
}
