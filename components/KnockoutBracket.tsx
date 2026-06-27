import { knockoutRounds as fallbackRounds } from "@/data/knockout";
import type { KnockoutRound } from "@/data/knockout";
import { cn } from "@/lib/utils";

interface KnockoutBracketProps {
  className?: string;
  rounds?: KnockoutRound[];
}

function MatchCard({
  homeLabel,
  awayLabel,
  homeScore,
  awayScore,
  status,
}: {
  homeLabel: string;
  awayLabel: string;
  homeScore?: number;
  awayScore?: number;
  status: string;
}) {
  const hasScore = status === "finished" && homeScore !== undefined && awayScore !== undefined;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-white/10 dark:bg-navy-900">
      <div className={cn(
        "flex items-center justify-between gap-2 py-0.5",
        hasScore && homeScore! > awayScore! && "font-bold text-navy dark:text-white",
        !hasScore && "text-slate-600 dark:text-slate-300",
      )}>
        <span className="truncate">{homeLabel}</span>
        {hasScore && <span className="shrink-0 tabular-nums">{homeScore}</span>}
      </div>
      <div className={cn(
        "flex items-center justify-between gap-2 border-t border-slate-100 py-0.5 dark:border-white/5",
        hasScore && awayScore! > homeScore! && "font-bold text-navy dark:text-white",
        !hasScore && "text-slate-600 dark:text-slate-300",
      )}>
        <span className="truncate">{awayLabel}</span>
        {hasScore && <span className="shrink-0 tabular-nums">{awayScore}</span>}
      </div>
    </div>
  );
}

export default function KnockoutBracket({ className, rounds }: KnockoutBracketProps) {
  const data = rounds ?? fallbackRounds;
  return (
    <div className={cn("space-y-8", className)}>
      {data.map((round) => (
        <section key={round.id}>
          <h3 className="font-display text-base font-bold text-navy dark:text-slate-100 mb-3">
            {round.label}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {round.matches.map((match) => (
              <MatchCard
                key={match.slug}
                homeLabel={match.homeLabel}
                awayLabel={match.awayLabel}
                homeScore={match.homeScore}
                awayScore={match.awayScore}
                status={match.status}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
