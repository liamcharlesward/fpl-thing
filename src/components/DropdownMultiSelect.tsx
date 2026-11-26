import type { ReactNode } from "react";
import { DropdownMenu } from "radix-ui";
import { LuChevronDown, LuCheck } from "react-icons/lu";

export interface DropdownMultiSelectOption {
  id: number;
  name: string;
}

export interface DropdownMultiSelectProps {
  options: DropdownMultiSelectOption[];
  selected: number[];
  label: string;
  setSelected: (val: number[]) => void;
  showAllOption?: boolean;
  customTrigger?: ReactNode;
}

const optionStyling =
  "flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-200 outline-none transition-colors hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white";

export const DropdownMultiSelect: React.FC<DropdownMultiSelectProps> = ({
  options,
  selected,
  showAllOption,
  label,
  setSelected,
}) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <div className="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2.5 text-sm text-slate-100 focus:border-sky-400 focus:outline-none flex flex-row items-center justify-between w-full cursor-pointer">
          <span>{label}</span>
          <LuChevronDown className="text-slate-400" size={16} />
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={6}
          className="z-50 min-w-50 max-h-60 overflow-y-auto rounded-xl border border-slate-700/80 bg-slate-900/95 p-1.5 shadow-xl backdrop-blur-md outline-none"
        >
          {showAllOption && (
            <>
              <DropdownMenu.Item
                className={optionStyling}
                onSelect={() =>
                  selected.length === options.length ? setSelected([]) : setSelected(options.map((x) => x.id).concat())
                }
              >
                <span>All</span>
                {selected.length === options.length && <LuCheck className="text-cyan-400" size={16} />}
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="mb-1 pb-1 border-b border-slate-700/70" />
            </>
          )}
          {options.map((option) => {
            const isSelected = selected.some((item) => item === option.id);

            return (
              <DropdownMenu.Item
                key={option.id}
                className={optionStyling}
                onSelect={(e) => {
                  e.preventDefault();
                  const selectedIds = selected.map((item) => item);

                  setSelected(
                    selectedIds.includes(option.id)
                      ? selectedIds.filter((id) => id !== option.id)
                      : [...selectedIds, option.id],
                  );
                }}
              >
                <span>{option.name}</span>
                {isSelected && <LuCheck className="text-cyan-400" size={16} />}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
