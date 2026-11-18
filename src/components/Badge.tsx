import type { IconType } from "react-icons";

export interface BadgeProps {
  icon?: IconType;
  border?: boolean;
  text: string;
  teamColour?: string;
  className?: string;
}

export const Badge = (props: BadgeProps) => {
  const baseBadgeStyle = {
    display: "inline-flex",
    alignItems: "center",
    padding: "0.25rem 0.6rem",
    fontSize: "0.75rem",
    fontWeight: 700,
    textTransform: "uppercase",
    gap: "0.25rem",
  };

  const teamColourBadgeStyle = {
    color: `var(--color-${props.teamColour})`,
    background: `var(--color-${props.teamColour}-bg)`,
  };

  const style = {
    ...baseBadgeStyle,
    ...(props.teamColour ? teamColourBadgeStyle : {}),
    ...(props.border ? { border: "1px solid" } : {}),
  };

  const Icon = props.icon;

  return (
    <div style={style} className={`rounded-lg ${props.className}`}>
      {Icon && <Icon size={14} style={{ display: "inline" }} />}
      {props.text}
    </div>
  );
};
