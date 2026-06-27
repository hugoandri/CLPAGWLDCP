import { knockoutRounds as fallbackRounds } from "@/data/knockout";
import type { KnockoutRound, KnockoutMatch } from "@/data/knockout";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface KnockoutBracketProps {
  className?: string;
  rounds?: KnockoutRound[];
}

function TeamLabel({ name, score, winner, gray }: { name: string; score?: number; winner?: boolean; gray?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-1 rounded px-2.5 py-1.5 text-[11px] leading-tight",
        gray && "text-slate-400 dark:text-slate-500",
        winner && "font-bold",
      )}
      style={winner ? { background: "rgba(47, 184, 92, 0.12)", color: "#166534" } : {}}
    >
      <span className="truncate">{name}</span>
      {score !== undefined && <span className="shrink-0 tabular-nums font-bold">{score}</span>}
    </div>
  );
}

function MatchCard({ match }: { match: KnockoutMatch }) {
  const hasScore = match.status === "finished" && match.homeScore !== undefined;
  const homeWon = hasScore && (match.homeScore ?? 0) > (match.awayScore ?? 0);
  const awayWon = hasScore && (match.awayScore ?? 0) > (match.homeScore ?? 0);
  const isPlaceholder = match.status === "placeholder";
  const isTbd = isPlaceholder || match.homeLabel.startsWith("Ganador") || match.homeLabel.startsWith("Perdedor") || /^[123]°/.test(match.homeLabel);

  return (
    <Link
      href={match.homeSlug ? `/partidos/${match.slug}` : "#"}
      className={cn(
        "block w-[150px] shrink-0 overflow-hidden rounded-lg border",
        isPlaceholder
          ? "border-dashed border-slate-200 dark:border-white/10"
          : "border-slate-200 bg-white shadow-sm dark:border-white/15 dark:bg-navy-900",
        isTbd ? "opacity-60" : "hover:shadow-md transition-shadow",
      )}
    >
      <TeamLabel name={match.homeLabel} score={hasScore ? match.homeScore : undefined} winner={homeWon} gray={isTbd} />
      <div className="h-px bg-slate-100 dark:bg-white/5" />
      <TeamLabel name={match.awayLabel} score={hasScore ? match.awayScore : undefined} winner={awayWon} gray={isTbd} />
    </Link>
  );
}

export default function KnockoutBracket({ className, rounds }: KnockoutBracketProps) {
  const data = rounds ?? fallbackRounds;
  const visibleRounds = data.filter((r) => r.matches.length > 0);

  if (visibleRounds.length === 0) {
    return <div className={cn("card p-8 text-center text-slate-500", className)}>No hay partidos disponibles.</div>;
  }

  // Build bracket using a flat grid approach
  // Layout: columns are rounds, rows are team slots
  // R32: 32 team slots (16 matches), R16: 16 slots (8 matches), QF: 8 slots (4 matches), SF: 4 slots (2 matches), Final: 2 slots (1 match)
  const rowCount = 32;

  // Helper: position a match within the grid rows
  // For round r (0-indexed), match m (0-indexed), row span = 2^(r+1)
  // Start row = m * 2^(r+1) + 1

  return (
    <div className={cn("overflow-x-auto pb-4", className)}>
      <div className="inline-flex gap-3 p-2" style={{ minWidth: 600 }}>
        {visibleRounds.map((round, rIdx) => {
          const span = Math.pow(2, rIdx + 1); // rows per match: 2, 4, 8, 16, 32

          return (
            <div key={round.id} className="flex shrink-0 flex-col">
              <div className="mb-2 text-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-pitch-600 dark:text-pitch-400">
                  {shortLabel(round.label)}
                </span>
              </div>

              <div className="relative" style={{ height: `${rowCount * 32}px` }}>
                {round.matches.map((match, mIdx) => {
                  const top = mIdx * span * 32 + (span * 16 - 16);

                  // Connector lines to next round (for all rounds except the last)
                  const connectorRight = rIdx < visibleRounds.length - 1;
                  const isTopOfPair = mIdx % 2 === 0;
                  const connectorHeight = span * 32;

                  return (
                    <div key={match.slug}>
                      {/* Connector lines */}
                      {connectorRight && !(match.status === "placeholder" && match.homeLabel.startsWith("Ganador")) && (
                        <svg
                          className="absolute z-0"
                          style={{ left: 154, top: top + 16, width: 30, height: connectorHeight }}
                        >
                          {/* Horizontal line from match */}
                          <line x1="0" y1="0" x2={isTopOfPair ? 15 : 15} y2="0" stroke="#94a3b8" strokeWidth="1" />
                          {/* Vertical line going down (top match) or up (bottom match) */}
                          <line x1="15" y1={isTopOfPair ? 0 : -connectorHeight} x2="15" y2={isTopOfPair ? connectorHeight : 0} stroke="#94a3b8" strokeWidth="1" />
                          {/* Horizontal line to next round (only top match draws the full connector) */}
                          {isTopOfPair && <line x1="15" y1={connectorHeight} x2="30" y2={connectorHeight} stroke="#94a3b8" strokeWidth="1" />}
                        </svg>
                      )}

                      {/* Match card */}
                      <div className="absolute left-0 z-10 flex items-center gap-3" style={{ top: top }}>
                        <MatchCard match={match} />
                        {/* Arrow to next round */}
                        {connectorRight && (
                          <div className="flex items-center">
                            <div className="h-px w-3 bg-slate-300 dark:bg-slate-600" />
                            <div className="h-2 w-2 rotate-45 border-r-2 border-t-2 border-slate-300 dark:border-slate-600" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function shortLabel(label: string): string {
  const map: Record<string, string> = {
    "Dieciseisavos de final": "R32",
    "Octavos de final": "Octavos",
    "Cuartos de final": "Cuartos",
    "Semifinales": "Semifinales",
    "Tercer puesto": "3er Puesto",
    "Final": "Final",
  };
  return map[label] || label;
}
