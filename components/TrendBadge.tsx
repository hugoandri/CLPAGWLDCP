import { cn } from "@/lib/utils";

interface TrendBadgeProps {
  label: string;
  className?: string;
}

// Estilo e icono según el tipo de tendencia.
const TREND_MAP: Record<string, { icon: string; cls: string }> = {
  Sorpresa: { icon: "📈", cls: "bg-pitch/10 text-pitch-700 dark:text-pitch-300" },
  "En alza": { icon: "🔥", cls: "bg-orange-500/10 text-orange-600 dark:text-orange-400" },
  Líder: { icon: "👑", cls: "bg-gold/15 text-gold-600 dark:text-gold-400" },
  Clasificación: { icon: "🎯", cls: "bg-blue-500/10 text-blue-600 dark:text-blue-300" },
  Herramienta: { icon: "🧮", cls: "bg-violet-500/10 text-violet-600 dark:text-violet-300" },
  Análisis: { icon: "🔍", cls: "bg-slate-500/10 text-slate-600 dark:text-slate-300" },
  Datos: { icon: "📊", cls: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300" },
};

const FALLBACK = { icon: "⚽", cls: "bg-slate-500/10 text-slate-600 dark:text-slate-300" };

export default function TrendBadge({ label, className }: TrendBadgeProps) {
  const { icon, cls } = TREND_MAP[label] ?? FALLBACK;
  return (
    <span className={cn("chip", cls, className)}>
      <span aria-hidden>{icon}</span>
      {label}
    </span>
  );
}
