"use client";

import { cn } from "@/lib/utils";

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterTabsProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  "aria-label": string;
  className?: string;
}

/** Pestañas/píldoras de filtro con scroll horizontal en móvil. */
export default function FilterTabs({
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
  className,
}: FilterTabsProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "no-scrollbar flex gap-2 overflow-x-auto pb-1",
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition",
              active
                ? "border-pitch bg-pitch text-white shadow-sm"
                : "border-slate-300 bg-white text-slate-600 hover:border-pitch hover:text-pitch dark:border-white/15 dark:bg-navy-900 dark:text-slate-300",
            )}
          >
            {opt.label}
            {typeof opt.count === "number" && (
              <span
                className={cn(
                  "ml-1.5 rounded-full px-1.5 py-0.5 text-[11px] tabular-nums",
                  active ? "bg-white/20" : "bg-slate-100 dark:bg-white/10",
                )}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
