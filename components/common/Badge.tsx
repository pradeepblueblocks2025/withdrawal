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
      "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",

    danger:
      "bg-red-500/15 text-red-400 border border-red-500/20",

    warning:
      "bg-amber-500/15 text-amber-400 border border-amber-500/20",

    info:
      "bg-blue-500/15 text-blue-400 border border-blue-500/20",

    purple:
      "bg-purple-500/15 text-purple-400 border border-purple-500/20",

    secondary:
      "bg-slate-500/15 text-slate-300 border border-slate-500/20",
  };

  const sizes = {
    sm: "px-2.5 py-1 text-xs",
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