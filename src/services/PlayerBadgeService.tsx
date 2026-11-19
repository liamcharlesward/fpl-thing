import { Badge } from "../components/Badge";
import { LuCheck, LuBriefcaseMedical, LuGavel, LuPlaneTakeoff } from "react-icons/lu";
import { GiSoccerKick, GiSoccerField, GiDefensiveWall, GiGoalKeeper } from "react-icons/gi";

export const getStatusBadge = (status: string) => {
  switch (status) {
    case "a":
      return <Badge icon={LuCheck} text="Available" className="text-emerald-600 bg-emerald-600/10" border />;
    case "i":
      return <Badge icon={LuBriefcaseMedical} text="Injured" className="text-rose-600 bg-rose-600/10" border />;
    case "s":
      return <Badge icon={LuGavel} text="Suspended" className="text-amber-600 bg-amber-600/10" border />;
    default:
      return <Badge icon={LuPlaneTakeoff} text="Unavailable" className="text-slate-600 bg-slate-600/10" border />;
  }
};

export interface positionBadgeProps {
  position: string;
  hasBorder: boolean;
  hasIcon: boolean;
  longPosName: boolean;
}

export const getPositionBadge = (props: positionBadgeProps) => {
  switch (props.position) {
    case "FWD":
      return (
        <Badge
          className="border-pink-400/30 bg-pink-500/10 text-pink-200"
          text={props.longPosName ? "Forward" : props.position}
          icon={props.hasIcon ? GiSoccerKick : undefined}
          border={props.hasBorder}
        />
      );
    case "MID":
      return (
        <Badge
          className="border-violet-400/30 bg-violet-500/10 text-violet-200"
          text={props.longPosName ? "Midfielder" : props.position}
          icon={props.hasIcon ? GiSoccerField : undefined}
          border={props.hasBorder}
        />
      );
    case "DEF":
      return (
        <Badge
          className="border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
          text={props.longPosName ? "Defender" : props.position}
          icon={props.hasIcon ? GiDefensiveWall : undefined}
          border={props.hasBorder}
        />
      );
    default:
      return (
        <Badge
          className="border-cyan-400/30 bg-cyan-500/10 text-cyan-200"
          text={props.longPosName ? "Goalkeeper" : props.position}
          icon={props.hasIcon ? GiGoalKeeper : undefined}
          border={props.hasBorder}
        />
      );
  }
};
