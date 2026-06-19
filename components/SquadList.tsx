import Image from "next/image";
import { cn } from "@/lib/utils";
import type { LineupPosition, SquadPlayer } from "@/lib/types";

const POS_ORDER: Record<LineupPosition, number> = { GK: 0, DEF: 1, MID: 2, FWD: 3 };
const POS_LABEL: Record<LineupPosition, string> = {
  GK: "Porteros",
  DEF: "Defensas",
  MID: "Mediocampistas",
  FWD: "Delanteros",
};

function PlayerAvatar({ player }: { player: SquadPlayer }) {
  if (player.photoUrl) {
    return (
      <Image
        src={player.photoUrl}
        alt={player.name}
        width={36}
        height={36}
        className="h-9 w-9 shrink-0 rounded-full bg-slate-100 object-cover dark:bg-white/10"
      />
    );
  }
  return (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-500 dark:bg-white/10 dark:text-slate-300">
      {player.number ?? "—"}
    </span>
  );
}

interface SquadListProps {
  players: SquadPlayer[];
}

/** Nómina completa de una selección (titulares + suplentes), agrupada por posición. */
export default function SquadList({ players }: SquadListProps) {
  const groups = new Map<LineupPosition, SquadPlayer[]>();
  const noPosition: SquadPlayer[] = [];

  for (const p of players) {
    if (!p.position) {
      noPosition.push(p);
      continue;
    }
    const list = groups.get(p.position) ?? [];
    list.push(p);
    groups.set(p.position, list);
  }

  const sortedGroups = Array.from(groups.entries()).sort(
    ([a], [b]) => POS_ORDER[a] - POS_ORDER[b],
  );

  return (
    <div className="space-y-6">
      {sortedGroups.map(([position, list]) => (
        <div key={position}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            {POS_LABEL[position]}
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {list.map((p) => (
              <li
                key={p.id}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2",
                  p.starter
                    ? "bg-pitch/5 dark:bg-pitch/10"
                    : "bg-slate-50 dark:bg-white/[0.03]",
                )}
              >
                <PlayerAvatar player={p} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy dark:text-slate-100">
                    {p.name}
                    {p.captain && (
                      <span className="ml-1 text-xs font-bold text-gold-600 dark:text-gold-400">
                        (C)
                      </span>
                    )}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {p.number != null ? `#${p.number} · ` : ""}
                    {p.starter ? "Titular" : "Suplente"}
                    {p.club ? ` · ${p.club}` : ""}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {noPosition.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Otros
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {noPosition.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2 dark:bg-white/[0.03]"
              >
                <PlayerAvatar player={p} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy dark:text-slate-100">
                    {p.name}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {p.number != null ? `#${p.number} · ` : ""}
                    {p.starter ? "Titular" : "Suplente"}
                    {p.club ? ` · ${p.club}` : ""}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
