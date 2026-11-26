import { useState } from "react";
import { Slider } from "radix-ui";

type SliderAccent = "slate" | "cyan" | "pink";

export interface FilterSliderProps {
  state: number;
  stateCallback: (val: number) => void;
  min: number;
  max: number;
  step: number;
  sliderLabel: string;
  prefix?: string;
  suffix?: string;
  accent: SliderAccent;
}

const accentClasses: Record<
  SliderAccent,
  {
    text: string;
    placeholder: string;
    range: string;
    thumbBorder: string;
    thumbFocus: string;
  }
> = {
  slate: {
    text: "text-slate-300",
    placeholder: "placeholder-slate-300",
    range: "bg-slate-400",
    thumbBorder: "border-slate-400",
    thumbFocus: "focus:ring-slate-400",
  },
  cyan: {
    text: "text-cyan-300",
    placeholder: "placeholder-cyan-300",
    range: "bg-cyan-400",
    thumbBorder: "border-cyan-400",
    thumbFocus: "focus:ring-cyan-400",
  },
  pink: {
    text: "text-pink-300",
    placeholder: "placeholder-pink-300",
    range: "bg-pink-400",
    thumbBorder: "border-pink-400",
    thumbFocus: "focus:ring-pink-400",
  },
};

export const FilterSlider: React.FC<FilterSliderProps> = ({
  state,
  stateCallback,
  min,
  max,
  step,
  sliderLabel,
  prefix,
  suffix,
  accent = "slate",
}) => {
  const [inputState, setInputState] = useState("");

  return (
    <div className="space-y-2">
      <div className={`flex items-center justify-between text-sm ${accentClasses[accent].text}`}>
        <span>{sliderLabel}</span>
        <span className="flex flex-row gap-x-1">
          <p>{prefix}</p>
          <input
            type="number"
            value={inputState}
            placeholder={state.toString()}
            min={min}
            max={max}
            className={`[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-right ${accentClasses[accent].placeholder}`}
            onChange={(e) => {
              const rawValue = e.currentTarget.value;
              setInputState(rawValue);
              if (rawValue === "") {
                return;
              }
              const value = e.currentTarget.valueAsNumber;
              if (Number.isFinite(value)) {
                stateCallback(Math.min(max, Math.max(0, value)));
              }
            }}
          />
          <p>{suffix}</p>
        </span>
      </div>
      <Slider.Root
        value={[state]}
        onValueChange={([val]) => {
          stateCallback(val);
          setInputState("");
        }}
        min={min}
        max={max}
        step={step}
        className="relative flex w-full touch-none select-none items-center py-1 cursor-pointer"
      >
        <Slider.Track className="relative h-2 grow rounded-full bg-slate-800 border border-slate-700/80">
          <Slider.Range className={`absolute h-full rounded-full ${accentClasses[accent].range}`} />
        </Slider.Track>
        <Slider.Thumb
          className={`block h-4 w-4 rounded-full border-2 bg-slate-950 shadow-md transition-colors hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${accentClasses[accent].thumbBorder} ${accentClasses[accent].thumbFocus}`}
        />
      </Slider.Root>
      <div className="flex justify-between text-[11px] text-slate-500">
        <span>0</span>
        <span>
          {prefix}
          {max}
          {suffix}
        </span>
      </div>
    </div>
  );
};
