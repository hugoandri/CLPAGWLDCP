import { knockoutRounds as fallbackRounds } from "@/data/knockout";
import type { KnockoutRound, KnockoutMatch } from "@/data/knockout";
import { cn } from "@/lib/utils";

interface KnockoutBracketProps {
  className?: string;
  rounds?: KnockoutRound[];
}

// ─── Team label row ───
function TeamLabel({ name, score, winner, gray }: { name: string; score?: number; winner?: boolean; gray?: boolean }) {
  return (
    <div className={cn("flex items-center justify-between gap-1 rounded px-2.5 py-[7px] text-[11px] leading-tight", gray && "text-slate-400 dark:text-slate-500", winner && "font-bold")} style={winner ? { background: "rgba(47, 184, 92, 0.12)", color: "#166534" } : {}}>
      <span className="truncate">{name}</span>
      {score !== undefined && <span className="shrink-0 tabular-nums font-bold">{score}</span>}
    </div>
  );
}

// ─── Single match card ───
function MatchCard({ match }: { match: KnockoutMatch }) {
  const hasScore = match.status === "finished" && match.homeScore !== undefined;
  const homeWon = hasScore && (match.homeScore ?? 0) > (match.awayScore ?? 0);
  const awayWon = hasScore && (match.awayScore ?? 0) > (match.homeScore ?? 0);
  const isPlaceholder = match.status === "placeholder";
  const isTbd = isPlaceholder || /^[123]°/.test(match.homeLabel) || match.homeLabel.startsWith("Ganador") || match.homeLabel.startsWith("Perdedor");

  return (
    <div className={cn("w-[150px] shrink-0 overflow-hidden rounded-lg border bg-white dark:bg-navy-900", isPlaceholder ? "border-dashed border-slate-200 dark:border-white/10" : "border-slate-200 shadow-sm dark:border-white/15", isTbd && "opacity-60")}>
      <TeamLabel name={match.homeLabel} score={hasScore ? match.homeScore : undefined} winner={homeWon} gray={isTbd} />
      <div className="h-px bg-slate-100 dark:bg-white/5" />
      <TeamLabel name={match.awayLabel} score={hasScore ? match.awayScore : undefined} winner={awayWon} gray={isTbd} />
    </div>
  );
}

// ─── Bracket pair: two matches in round N, with connector to round N+1 ───
function BracketPair({
  topMatch,
  bottomMatch,
  spacing, // vertical gap between top and bottom match in px
  pairWidth, // width reserved for connector in px
}: {
  topMatch: KnockoutMatch;
  bottomMatch?: KnockoutMatch;
  spacing: number;
  pairWidth: number;
}) {
  const matchHeight = 35; // ~ 2 rows of 17.5px each
  const pairHeight = matchHeight * 2 + spacing;
  const midY = pairHeight / 2;
  const matchRight = 150;
  const junctionX = matchRight + 12;
  const hasTeams = topMatch.status !== "placeholder" && !/^[123]°/.test(topMatch.homeLabel);
  const dash = topMatch.status === "placeholder" ? 4 : 0;
  const opacity = hasTeams ? 0.8 : 0.25;

  return (
    <div className="relative" style={{ height: pairHeight }}>
      {/* Top match */}
      <div className="absolute left-0 top-0 z-10">
        <MatchCard match={topMatch} />
      </div>

      {/* Bottom match */}
      {bottomMatch && (
        <div className="absolute left-0 z-10" style={{ top: matchHeight + spacing }}>
          <MatchCard match={bottomMatch} />
        </div>
      )}

      {/* Connector to next round */}
      <svg className="absolute z-0" style={{ left: 0, top: 0, width: pairWidth, height: pairHeight, pointerEvents: "none" }}>
        {/* Horizontal line from top match */}
        <line x1={matchRight} y1={matchHeight / 2} x2={junctionX} y2={matchHeight / 2} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray={dash > 0 ? `${dash},${dash}` : undefined} opacity={opacity} />
        {/* Horizontal line from bottom match */}
        <line x1={matchRight} y1={pairHeight - matchHeight / 2} x2={junctionX} y2={pairHeight - matchHeight / 2} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray={dash > 0 ? `${dash},${dash}` : undefined} opacity={opacity} />
        {/* Vertical connector line */}
        <line x1={junctionX} y1={matchHeight / 2} x2={junctionX} y2={pairHeight - matchHeight / 2} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray={dash > 0 ? `${dash},${dash}` : undefined} opacity={opacity} />
        {/* Horizontal arm going right to next round */}
        <line x1={junctionX} y1={midY} x2={junctionX + 12} y2={midY} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray={dash > 0 ? `${dash},${dash}` : undefined} opacity={opacity} />
      </svg>
    </div>
  );
}

// ─── Main bracket component ───
export default function KnockoutBracket({ className, rounds }: KnockoutBracketProps) {
  const data = rounds ?? fallbackRounds;
  const visibleRounds = data.filter((r) => r.matches.length > 0);
  if (visibleRounds.length === 0) return <div className={cn("card p-8 text-center text-slate-500", className)}>No hay partidos disponibles.</div>;

  // Calculate spacing: each round doubles the gap between pairs
  // R32: match pairs have 12px gap between top and bottom
  // R16: 28px gap
  // QF: 60px gap  
  // SF: 124px gap
  // Final: 252px gap (but only 1 match, no pair needed)

  return (
    <div className={cn("overflow-x-auto pb-4", className)}>
      <div className="inline-flex gap-0 p-2" style={{ minWidth: visibleRounds.length * 190, minHeight: 600 }}>
        {visibleRounds.map((round, rIdx) => {
          const pairGap = Math.pow(2, rIdx) * 8; // R32: 8, R16: 16, QF: 32, SF: 64, Final: 128
          const pairHeight = 35 * 2 + pairGap; // matchHeight * 2 + gap

          // For the final (1 match), just center it
          if (round.matches.length === 1) {
            return (
              <div key={round.id} className="flex shrink-0 flex-col items-center" style={{ width: 175 }}>
                <div className="mb-2 text-center" style={{ height: 20 }}>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-pitch-600 dark:text-pitch-400">{shortLabel(round.label)}</span>
                </div>
                <div className="flex items-center" style={{ height: pairHeight * (round.matches.length - 1 + 1) / 1, marginTop: pairHeight * 3 }}>
                  <MatchCard match={round.matches[0]} />
                </div>
              </div>
            );
          }

          return (
            <div key={round.id} className="flex shrink-0 flex-col" style={{ width: 175 }}>
              {/* Round label */}
              <div className="mb-2 text-center" style={{ height: 20 }}>
                <span className="text-[10px] font-bold uppercase tracking-widest text-pitch-600 dark:text-pitch-400">{shortLabel(round.label)}</span>
              </div>

              {/* Pairs stacked vertically */}
              <div className="flex flex-col" style={{ gap: pairGap * 2 + 70 }}>
                {Array.from({ length: Math.ceil(round.matches.length / 2) }, (_, pairIdx) => {
                  const topMatch = round.matches[pairIdx * 2];
                  const bottomMatch = round.matches[pairIdx * 2 + 1];

                  return (
                    <BracketPair
                      key={topMatch.slug}
                      topMatch={topMatch}
                      bottomMatch={bottomMatch}
                      spacing={pairGap}
                      pairWidth={175}
                    />
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
    "Dieciseisavos de final": "R32", "Octavos de final": "Octavos",
    "Cuartos de final": "Cuartos", "Semifinales": "Semifinales",
    "Tercer puesto": "3er", "Final": "Final",
  };
  return map[label] || label;
}
