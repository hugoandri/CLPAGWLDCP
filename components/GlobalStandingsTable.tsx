import Link from "next/link";
import type { ComputedStanding } from "@/lib/types";
import { getTeam } from "@/data/teams";
import { cn } from "@/lib/utils";
import Flag from "@/components/Flag";

interface GlobalStandingsTableProps {
  standings: ComputedStanding[];
  className?: string;
}

export default function GlobalStandingsTable({ standings, className }: GlobalStandingsTableProps) {
  return (
    <div className={cn("card overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="py-2 pl-4 pr-2 font-semibold">#</th>
              <th className="px-2 py-2 font-semibold">Equipo</th>
              <th className="px-2 py-2 text-center font-semibold">Pts</th>
              <th className="px-2 py-2 text-center font-semibold">PJ</th>
              <th className="hidden px-2 py-2 text-center font-semibold sm:table-cell">G</th>
              <th className="hidden px-2 py-2 text-center font-semibold sm:table-cell">E</th>
              <th className="hidden px-2 py-2 text-center font-semibold sm:table-cell">P</th>
              <th className="hidden px-2 py-2 text-center font-semibold md:table-cell">GF</th>
              <th className="hidden px-2 py-2 text-center font-semibold md:table-cell">GC</th>
              <th className="px-2 py-2 text-center font-semibold">DG</th>
              <th className="hidden px-2 py-2 text-center font-semibold lg:table-cell">TA</th>
              <th className="hidden px-2 py-2 text-center font-semibold lg:table-cell">TR</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((row, i) => {
              const team = getTeam(row.teamSlug);
              if (!team) return null;
              return (
                <tr
                  key={row.teamSlug}
                  className={cn(
                    "border-t border-slate-100 dark:border-white/5",
                    row.qualifies && "bg-pitch/[0.05] dark:bg-pitch/[0.08]",
                  )}
                >
                  <td className="py-2 pl-4 pr-2">
                    <span className="stat-num inline-grid h-6 w-6 place-items-center rounded-md text-xs font-bold bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300">
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-2 py-2">
                    <Link
                      href={`/selecciones/${team.slug}`}
                      className="inline-flex items-center gap-2 font-semibold text-navy hover:text-pitch dark:text-slate-100 dark:hover:text-pitch-300"
                    >
                      <span aria-hidden className="inline-flex">
                        <Flag isoCode={team.isoCode} alt={team.name} width={20} />
                      </span>
                      <span className="max-w-[7rem] truncate sm:max-w-none">
                        {team.name}
                      </span>
                    </Link>
                  </td>
                  <td className="stat-num px-2 py-2 text-center text-base font-bold text-navy dark:text-slate-100">
                    {row.points}
                  </td>
                  <td className="stat-num px-2 py-2 text-center text-slate-600 dark:text-slate-300">
                    {row.played}
                  </td>
                  <td className="stat-num hidden px-2 py-2 text-center text-slate-600 dark:text-slate-300 sm:table-cell">
                    {row.won}
                  </td>
                  <td className="stat-num hidden px-2 py-2 text-center text-slate-600 dark:text-slate-300 sm:table-cell">
                    {row.drawn}
                  </td>
                  <td className="stat-num hidden px-2 py-2 text-center text-slate-600 dark:text-slate-300 sm:table-cell">
                    {row.lost}
                  </td>
                  <td className="stat-num hidden px-2 py-2 text-center text-slate-600 dark:text-slate-300 md:table-cell">
                    {row.gf}
                  </td>
                  <td className="stat-num hidden px-2 py-2 text-center text-slate-600 dark:text-slate-300 md:table-cell">
                    {row.ga}
                  </td>
                  <td
                    className={cn(
                      "stat-num px-2 py-2 text-center font-medium",
                      row.gd > 0
                        ? "text-pitch-600 dark:text-pitch-300"
                        : row.gd < 0
                          ? "text-red-500"
                          : "text-slate-500",
                    )}
                  >
                    {row.gd > 0 ? `+${row.gd}` : row.gd}
                  </td>
                  <td className="stat-num hidden px-2 py-2 text-center text-amber-600 dark:text-amber-400 lg:table-cell">
                    {row.yellowCards ?? 0}
                  </td>
                  <td className="stat-num hidden px-2 py-2 text-center text-red-600 dark:text-red-400 lg:table-cell">
                    {row.redCards ?? 0}
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
