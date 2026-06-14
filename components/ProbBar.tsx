import { cn } from "@/lib/utils";

interface ProbBarProps {
  home: number;
  draw: number;
  away: number;
  /** Muestra la fila de leyenda 1 / X / 2 con porcentajes. */
  showLegend?: boolean;
  className?: string;
}

/** Barra apilada de probabilidad 1·X·2 (victoria local / empate / visitante). */
export default function ProbBar({
  home,
  draw,
  away,
  showLegend = true,
  className,
}: ProbBarProps) {
  const total = Math.max(1, home + draw + away);
  const h = (home / total) * 100;
  const d = (draw / total) * 100;
  const a = (away / total) * 100;

  return (
    <div className={cn("w-full", className)}>
      <div
        className="flex h-2 w-full overflow-hidden rounded-full"
        role="img"
        aria-label={`Probabilidad: local ${home}%, empate ${draw}%, visitante ${away}%`}
      >
        <span className="block h-full bg-pitch" style={{ width: `${h}%` }} />
        <span className="block h-full bg-slate-300 dark:bg-slate-600" style={{ width: `${d}%` }} />
        <span className="block h-full bg-navy-700 dark:bg-blue-500" style={{ width: `${a}%` }} />
      </div>

      {showLegend && (
        <div className="mt-2 grid grid-cols-3 gap-1 text-center">
          <ProbCell tag="1" value={home} tone="text-pitch-600 dark:text-pitch-300" />
          <ProbCell tag="X" value={draw} tone="text-slate-500 dark:text-slate-400" />
          <ProbCell tag="2" value={away} tone="text-navy-700 dark:text-blue-300" />
        </div>
      )}
    </div>
  );
}

function ProbCell({
  tag,
  value,
  tone,
}: {
  tag: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="leading-tight">
      <div className={cn("stat-num text-sm font-bold", tone)}>{value}%</div>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {tag}
      </div>
    </div>
  );
}
