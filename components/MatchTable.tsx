import Link from "next/link";
import type { Match } from "@/lib/types";
import { getTeam } from "@/data/teams";
import { matchScoreLabel } from "@/lib/utils";
import MatchCard from "@/components/MatchCard";
import StatusBadge from "@/components/StatusBadge";
import ProbBar from "@/components/ProbBar";
import Flag from "@/components/Flag";
import LocalTime from "@/components/LocalTime";
import LocalDate from "@/components/LocalDate";

/** Tabla de partidos (desktop) + lista de tarjetas (móvil). */
export default function MatchTable({ matches }: { matches: Match[] }) {
  if (matches.length === 0) {
    return (
      <p className="card p-8 text-center text-slate-500 dark:text-slate-400">
        No hay partidos que coincidan con los filtros seleccionados.
      </p>
    );
  }

  return (
    <>
      {/* Móvil: tarjetas */}
      <div className="grid gap-4 md:hidden">
        {matches.map((m) => (
          <MatchCard key={m.slug} match={m} />
        ))}
      </div>

      {/* Desktop: tabla */}
      <div className="card hidden overflow-hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500 dark:border-white/10 dark:text-slate-400">
              <th className="px-4 py-3 font-semibold">Estado</th>
              <th className="px-4 py-3 font-semibold">Fecha</th>
              <th className="px-4 py-3 font-semibold">Gr.</th>
              <th className="px-4 py-3 font-semibold">Partido</th>
              <th className="px-4 py-3 font-semibold">Estadio</th>
              <th className="px-4 py-3 text-center font-semibold">1 · X · 2</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((m) => {
              const home = getTeam(m.homeSlug);
              const away = getTeam(m.awaySlug);
              if (!home || !away) return null;
              return (
                <tr
                  key={m.slug}
                  className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50 dark:border-white/5 dark:hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-3">
                    <StatusBadge status={m.status} minute={m.minute} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-500 dark:text-slate-400">
                    <LocalDate date={m.date} time={m.time} format="dayMonth" className="stat-num" />
                    <LocalTime date={m.date} time={m.time} className="ml-1 text-slate-400" />
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400">
                    {m.group}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/partidos/${m.slug}`}
                      className="group inline-flex items-center gap-2 font-semibold text-navy hover:text-pitch dark:text-slate-100 dark:hover:text-pitch-300"
                    >
                      <span aria-hidden className="flex">
                        <Flag isoCode={home.isoCode} alt={home.name} width={28} />
                      </span>
                      <span className="hidden lg:inline">{home.name}</span>
                      <span className="lg:hidden">{home.slug.slice(0, 3).toUpperCase()}</span>
                      <span className="stat-num mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-white/10">
                        {matchScoreLabel(m)}
                      </span>
                      <span className="hidden lg:inline">{away.name}</span>
                      <span className="lg:hidden">{away.slug.slice(0, 3).toUpperCase()}</span>
                      <span aria-hidden className="flex">
                        <Flag isoCode={away.isoCode} alt={away.name} width={28} />
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    <span className="block max-w-[180px] truncate">{m.stadium}</span>
                    <span className="block text-xs text-slate-400">{m.city}</span>
                  </td>
                  <td className="w-[150px] px-4 py-3">
                    <ProbBar
                      home={m.probHome}
                      draw={m.probDraw}
                      away={m.probAway}
                      showLegend={false}
                    />
                    <div className="mt-1 flex justify-between text-[10px] tabular-nums text-slate-400">
                      <span>{m.probHome}</span>
                      <span>{m.probDraw}</span>
                      <span>{m.probAway}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
