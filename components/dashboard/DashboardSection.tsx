import { LucideIcon } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";

export interface DashboardCardItem {
  title: string;
  value: string | number;
  icon: LucideIcon;
  bg: string;
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
  const gridClass =
    columns === 5
      ? "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3"
      : "grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3";

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
        {title}
      </h2>

      <div className={gridClass}>
        {cards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            bg={card.bg}
          />
        ))}
      </div>
    </section>
  );
}
