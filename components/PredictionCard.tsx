import Link from "next/link";
import type { Prediction, Team } from "@/lib/types";
import { PREDICTION_METRICS } from "@/data/predictions";
import { cn, pctWidth } from "@/lib/utils";
import Flag from "@/components/Flag";

interface PredictionCardProps {
  team: Team;
  prediction: Prediction;
  rank?: number;
  className?: string;
}

function fmt(value: number): string {
  if (value > 0 && value < 1) return "<1%";
  return `${Math.round(value)}%`;
}

/** Tarjeta con las 5 probabilidades por ronda de una selección. */
export default function PredictionCard({
  team,
  prediction,
  rank,
  className,
}: PredictionCardProps) {
  return (
    <article className={cn("card p-5", className)}>
      <div className="flex items-center gap-3">
        {typeof rank === "number" && (
          <span className="stat-num grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-navy-900 text-sm font-bold text-white dark:bg-white/10">
            {rank}
          </span>
        )}
        <span aria-hidden className="shrink-0">
          <Flag isoCode={team.isoCode} alt={team.name} width={40} />
        </span>
        <Link
          href={`/selecciones/${team.slug}`}
          className="min-w-0 flex-1 font-display text-lg font-bold leading-tight text-navy hover:text-pitch dark:text-slate-100 dark:hover:text-pitch-300"
        >
          {team.name}
        </Link>
        <span className="chip shrink-0 bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300">
          Grupo {team.group}
        </span>
      </div>

      <dl className="mt-4 space-y-2.5">
        {PREDICTION_METRICS.map((metric) => {
          const value = prediction[metric.key];
          const isWinner = metric.key === "winner";
          return (
            <div key={metric.key}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <dt className="font-medium text-slate-500 dark:text-slate-400">
                  {metric.label}
                </dt>
                <dd
                  className={cn(
                    "stat-num font-bold",
                    isWinner
                      ? "text-gold-600 dark:text-gold-400"
                      : "text-navy dark:text-slate-100",
                  )}
                >
                  {fmt(value)}
                </dd>
              </div>
              <div className="prob-track">
                <div
                  className={cn(
                    "h-full rounded-full",
                    isWinner ? "bg-gold" : "bg-pitch",
                  )}
                  style={{ width: pctWidth(value) }}
                />
              </div>
            </div>
          );
        })}
      </dl>
    </article>
  );
}
