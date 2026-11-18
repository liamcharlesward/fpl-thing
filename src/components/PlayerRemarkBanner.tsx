import { type PlayerRemark } from "../services/PlayerRemarkService";
import { LuInfo, LuArrowUp, LuArrowDown, LuGem } from "react-icons/lu";

export const PlayerRemarkBanner = (remark: PlayerRemark) => {
  const getBannerStyle = () => {
    switch (remark.type) {
      case "positive":
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-200";
      case "gem":
        return "border-blue-500/30 bg-blue-500/10 text-blue-200";
      case "negative":
        return "border-rose-500/30 bg-rose-500/10 text-rose-200";
      case "information":
        return "border-slate-500/30 bg-slate-500/10 text-slate-200";
    }
  };

  const renderIcon = () => {
    switch (remark.type) {
      case "positive":
        return <LuArrowUp size={14} className="mt-0.5 shrink-0 text-emerald-300" />;
      case "gem":
        return <LuGem size={14} className="mt-0.5 shrink-0 text-blue-300" />;
      case "negative":
        return <LuArrowDown size={14} className="mt-0.5 shrink-0 text-rose-300" />;
      case "information":
        return <LuInfo size={14} className="mt-0.5 shrink-0 text-slate-300" />;
    }
  };

  return (
    <div className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-sm ${getBannerStyle()}`}>
      {renderIcon()}
      <span>{remark.text}</span>
    </div>
  );
};
