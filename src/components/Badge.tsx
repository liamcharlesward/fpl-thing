import type { IconType } from "react-icons";

export interface BadgeProps {
  icon?: IconType;
  border?: boolean;
  text: string;
  colour: string;
}

export const Badge = (props: BadgeProps) => {
  const baseBadgeStyle = {
    color: `var(--color-${props.colour})`,
    background: `var(--color-${props.colour}-bg)`,
    display: "inline-flex",
    alignItems: "center",
    padding: "0.25rem 0.6rem",
    fontSize: "0.75rem",
    fontWeight: 700,
    textTransform: "uppercase",
    borderRadius: "4px",
    gap: "0.25rem",
  };

  const style = {
    ...baseBadgeStyle,
    ...(props.border ? { border: "1px solid" } : {}),
  };

  const Icon = props.icon;

  return (
    <div style={style}>
      {Icon && <Icon size={14} style={{ display: "inline" }} />}
      {props.text}
    </div>
  );
};
