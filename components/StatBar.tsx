import { cn, pctWidth } from "@/lib/utils";

interface StatBarProps {
  label: string;
  value: number; // 0–100
  /** Texto a la derecha; por defecto el valor numérico. */
  display?: string;
  /** Color de la barra. */
  tone?: "pitch" | "navy" | "gold";
  className?: string;
}

const TONE: Record<NonNullable<StatBarProps["tone"]>, string> = {
  pitch: "bg-pitch",
  navy: "bg-navy-700 dark:bg-blue-400",
  gold: "bg-gold",
};

/** Barra horizontal para fortalezas y métricas (sin librerías). */
export default function StatBar({
  label,
  value,
  display,
  tone = "pitch",
  className,
}: StatBarProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {label}
        </span>
        <span className="stat-num text-sm font-bold text-navy dark:text-slate-100">
          {display ?? value}
        </span>
      </div>
      <div className="prob-track">
        <div
          className={cn("h-full origin-left rounded-full animate-bar-grow", TONE[tone])}
          style={{ width: pctWidth(value) }}
          role="meter"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        />
      </div>
    </div>
  );
}
