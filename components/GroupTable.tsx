import Link from "next/link";
import type { ComputedStanding } from "@/lib/types";
import { getTeam } from "@/data/teams";
import { cn } from "@/lib/utils";
import Flag from "@/components/Flag";

interface GroupTableProps {
  standings: ComputedStanding[];
  label?: string;
  highlightSlug?: string;
  className?: string;
}

/** Tabla de posiciones de un grupo (los 2 primeros, clasificados). */
export default function GroupTable({
  standings,
  label,
  highlightSlug,
  className,
}: GroupTableProps) {
  return (
    <div className={cn("card overflow-hidden", className)}>
      {label && (
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-white/10">
          <h3 className="font-display text-base font-bold text-navy dark:text-slate-100">
            {label}
          </h3>
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Top 2 clasifican
          </span>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="py-2 pl-4 pr-2 font-semibold">#</th>
              <th className="px-2 py-2 font-semibold">Equipo</th>
              <th className="px-2 py-2 text-center font-semibold">PJ</th>
              <th className="hidden px-2 py-2 text-center font-semibold sm:table-cell">G</th>
              <th className="hidden px-2 py-2 text-center font-semibold sm:table-cell">E</th>
              <th className="hidden px-2 py-2 text-center font-semibold sm:table-cell">P</th>
              <th className="hidden px-2 py-2 text-center font-semibold md:table-cell">GF</th>
              <th className="hidden px-2 py-2 text-center font-semibold md:table-cell">GC</th>
              <th className="px-2 py-2 text-center font-semibold">DG</th>
              <th className="px-2 py-2 pr-4 text-center font-semibold">Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((row) => {
              const team = getTeam(row.teamSlug);
              if (!team) return null;
              const highlighted = row.teamSlug === highlightSlug;
              return (
                <tr
                  key={row.teamSlug}
                  className={cn(
                    "border-t border-slate-100 dark:border-white/5",
                    row.qualifies && "bg-pitch/[0.05] dark:bg-pitch/[0.08]",
                    highlighted && "ring-1 ring-inset ring-gold/60",
                  )}
                >
                  <td className="py-2.5 pl-4 pr-2">
                    <span
                      className={cn(
                        "stat-num inline-grid h-6 w-6 place-items-center rounded-md text-xs font-bold",
                        row.qualifies
                          ? "bg-pitch text-white"
                          : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300",
                      )}
                    >
                      {row.position}
                    </span>
                  </td>
                  <td className="px-2 py-2.5">
                    <Link
                      href={`/selecciones/${team.slug}`}
                      className="inline-flex items-center gap-2 font-semibold text-navy hover:text-pitch dark:text-slate-100 dark:hover:text-pitch-300"
                    >
                      <span aria-hidden className="inline-flex">
                        <Flag isoCode={team.isoCode} alt={team.name} width={28} />
                      </span>
                      <span className="max-w-[7.5rem] truncate sm:max-w-none">
                        {team.name}
                      </span>
                    </Link>
                  </td>
                  <td className="stat-num px-2 py-2.5 text-center text-slate-600 dark:text-slate-300">
                    {row.played}
                  </td>
                  <td className="stat-num hidden px-2 py-2.5 text-center text-slate-600 dark:text-slate-300 sm:table-cell">
                    {row.won}
                  </td>
                  <td className="stat-num hidden px-2 py-2.5 text-center text-slate-600 dark:text-slate-300 sm:table-cell">
                    {row.drawn}
                  </td>
                  <td className="stat-num hidden px-2 py-2.5 text-center text-slate-600 dark:text-slate-300 sm:table-cell">
                    {row.lost}
                  </td>
                  <td className="stat-num hidden px-2 py-2.5 text-center text-slate-600 dark:text-slate-300 md:table-cell">
                    {row.gf}
                  </td>
                  <td className="stat-num hidden px-2 py-2.5 text-center text-slate-600 dark:text-slate-300 md:table-cell">
                    {row.ga}
                  </td>
                  <td
                    className={cn(
                      "stat-num px-2 py-2.5 text-center font-medium",
                      row.gd > 0
                        ? "text-pitch-600 dark:text-pitch-300"
                        : row.gd < 0
                          ? "text-red-500"
                          : "text-slate-500",
                    )}
                  >
                    {row.gd > 0 ? `+${row.gd}` : row.gd}
                  </td>
                  <td className="stat-num px-2 py-2.5 pr-4 text-center text-base font-bold text-navy dark:text-slate-100">
                    {row.points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
