import Link from "next/link";
import type { KnockoutMatch } from "@/data/knockout";
import { getTeam } from "@/data/teams";
import Flag from "@/components/Flag";
import LocalDate from "@/components/LocalDate";
import LocalTime from "@/components/LocalTime";

interface Props {
  match: KnockoutMatch;
}

export default function KnockMatchCard({ match }: Props) {
  const home = match.homeSlug ? getTeam(match.homeSlug) : null;
  const away = match.awaySlug ? getTeam(match.awaySlug) : null;
  if (!home || !away) return null;

  const hasScore = match.status === "finished" && match.homeScore !== undefined;
  const homeWon = hasScore && (match.homeScore ?? 0) > (match.awayScore ?? 0);
  const awayWon = hasScore && !homeWon;

  return (
    <Link
      href="/eliminatorias"
      className="card card-hover block p-4"
    >
      <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="rounded bg-pitch/10 px-2 py-0.5 font-semibold text-pitch-600 dark:text-pitch-400">
          {match.roundLabel}
        </span>
        {match.date && match.time && (
          <span>
            <LocalDate date={match.date} time={match.time} format="dayMonth" />
            {" · "}
            <LocalTime date={match.date} time={match.time} />
          </span>
        )}
        {match.date && !match.time && (
          <span>{match.date}</span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className={`flex min-w-0 items-center gap-2 ${homeWon ? "font-bold" : ""}`}>
          <Flag isoCode={home.isoCode} alt={home.name} width={28} />
          <span className="truncate text-sm">{home.name}</span>
        </div>

        <div className="shrink-0 text-center">
          {hasScore ? (
            <span className="stat-num text-lg font-extrabold leading-none text-navy dark:text-slate-100">
              {match.homeScore}
              <span className="mx-1 text-slate-300 dark:text-slate-600">·</span>
              {match.awayScore}
            </span>
          ) : (
            <span className="text-xs font-bold text-slate-400">vs</span>
          )}
        </div>

        <div className={`flex min-w-0 items-center gap-2 ${awayWon ? "font-bold" : ""}`}>
          <span className="truncate text-sm">{away.name}</span>
          <Flag isoCode={away.isoCode} alt={away.name} width={28} />
        </div>
      </div>

      {match.homePenalties !== undefined && (
        <p className="mt-1 text-center text-[11px] text-slate-400 tabular-nums">
          Penales: {match.homePenalties}–{match.awayPenalties}
        </p>
      )}

      {match.stadium && (
        <p className="mt-2 truncate text-center text-xs text-slate-400">
          {match.stadium} · {match.city}
        </p>
      )}
    </Link>
  );
}
