import { cn } from "@/lib/utils";
import type { MatchStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: MatchStatus;
  minute?: number;
  className?: string;
}

/** Etiqueta de estado del partido: en vivo (pulsante), descanso, finalizado o próximo. */
export default function StatusBadge({ status, minute, className }: StatusBadgeProps) {
  if (status === "halftime") {
    return (
      <span className={cn("chip bg-amber-500/12 text-amber-600 dark:text-amber-400", className)}>
        Descanso
      </span>
    );
  }

  if (status === "live") {
    return (
      <span
        className={cn(
          "chip bg-red-500/12 text-red-600 dark:text-red-400",
          className,
        )}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-red-500" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
        </span>
        EN VIVO{typeof minute === "number" ? ` · ${minute}'` : ""}
      </span>
    );
  }

  if (status === "finished") {
    return (
      <span
        className={cn(
          "chip bg-slate-500/12 text-slate-600 dark:text-slate-300",
          className,
        )}
      >
        Finalizado
      </span>
    );
  }

  return (
    <span
      className={cn("chip bg-pitch/12 text-pitch-700 dark:text-pitch-300", className)}
    >
      Próximo
    </span>
  );
}
