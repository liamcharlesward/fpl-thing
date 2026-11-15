import type { IconType } from "react-icons";

export interface StatBoxProps {
  icon: IconType;
  label: string;
  value: string;
  valueStyling?: React.CSSProperties;
}

const defaultValueStyling = {
  fontSize: "1.05rem",
  fontWeight: 700,
};

export const StatBox = (props: StatBoxProps) => {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/80 p-2.5 shadow-sm shadow-slate-950/40">
      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">
        {props.icon && <props.icon size={12} className="text-slate-300" />}
        <span>{props.label}</span>
      </div>
      <div className="mt-2 text-base font-semibold text-slate-50" style={props.valueStyling ?? defaultValueStyling}>
        {props.value}
      </div>
    </div>
  );
};
