import Link from "next/link";
import { getTeam } from "@/data/teams";
import Flag from "@/components/Flag";
import type { PlayerStatRow } from "@/lib/stats";

interface PlayerStatTableProps {
  title: string;
  rows: PlayerStatRow[];
  valueLabel: string;
  emptyLabel: string;
  limit?: number;
}

/** Ranking de jugadores (goleadores, asistencias o tarjetas) para la sección Tabla. */
export default function PlayerStatTable({
  title,
  rows,
  valueLabel,
  emptyLabel,
  limit = 10,
}: PlayerStatTableProps) {
  const visible = rows.slice(0, limit);

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-slate-200 px-4 py-3 dark:border-white/10">
        <h3 className="font-display text-base font-bold text-navy dark:text-slate-100">
          {title}
        </h3>
      </div>
      {visible.length === 0 ? (
        <p className="p-6 text-center text-sm text-slate-400">{emptyLabel}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-2 pl-4 pr-2 font-semibold">#</th>
                <th className="px-2 py-2 font-semibold">Jugador</th>
                <th className="px-2 py-2 font-semibold">Selección</th>
                <th className="px-2 py-2 pr-4 text-center font-semibold">{valueLabel}</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row, i) => {
                const team = getTeam(row.teamSlug);
                return (
                  <tr
                    key={`${row.teamSlug}-${row.player}`}
                    className="border-t border-slate-100 dark:border-white/5"
                  >
                    <td className="py-2.5 pl-4 pr-2">
                      <span className="stat-num inline-grid h-6 w-6 place-items-center rounded-md bg-slate-100 text-xs font-bold text-slate-500 dark:bg-white/10 dark:text-slate-300">
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-2 py-2.5 font-semibold text-navy dark:text-slate-100">
                      {row.player}
                    </td>
                    <td className="px-2 py-2.5">
                      {team ? (
                        <Link
                          href={`/selecciones/${team.slug}`}
                          className="inline-flex items-center gap-2 text-slate-600 hover:text-pitch dark:text-slate-300"
                        >
                          <span aria-hidden className="inline-flex">
                            <Flag isoCode={team.isoCode} alt={team.name} width={22} />
                          </span>
                          <span className="max-w-[6rem] truncate sm:max-w-none">
                            {team.name}
                          </span>
                        </Link>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="stat-num px-2 py-2.5 pr-4 text-center text-base font-bold text-navy dark:text-slate-100">
                      {row.value}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
