import type { ComponentProps } from "react";

export type ButtonProps = ComponentProps<"button">;

export const Button: React.FC<ButtonProps> = ({ children, className = "", type = "button", ...props }) => {
  return (
    <button
      type={type}
      className={`flex h-9 min-w-9 cursor-pointer items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};
