import Link from "next/link";
import type { Match, Team } from "@/lib/types";
import { getTeam } from "@/data/teams";
import { cn, formatDayMonth } from "@/lib/utils";
import ProbBar from "@/components/ProbBar";
import StatusBadge from "@/components/StatusBadge";

interface MatchCardProps {
  match: Match;
  className?: string;
}

function TeamSide({ team, align }: { team: Team; align: "left" | "right" }) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-2.5",
        align === "right" ? "flex-row-reverse text-right" : "text-left",
      )}
    >
      <span
        aria-hidden
        className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-100 text-2xl dark:bg-white/10"
      >
        {team.flag}
      </span>
      <div className="min-w-0">
        <p className="truncate font-semibold leading-tight text-navy dark:text-slate-100">
          {team.name}
        </p>
        <p className="text-xs text-slate-400">#{team.internalRank}</p>
      </div>
    </div>
  );
}

export default function MatchCard({ match, className }: MatchCardProps) {
  const home = getTeam(match.homeSlug);
  const away = getTeam(match.awaySlug);
  if (!home || !away) return null;

  const hasScore = match.status !== "upcoming";

  return (
    <Link
      href={`/partidos/${match.slug}`}
      className={cn("card card-hover block p-4 focus-visible:ring-2", className)}
    >
      <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <StatusBadge status={match.status} minute={match.minute} />
        <span className="truncate font-medium">
          Grupo {match.group} · {formatDayMonth(match.date)}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <TeamSide team={home} align="right" />

        <div className="px-1 text-center">
          {hasScore ? (
            <div className="stat-num text-2xl font-extrabold leading-none text-navy dark:text-slate-100">
              {match.homeScore}
              <span className="mx-1 text-slate-300 dark:text-slate-600">·</span>
              {match.awayScore}
            </div>
          ) : (
            <div className="leading-tight">
              <div className="stat-num text-lg font-bold text-navy dark:text-slate-100">
                {match.time}
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                vs
              </div>
            </div>
          )}
        </div>

        <TeamSide team={away} align="left" />
      </div>

      <p className="mt-3 truncate text-center text-xs text-slate-400">
        {match.stadium} · {match.city}
      </p>

      <div className="mt-3 border-t border-slate-100 pt-3 dark:border-white/5">
        <ProbBar home={match.probHome} draw={match.probDraw} away={match.probAway} />
      </div>
    </Link>
  );
}
