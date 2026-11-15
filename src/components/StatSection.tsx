import { StatBox, type StatBoxProps } from "./StatBox";

export interface StatSectionProps {
  sectionTitle: string;
  stats: StatBoxProps[];
}

export const StatSection: React.FC<StatSectionProps> = ({ sectionTitle, stats }) => {
  return (
    <div className="rounded-2xl border border-slate-700/80 bg-slate-900/85 p-4 shadow-[0_10px_22px_rgba(15,23,42,0.25)]">
      <div className="mb-3 border-b border-slate-800 pb-2">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">{sectionTitle}</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat, index) => {
          return <StatBox key={`${stat.label}-${index}`} icon={stat.icon} label={stat.label} value={stat.value} />;
        })}
      </div>
    </div>
  );
};
