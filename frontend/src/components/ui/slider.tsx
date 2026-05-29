import type { InputHTMLAttributes } from "react";

import { cn } from "../../lib/utils";

interface SliderProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  valueLabel: string;
}

export function Slider({ label, valueLabel, className, ...props }: SliderProps) {
  return (
    <label className="grid gap-3">
      <span className="flex items-center justify-between gap-4 text-sm text-ink/80">
        <span>{label}</span>
        <span className="rounded-md border border-stroke/20 bg-stroke/10 px-2 py-1 font-mono text-inkLight">
          {valueLabel}
        </span>
      </span>
      <input
        type="range"
        className={cn(
          "h-2 w-full cursor-pointer appearance-none rounded-full bg-stroke/10 accent-stroke outline-none",
          className,
        )}
        {...props}
      />
    </label>
  );
}
