import { StatBox, type StatBoxProps } from "./StatBox";

export interface StatSectionProps {
  sectionTitle: string;
  stats: StatBoxProps[];
}

export const StatSection: React.FC<StatSectionProps> = ({ sectionTitle, stats }) => {
  return (
    <div className="mb-2">
      <div className=" w-full border-b mb-2 border-gray-600">
        <h2>{sectionTitle}</h2>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "1rem",
        }}
      >
        {stats.map((stat) => {
          return <StatBox icon={stat.icon} label={stat.label} value={stat.value} />;
        })}
      </div>
    </div>
  );
};
