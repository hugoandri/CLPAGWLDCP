import { cn } from "@/lib/utils";
import type { CoverageEvent, CoverageEventType } from "@/lib/fifaLive";

const EVENT_CONFIG: Record<CoverageEventType, { icon: string; label: string; color: string }> = {
  goal:       { icon: "⚽", label: "Gol",           color: "bg-pitch/10 border-pitch/30" },
  own_goal:   { icon: "⚽", label: "Gol en propia", color: "bg-red-500/10 border-red-400/30" },
  penalty:    { icon: "⚽", label: "Penalti",        color: "bg-pitch/10 border-pitch/30" },
  yellow:     { icon: "🟨", label: "Amarilla",       color: "bg-yellow-400/10 border-yellow-400/30" },
  red:        { icon: "🟥", label: "Roja",           color: "bg-red-500/10 border-red-400/30" },
  yellow_red: { icon: "🟥", label: "2ª Amarilla",   color: "bg-red-500/10 border-red-400/30" },
  sub:        { icon: "🔄", label: "Cambio",         color: "bg-slate-400/10 border-slate-300/30" },
  halftime:   { icon: "⏸",  label: "Descanso",      color: "bg-amber-400/10 border-amber-300/30" },
  kickoff:    { icon: "🟢", label: "Inicio",         color: "bg-slate-100 border-slate-200 dark:bg-white/5 dark:border-white/10" },
};

function MinuteBadge({ raw }: { raw: string }) {
  return (
    <span className="w-12 shrink-0 text-right text-xs font-bold tabular-nums text-slate-500 dark:text-slate-400">
      {raw}
    </span>
  );
}

function TeamDot({ team, homeName, awayName }: { team?: "home" | "away"; homeName: string; awayName: string }) {
  if (!team) return null;
  return (
    <span className={cn(
      "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
      team === "home"
        ? "bg-pitch/15 text-pitch-700 dark:text-pitch-300"
        : "bg-navy-700/15 text-navy-700 dark:text-blue-300"
    )}>
      {team === "home" ? homeName : awayName}
    </span>
  );
}

interface Props {
  events: CoverageEvent[];
  homeName: string;
  awayName: string;
  aiNotes?: string;
  period: number | null;
  matchStatus: string;
}

export default function CoverageFeed({ events, homeName, awayName, aiNotes, period, matchStatus }: Props) {
  const isActive = matchStatus === "live" || matchStatus === "halftime";

  const periodLabel =
    period === 3 ? "Primer tiempo"
    : period === 4 ? "Descanso"
    : period === 5 ? "Segundo tiempo"
    : period === 6 ? "Prórroga"
    : period === 0 ? "Partido finalizado"
    : null;

  return (
    <div className="space-y-4">
      {/* AI analysis */}
      {aiNotes && (
        <div className="card border-l-4 border-pitch p-4">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">
            {matchStatus === "upcoming" ? "Previa" : "Análisis en directo · IA"}
          </p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{aiNotes}</p>
        </div>
      )}

      {/* Period header */}
      {periodLabel && (
        <div className="flex items-center gap-3">
          {isActive && (
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-red-500" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
          )}
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {periodLabel}
          </span>
          <span className="flex-1 border-t border-slate-200 dark:border-white/10" />
        </div>
      )}

      {/* Empty state */}
      {events.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-200 dark:border-white/10 p-8 text-center">
          <p className="text-slate-400 dark:text-slate-500 text-sm">
            {isActive ? "Esperando eventos del partido…" : "Sin eventos registrados"}
          </p>
        </div>
      )}

      {/* Events feed */}
      <ol className="relative space-y-2">
        {events.map((ev, i) => {
          const cfg = EVENT_CONFIG[ev.type];
          const isGoal = ev.type === "goal" || ev.type === "own_goal" || ev.type === "penalty";

          return (
            <li
              key={i}
              className={cn(
                "flex items-start gap-3 rounded-xl border px-4 py-3 transition-all",
                cfg.color,
                isGoal && "ring-1 ring-pitch/20 dark:ring-pitch/30",
              )}
            >
              {/* Icon */}
              <span className="mt-0.5 text-base shrink-0">{cfg.icon}</span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className="font-semibold text-navy dark:text-slate-100 text-sm">
                    {ev.primary}
                  </span>
                  {isGoal && ev.score && (
                    <span className="font-display font-extrabold text-pitch-600 dark:text-pitch-300 text-sm">
                      {ev.score}
                    </span>
                  )}
                  {ev.secondary && ev.type === "sub" && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      → {ev.secondary}
                    </span>
                  )}
                  {ev.secondary && isGoal && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      (asist. {ev.secondary})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-slate-400">{cfg.label}</span>
                  {ev.team && (
                    <TeamDot team={ev.team} homeName={homeName} awayName={awayName} />
                  )}
                </div>
              </div>

              {/* Minute */}
              <MinuteBadge raw={ev.minuteRaw} />
            </li>
          );
        })}

        {/* Kickoff anchor */}
        {events.length > 0 && (
          <li className={cn("flex items-start gap-3 rounded-xl border px-4 py-3", EVENT_CONFIG.kickoff.color)}>
            <span className="mt-0.5 text-base shrink-0">{EVENT_CONFIG.kickoff.icon}</span>
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-navy dark:text-slate-100 text-sm">Inicio del partido</span>
              <p className="text-[11px] text-slate-400 mt-0.5">{homeName} vs {awayName}</p>
            </div>
            <MinuteBadge raw="1'" />
          </li>
        )}
      </ol>
    </div>
  );
}
