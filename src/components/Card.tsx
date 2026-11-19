// import type { ReactNode } from "react";
import type { ReactNode } from "react";
import type { IconType } from "react-icons";

interface CardProps {
  headerIcon: IconType;
  title: string;
  subtitle?: string;
  children?: ReactNode | ReactNode[];
}

export const Card: React.FC<CardProps> = (props) => {
  const HeaderIcon = props.headerIcon;

  return (
    <div className="rounded-2xl border border-slate-700/80 bg-slate-900/85 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.35)] backdrop-blur-sm flex-initial h-fit">
      {/* HEADER */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-300">
          <HeaderIcon size={18} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-50">{props.title}</h3>
          {props.subtitle && <p className="text-xs text-slate-400">{props.subtitle}</p>}
        </div>
      </div>
      {props.children}
    </div>
  );
};
