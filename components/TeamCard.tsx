import Link from "next/link";
import type { Team } from "@/lib/types";
import { cn, pctWidth } from "@/lib/utils";
import Flag from "@/components/Flag";

interface TeamCardProps {
  team: Team;
  className?: string;
}

/** Tarjeta de selección para el listado /selecciones. */
export default function TeamCard({ team, className }: TeamCardProps) {
  return (
    <Link
      href={`/selecciones/${team.slug}`}
      className={cn("card card-hover flex flex-col p-4", className)}
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl"
        >
          <Flag isoCode={team.isoCode} alt={team.name} width={48} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-lg font-bold leading-tight text-navy dark:text-slate-100">
            {team.name}
          </p>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="chip bg-pitch/10 text-pitch-700 dark:text-pitch-300">
              Grupo {team.group}
            </span>
            <span>{team.confederation}</span>
          </div>
        </div>
        <span className="stat-num shrink-0 rounded-lg bg-navy-900 px-2 py-1 text-xs font-bold text-white dark:bg-white/10">
          #{team.internalRank}
        </span>
      </div>

      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="font-medium text-slate-500 dark:text-slate-400">
            Prob. de avanzar
          </span>
          <span className="stat-num font-bold text-navy dark:text-slate-100">
            {team.probAdvance}%
          </span>
        </div>
        <div className="prob-track">
          <div
            className="h-full rounded-full bg-pitch"
            style={{ width: pctWidth(team.probAdvance) }}
          />
        </div>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3 dark:border-white/5">
        <p className="font-display text-sm font-bold leading-snug text-navy dark:text-slate-100">
          {team.analysis.headline}
        </p>
        <div className="mt-3 grid gap-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          <p>
            <span className="font-semibold text-pitch-700 dark:text-pitch-300">
              Lo bueno: 
            </span>
            {team.analysis.goodThings}
          </p>
          <p>
            <span className="font-semibold text-navy dark:text-slate-200">
              Qué se espera: 
            </span>
            {team.analysis.expectation}
          </p>
        </div>
      </div>

      <p className="mt-auto pt-4 text-xs text-slate-500 dark:text-slate-400">
        Referente: {" "}
        <span className="font-semibold text-navy dark:text-slate-200">
          {team.keyPlayer}
        </span>
      </p>
    </Link>
  );
}
