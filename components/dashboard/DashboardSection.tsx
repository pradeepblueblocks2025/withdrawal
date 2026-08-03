import { LucideIcon } from "lucide-react";
import StatCard, { StatAccent } from "@/components/dashboard/StatCard";

export interface DashboardCardItem {
  title: string;
  value: string | number;
  icon: LucideIcon;
  accent: StatAccent;
  subtitle?: string;
}

interface DashboardSectionProps {
  title: string;
  cards: DashboardCardItem[];
  columns?: 4 | 5;
}

export default function DashboardSection({
  title,
  cards,
  columns = 4,
}: DashboardSectionProps) {
  // Keep cards wide enough so labels never clip
  const gridClass =
    columns === 5
      ? "grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      : "grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4";

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
        {title}
      </h2>

      <div className={gridClass}>
        {cards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            accent={card.accent}
            subtitle={card.subtitle}
          />
        ))}
      </div>
    </section>
  );
}
