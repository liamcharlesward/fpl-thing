import { type ReactNode } from "react";

export interface ButtonProps {
  children: ReactNode | ReactNode[];
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 w-9 cursor-pointer items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
    >
      {children}
    </button>
  );
};
