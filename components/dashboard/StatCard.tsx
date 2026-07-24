import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  bg: string;
}

export default function StatCard({ title, value, icon: Icon, bg }: StatCardProps) {
  return (
    <div
      className="
        bg-white dark:bg-slate-900
        rounded-xl shadow-sm
        border border-slate-200 dark:border-slate-800
        px-3.5 py-3 hover:shadow-md transition
      "
    >
      <div className="flex justify-between items-center gap-3">
        <div className="min-w-0">
          <p className="text-slate-500 dark:text-slate-400 text-xs truncate">
            {title}
          </p>

          <h2 className="text-xl font-bold mt-1 text-slate-800 dark:text-white truncate">
            {typeof value === "number" ? value.toLocaleString() : value}
          </h2>
        </div>

        <div
          className={`${bg} w-9 h-9 shrink-0 rounded-lg flex items-center justify-center`}
        >
          <Icon className="text-white" size={18} />
        </div>
      </div>
    </div>
  );
}
