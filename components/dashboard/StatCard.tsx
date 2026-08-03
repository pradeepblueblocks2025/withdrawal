"use client";

import { useId } from "react";
import { LucideIcon } from "lucide-react";

export type StatAccent = "purple" | "orange" | "green" | "blue" | "amber" | "teal";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  accent?: StatAccent;
  subtitle?: string;
}

const accentStyles: Record<
  StatAccent,
  {
    iconWrap: string;
    icon: string;
    waveFrom: string;
    waveTo: string;
    stroke: string;
  }
> = {
  purple: {
    iconWrap: "bg-violet-100 dark:bg-violet-500/25",
    icon: "text-violet-600 dark:text-violet-300",
    waveFrom: "rgba(139,92,246,0.28)",
    waveTo: "rgba(139,92,246,0.02)",
    stroke: "rgba(139,92,246,0.55)",
  },
  orange: {
    iconWrap: "bg-orange-100 dark:bg-orange-500/25",
    icon: "text-orange-500 dark:text-orange-300",
    waveFrom: "rgba(249,115,22,0.28)",
    waveTo: "rgba(249,115,22,0.02)",
    stroke: "rgba(249,115,22,0.55)",
  },
  green: {
    iconWrap: "bg-emerald-100 dark:bg-emerald-500/25",
    icon: "text-emerald-600 dark:text-emerald-300",
    waveFrom: "rgba(16,185,129,0.28)",
    waveTo: "rgba(16,185,129,0.02)",
    stroke: "rgba(16,185,129,0.55)",
  },
  blue: {
    iconWrap: "bg-sky-100 dark:bg-sky-500/25",
    icon: "text-sky-600 dark:text-sky-300",
    waveFrom: "rgba(14,165,233,0.28)",
    waveTo: "rgba(14,165,233,0.02)",
    stroke: "rgba(14,165,233,0.55)",
  },
  amber: {
    iconWrap: "bg-amber-100 dark:bg-amber-500/25",
    icon: "text-amber-600 dark:text-amber-300",
    waveFrom: "rgba(245,158,11,0.28)",
    waveTo: "rgba(245,158,11,0.02)",
    stroke: "rgba(245,158,11,0.55)",
  },
  teal: {
    iconWrap: "bg-teal-100 dark:bg-teal-500/25",
    icon: "text-teal-600 dark:text-teal-300",
    waveFrom: "rgba(20,184,166,0.28)",
    waveTo: "rgba(20,184,166,0.02)",
    stroke: "rgba(20,184,166,0.55)",
  },
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  accent = "purple",
  subtitle = "All time",
}: StatCardProps) {
  const theme = accentStyles[accent];
  const reactId = useId().replace(/:/g, "");
  const gradientId = `wave-${accent}-${reactId}`;
  const display =
    typeof value === "number" ? value.toLocaleString() : value;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#15192b] px-5 pt-5 pb-4 min-h-[148px] shadow-[0_8px_30px_rgba(15,23,42,0.06)] border border-slate-100/80 dark:border-white/5">
      <div className="relative z-10 flex items-start gap-3">
        <div
          className={`h-12 w-12 shrink-0 rounded-2xl ${theme.iconWrap} flex items-center justify-center`}
        >
          <Icon className={theme.icon} size={22} strokeWidth={2} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[13px] leading-snug font-medium text-slate-500 dark:text-slate-300">
            {title}
          </p>
          <h3 className="mt-1.5 text-[22px] font-bold leading-tight tracking-tight text-slate-900 dark:text-white break-words">
            {display}
          </h3>
        </div>
      </div>

      <p className="relative z-10 mt-6 text-xs font-medium text-slate-400 dark:text-slate-400">
        {subtitle}
      </p>

      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] w-full"
        viewBox="0 0 320 90"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={theme.waveFrom} />
            <stop offset="100%" stopColor={theme.waveTo} />
          </linearGradient>
        </defs>
        <path
          d="M0,58 C40,40 70,72 110,50 C150,28 180,68 220,46 C260,24 290,42 320,30 L320,90 L0,90 Z"
          fill={`url(#${gradientId})`}
        />
        <path
          d="M0,58 C40,40 70,72 110,50 C150,28 180,68 220,46 C260,24 290,42 320,30"
          fill="none"
          stroke={theme.stroke}
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
