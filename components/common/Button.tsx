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
      "bg-blue-600 hover:bg-blue-700 text-white",

    success:
      "bg-green-600 hover:bg-green-700 text-white",

    danger:
      "bg-red-600 hover:bg-red-700 text-white",

    secondary:
      "bg-slate-700 hover:bg-slate-600 text-white",

    outline:
      "border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700",
  };

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={clsx(
        "h-10 px-4 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
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