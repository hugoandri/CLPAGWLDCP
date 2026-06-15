import { cn } from "@/lib/utils";
import type { CoverageEvent, CoverageEventType, LiveStats } from "@/lib/fifaLive";

// ─── Event config ────────────────────────────────────────────────────────────

const CFG: Record<CoverageEventType, { icon: string; label: string; dot: string }> = {
  goal:       { icon: "⚽", label: "Gol",           dot: "bg-pitch border-pitch" },
  own_goal:   { icon: "⚽", label: "En propia",      dot: "bg-red-500 border-red-500" },
  penalty:    { icon: "⚽", label: "Penalti",         dot: "bg-pitch border-pitch" },
  yellow:     { icon: "🟨", label: "Amarilla",        dot: "bg-yellow-400 border-yellow-400" },
  red:        { icon: "🟥", label: "Roja",            dot: "bg-red-600 border-red-600" },
  yellow_red: { icon: "🟥", label: "2ª Amarilla",    dot: "bg-red-600 border-red-600" },
  sub:        { icon: "↕",  label: "Cambio",          dot: "bg-slate-400 border-slate-400" },
  halftime:   { icon: "⏸",  label: "Descanso",       dot: "bg-amber-400 border-amber-400" },
  kickoff:    { icon: "●",  label: "Inicio",          dot: "bg-slate-300 border-slate-300" },
};

// ─── Mini stats bar ──────────────────────────────────────────────────────────

function StatRow({
  label, home, away, unit = "",
}: {
  label: string; home: number; away: number; unit?: string;
}) {
  const total = home + away || 1;
  const homePct = Math.round((home / total) * 100);
  return (
    <div className="grid grid-cols-[2rem_1fr_2rem] items-center gap-2 text-xs">
      <span className="text-right font-bold tabular-nums text-navy dark:text-slate-100">
        {home}{unit}
      </span>
      <div>
        <p className="mb-1 text-center text-[10px] text-slate-400">{label}</p>
        <div className="flex h-1.5 overflow-hidden rounded-full">
          <span className="h-full bg-pitch transition-all" style={{ width: `${homePct}%` }} />
          <span className="h-full bg-navy-700 dark:bg-blue-500 transition-all" style={{ width: `${100 - homePct}%` }} />
        </div>
      </div>
      <span className="font-bold tabular-nums text-navy dark:text-slate-100">
        {away}{unit}
      </span>
    </div>
  );
}

function LiveStatsPanel({
  stats, homeName, awayName,
}: {
  stats: LiveStats; homeName: string; awayName: string;
}) {
  const hasAny = stats.possession || stats.shots || stats.shotsOnTarget ||
    stats.corners || stats.fouls || stats.offsides;
  if (!hasAny) return null;

  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
        <span className="text-pitch-600 dark:text-pitch-300 truncate">{homeName}</span>
        <span className="px-2">Estadísticas</span>
        <span className="text-navy-700 dark:text-blue-300 truncate text-right">{awayName}</span>
      </div>
      <div className="space-y-3">
        {stats.possession && (
          <StatRow label="Posesión" home={stats.possession.home} away={stats.possession.away} unit="%" />
        )}
        {stats.shots && (
          <StatRow label="Remates" home={stats.shots.home} away={stats.shots.away} />
        )}
        {stats.shotsOnTarget && (
          <StatRow label="Al arco" home={stats.shotsOnTarget.home} away={stats.shotsOnTarget.away} />
        )}
        {stats.corners && (
          <StatRow label="Córners" home={stats.corners.home} away={stats.corners.away} />
        )}
        {stats.fouls && (
          <StatRow label="Faltas" home={stats.fouls.home} away={stats.fouls.away} />
        )}
        {stats.offsides && (
          <StatRow label="Fuera de juego" home={stats.offsides.home} away={stats.offsides.away} />
        )}
      </div>
    </div>
  );
}

// ─── Single event row ────────────────────────────────────────────────────────

function EventRow({
  ev, homeName, awayName, isLast,
}: {
  ev: CoverageEvent; homeName: string; awayName: string; isLast: boolean;
}) {
  const cfg = CFG[ev.type];
  const isGoal = ev.type === "goal" || ev.type === "own_goal" || ev.type === "penalty";
  const isSub = ev.type === "sub";
  const isSystem = ev.type === "halftime" || ev.type === "kickoff";

  const teamName = ev.team === "home" ? homeName : ev.team === "away" ? awayName : null;

  return (
    <li className="flex gap-0 items-stretch">
      {/* Minute column */}
      <div className="w-14 shrink-0 flex flex-col items-end pr-3 pt-2.5">
        <span className={cn(
          "text-xs font-bold tabular-nums leading-none",
          isGoal ? "text-pitch-600 dark:text-pitch-300 text-sm" : "text-slate-500 dark:text-slate-400",
          ev.minuteRaw === "?'" && "opacity-0",
        )}>
          {ev.minuteRaw}
        </span>
      </div>

      {/* Timeline: dot + vertical line */}
      <div className="flex flex-col items-center w-5 shrink-0">
        <div className={cn(
          "mt-3 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-navy-900 shrink-0 z-10",
          cfg.dot,
          isGoal && "h-3.5 w-3.5 mt-2.5",
        )} />
        {!isLast && (
          <div className="w-px flex-1 bg-slate-200 dark:bg-white/10 min-h-[20px]" />
        )}
      </div>

      {/* Content */}
      <div className={cn("flex-1 pl-3 pb-5", isLast && "pb-1")}>
        {isSystem ? (
          <div className={cn(
            "mt-2 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-widest text-center",
            ev.type === "halftime"
              ? "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"
              : "bg-slate-50 text-slate-500 dark:bg-white/5 dark:text-slate-400",
          )}>
            {cfg.label}
          </div>
        ) : (
          <div className={cn(
            "mt-1.5 rounded-xl border px-3.5 py-3",
            isGoal
              ? "border-pitch/30 bg-pitch/5 ring-1 ring-pitch/10"
              : isSub
              ? "border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/[0.03]"
              : "border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.02]",
          )}>
            {/* Header */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn("text-sm", isSub && "text-slate-400")}>{cfg.icon}</span>
              <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                {cfg.label}
              </span>
              {teamName && (
                <span className={cn(
                  "rounded px-1.5 py-0.5 text-[10px] font-bold",
                  ev.team === "home"
                    ? "bg-pitch/10 text-pitch-700 dark:text-pitch-300"
                    : "bg-navy-700/10 text-navy-700 dark:text-blue-300",
                )}>
                  {teamName}
                </span>
              )}
              {isGoal && ev.score && (
                <span className="ml-auto font-display text-base font-extrabold text-pitch-600 dark:text-pitch-300 tabular-nums">
                  {ev.score}
                </span>
              )}
            </div>

            {/* Primary player */}
            <p className={cn(
              "mt-1 font-semibold text-navy dark:text-slate-100",
              isGoal ? "text-base" : "text-sm",
            )}>
              {isSub ? (
                <span className="flex items-center gap-1.5 text-sm flex-wrap">
                  <span className="text-slate-500 dark:text-slate-400 line-through">{ev.primary}</span>
                  {ev.secondary && (
                    <>
                      <span className="text-slate-400">→</span>
                      <span className="text-navy dark:text-slate-100">{ev.secondary}</span>
                    </>
                  )}
                </span>
              ) : (
                ev.primary
              )}
            </p>

            {/* Assist */}
            {isGoal && ev.secondary && (
              <p className="mt-0.5 text-xs text-slate-400">
                Asist. {ev.secondary}
              </p>
            )}
          </div>
        )}
      </div>
    </li>
  );
}

// ─── Period header ────────────────────────────────────────────────────────────

function PeriodHeader({ period, isActive }: { period: number | null; isActive: boolean }) {
  const label =
    period === 3 ? "Primer tiempo"
    : period === 4 ? "Descanso"
    : period === 5 ? "Segundo tiempo"
    : period === 6 ? "Prórroga"
    : period === 0 ? "Partido finalizado"
    : null;

  if (!label) return null;

  return (
    <div className="flex items-center gap-3 mb-2">
      {isActive && (
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-red-500" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
        </span>
      )}
      <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <span className="flex-1 border-t border-slate-200 dark:border-white/10" />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  events: CoverageEvent[];
  homeName: string;
  awayName: string;
  aiNotes?: string;
  period: number | null;
  matchStatus: string;
  stats?: LiveStats;
}

export default function CoverageFeed({
  events, homeName, awayName, aiNotes, period, matchStatus, stats,
}: Props) {
  const isActive = matchStatus === "live" || matchStatus === "halftime";

  // Build rows inserting a kickoff at the bottom and a half-time divider between periods
  type Row = CoverageEvent | { type: "__ht_divider__" };
  const rows: Row[] = [];
  let htInserted = false;

  for (const ev of events) {
    // When we move from 2H events (>45) into 1H events (≤45), insert HT divider
    if (!htInserted && ev.minuteOrder <= 45) {
      const hasTwoHalfEvents = rows.some(
        (r) => "minuteOrder" in r && r.minuteOrder > 45,
      );
      if (hasTwoHalfEvents) rows.push({ type: "__ht_divider__" });
      htInserted = true;
    }
    rows.push(ev);
  }

  const hasEvents = events.length > 0;

  return (
    <div className="space-y-5">
      {/* AI commentary */}
      {aiNotes && (
        <div className="card border-l-4 border-pitch p-4">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Análisis en directo · IA
          </p>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {aiNotes}
          </p>
        </div>
      )}

      {/* Period label */}
      <PeriodHeader period={period} isActive={isActive} />

      {/* Live stats */}
      {stats && isActive && (
        <LiveStatsPanel stats={stats} homeName={homeName} awayName={awayName} />
      )}

      {/* Empty state */}
      {!hasEvents && (
        <div className="rounded-xl border border-dashed border-slate-200 dark:border-white/10 p-8 text-center">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            {isActive ? "Esperando eventos del partido…" : "Sin eventos registrados"}
          </p>
        </div>
      )}

      {/* Timeline feed */}
      {hasEvents && (
        <ol className="relative">
          {rows.map((row, i) => {
            if ("type" in row && row.type === "__ht_divider__") {
              return (
                <li key={`ht-${i}`} className="flex gap-0 items-center">
                  <div className="w-14 shrink-0" />
                  <div className="w-5 shrink-0 flex flex-col items-center">
                    <div className="w-px h-2 bg-slate-200 dark:bg-white/10" />
                    <div className="h-2 w-2 rounded-full bg-amber-400 border-2 border-white dark:border-navy-900" />
                    <div className="w-px h-2 bg-slate-200 dark:bg-white/10" />
                  </div>
                  <div className="pl-3 py-2 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                      Descanso
                    </span>
                  </div>
                </li>
              );
            }

            const ev = row as CoverageEvent;
            return (
              <EventRow
                key={i}
                ev={ev}
                homeName={homeName}
                awayName={awayName}
                isLast={i === rows.length - 1}
              />
            );
          })}

          {/* Kickoff anchor */}
          <li className="flex gap-0 items-stretch">
            <div className="w-14 shrink-0 flex items-end justify-end pr-3 pb-1">
              <span className="text-xs font-bold tabular-nums text-slate-400">1&apos;</span>
            </div>
            <div className="flex flex-col items-center w-5 shrink-0">
              <div className="h-2.5 w-2.5 rounded-full bg-slate-300 border-2 border-white dark:border-navy-900" />
            </div>
            <div className="pl-3 pb-1 flex-1">
              <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                Inicio · {homeName} vs {awayName}
              </p>
            </div>
          </li>
        </ol>
      )}
    </div>
  );
}
