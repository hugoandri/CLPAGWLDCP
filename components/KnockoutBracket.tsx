import { knockoutRounds as fallbackRounds } from "@/data/knockout";
import type { KnockoutRound, KnockoutMatch } from "@/data/knockout";
import { cn } from "@/lib/utils";

// Each R32 match occupies UNIT px of vertical space.
// Round r occupies UNIT * 2^r per match → all rounds share the same total height.
const MATCH_H = 35; // height of a match card (2 rows × ~17.5px)
const UNIT = 47;    // base slot: 35px match + 12px min gap
const MATCH_W = 150;
const COL_W = 175;
const CONN_X = MATCH_W + 10; // where vertical connector sits

interface KnockoutBracketProps {
  className?: string;
  rounds?: KnockoutRound[];
}

// ── Team label ────────────────────────────────────────────────────────────────
function TeamLabel({ name, score, winner, gray }: {
  name: string; score?: number; winner?: boolean; gray?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-1 rounded px-2.5 py-[7px] text-[11px] leading-tight",
        gray && "text-slate-400 dark:text-slate-500",
        winner && "font-bold",
      )}
      style={winner ? { background: "rgba(47,184,92,0.12)", color: "#166534" } : {}}
    >
      <span className="truncate">{name}</span>
      {score !== undefined && (
        <span className="shrink-0 tabular-nums font-bold">{score}</span>
      )}
    </div>
  );
}

// ── Match card ────────────────────────────────────────────────────────────────
function MatchCard({ match }: { match: KnockoutMatch }) {
  const hasScore = match.status === "finished" && match.homeScore !== undefined;
  const homeWon = hasScore && (match.homeScore ?? 0) > (match.awayScore ?? 0);
  const awayWon = hasScore && (match.awayScore ?? 0) > (match.homeScore ?? 0);
  const isPlaceholder = match.status === "placeholder";
  const isTbd =
    isPlaceholder ||
    /^[123]°/.test(match.homeLabel) ||
    match.homeLabel.startsWith("Ganador") ||
    match.homeLabel.startsWith("Perdedor");

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border bg-white dark:bg-navy-900",
        isPlaceholder
          ? "border-dashed border-slate-200 dark:border-white/10"
          : "border-slate-200 shadow-sm dark:border-white/15",
        isTbd && "opacity-60",
      )}
      style={{ width: MATCH_W }}
    >
      <TeamLabel
        name={match.homeLabel}
        score={hasScore ? match.homeScore : undefined}
        winner={homeWon}
        gray={isTbd}
      />
      <div className="h-px bg-slate-100 dark:bg-white/5" />
      <TeamLabel
        name={match.awayLabel}
        score={hasScore ? match.awayScore : undefined}
        winner={awayWon}
        gray={isTbd}
      />
    </div>
  );
}

// ── Bracket ───────────────────────────────────────────────────────────────────
export default function KnockoutBracket({ className, rounds }: KnockoutBracketProps) {
  const data = rounds ?? fallbackRounds;

  // 3rd place is shown separately below the main bracket
  const bracketRounds = data.filter((r) => r.id !== "tercer-puesto" && r.matches.length > 0);
  const thirdPlace = data.find((r) => r.id === "tercer-puesto");

  if (bracketRounds.length === 0) {
    return (
      <div className={cn("card p-8 text-center text-slate-500", className)}>
        No hay partidos disponibles.
      </div>
    );
  }

  // Total height = UNIT × number of R32 matches
  // e.g. 16 R32 matches → 47 × 16 = 752 px
  const firstCount = bracketRounds[0].matches.length;
  const totalH = UNIT * firstCount;
  const HEADER_H = 28; // space for round label above each column

  return (
    <div className={cn("overflow-x-auto pb-4", className)}>
      <div className="inline-flex flex-col gap-8 p-2">

        {/* ── Main bracket columns ── */}
        <div className="inline-flex" style={{ height: totalH + HEADER_H }}>
          {bracketRounds.map((round, rIdx) => {
            const slotH = UNIT * Math.pow(2, rIdx);
            const isLast = rIdx === bracketRounds.length - 1;

            return (
              <div
                key={round.id}
                className="relative shrink-0 flex flex-col"
                style={{ width: COL_W }}
              >
                {/* Round label */}
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{ height: HEADER_H }}
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-pitch-600 dark:text-pitch-400">
                    {shortLabel(round.label)}
                  </span>
                </div>

                {/* Bracket area */}
                <div className="relative" style={{ width: COL_W, height: totalH }}>

                  {/* SVG connector lines */}
                  {!isLast && (
                    <svg
                      className="absolute inset-0 pointer-events-none"
                      width={COL_W}
                      height={totalH}
                    >
                      {Array.from(
                        { length: Math.floor(round.matches.length / 2) },
                        (_, pairIdx) => {
                          const topI = pairIdx * 2;
                          const topCY = topI * slotH + slotH / 2;
                          const botCY = (topI + 1) * slotH + slotH / 2;
                          const midY = (topCY + botCY) / 2;
                          const ph = round.matches[topI]?.status === "placeholder";
                          const dash = ph ? "4,4" : undefined;
                          const op = ph ? 0.25 : 0.6;

                          return (
                            <g key={pairIdx} opacity={op}>
                              <line x1={MATCH_W} y1={topCY} x2={CONN_X} y2={topCY} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray={dash} />
                              <line x1={MATCH_W} y1={botCY} x2={CONN_X} y2={botCY} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray={dash} />
                              <line x1={CONN_X} y1={topCY} x2={CONN_X} y2={botCY} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray={dash} />
                              <line x1={CONN_X} y1={midY} x2={COL_W} y2={midY} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray={dash} />
                            </g>
                          );
                        },
                      )}
                    </svg>
                  )}

                  {/* Match cards, each centered in its slot */}
                  {round.matches.map((match, mIdx) => {
                    const top = mIdx * slotH + (slotH - MATCH_H) / 2;
                    return (
                      <div key={match.slug} className="absolute left-0" style={{ top }}>
                        <MatchCard match={match} />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Third place (below bracket) ── */}
        {thirdPlace && thirdPlace.matches.length > 0 && (
          <div className="flex items-center gap-4 border-t border-slate-200 pt-5 dark:border-white/10">
            <span className="w-[90px] shrink-0 text-right text-[10px] font-bold uppercase tracking-widest text-pitch-600 dark:text-pitch-400">
              3er puesto
            </span>
            <MatchCard match={thirdPlace.matches[0]} />
          </div>
        )}
      </div>
    </div>
  );
}

function shortLabel(label: string): string {
  const map: Record<string, string> = {
    "Dieciseisavos de final": "R32",
    "Octavos de final": "Octavos",
    "Cuartos de final": "Cuartos",
    "Semifinales": "Semis",
    "Final": "Final",
  };
  return map[label] || label;
}
