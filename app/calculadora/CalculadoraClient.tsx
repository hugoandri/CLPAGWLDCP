"use client";

import { useMemo, useState } from "react";
import { getTeamsByGroup, GROUP_IDS } from "@/data/teams";
import { computeStandings } from "@/lib/utils";
import type { GroupStandingInput, Team } from "@/lib/types";
import GroupTable from "@/components/GroupTable";
import Flag from "@/components/Flag";

// Emparejamientos round-robin de un grupo de 4 (índices de equipo).
const FIXTURE_PAIRS: [number, number][] = [
  [0, 1],
  [2, 3],
  [0, 2],
  [1, 3],
  [0, 3],
  [1, 2],
];

interface Fixture {
  homeSlug: string;
  awaySlug: string;
  homeGoals: number;
  awayGoals: number;
}

/** Marcador inicial sugerido según la diferencia de ranking interno. */
function seedScore(home: Team, away: Team): [number, number] {
  const diff = away.internalRank - home.internalRank; // >0 => local más fuerte
  if (diff >= 10) return [2, 0];
  if (diff >= 3) return [2, 1];
  if (diff > -3) return [1, 1];
  if (diff > -10) return [1, 2];
  return [0, 2];
}

function buildFixtures(groupId: string): Fixture[] {
  const t = getTeamsByGroup(groupId);
  return FIXTURE_PAIRS.map(([h, a]) => {
    const [hg, ag] = seedScore(t[h], t[a]);
    return { homeSlug: t[h].slug, awaySlug: t[a].slug, homeGoals: hg, awayGoals: ag };
  });
}

function standingsFromFixtures(
  groupId: string,
  fixtures: Fixture[],
): GroupStandingInput[] {
  const base = new Map<string, GroupStandingInput>(
    getTeamsByGroup(groupId).map((t) => [
      t.slug,
      { teamSlug: t.slug, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0 },
    ]),
  );

  for (const f of fixtures) {
    const home = base.get(f.homeSlug)!;
    const away = base.get(f.awaySlug)!;
    home.gf += f.homeGoals;
    home.ga += f.awayGoals;
    away.gf += f.awayGoals;
    away.ga += f.homeGoals;
    if (f.homeGoals > f.awayGoals) {
      home.won++;
      away.lost++;
    } else if (f.homeGoals < f.awayGoals) {
      away.won++;
      home.lost++;
    } else {
      home.drawn++;
      away.drawn++;
    }
  }

  return Array.from(base.values());
}

function ScoreInput({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  const clamp = (v: number) => Math.max(0, Math.min(20, v));
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        aria-label={`Restar gol ${label}`}
        onClick={() => onChange(clamp(value - 1))}
        className="grid h-8 w-8 place-items-center rounded-lg border border-slate-300 text-slate-500 hover:border-pitch hover:text-pitch dark:border-white/15 dark:text-slate-300"
      >
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        max={20}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(clamp(parseInt(e.target.value || "0", 10)))}
        className="stat-num h-8 w-10 rounded-lg border border-slate-300 bg-white text-center text-base font-bold text-navy [appearance:textfield] focus:border-pitch dark:border-white/15 dark:bg-navy-900 dark:text-slate-100 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        aria-label={`Sumar gol ${label}`}
        onClick={() => onChange(clamp(value + 1))}
        className="grid h-8 w-8 place-items-center rounded-lg border border-slate-300 text-slate-500 hover:border-pitch hover:text-pitch dark:border-white/15 dark:text-slate-300"
      >
        +
      </button>
    </div>
  );
}

export default function CalculadoraClient() {
  const [groupId, setGroupId] = useState("A");
  const [fixtures, setFixtures] = useState<Fixture[]>(() => buildFixtures("A"));

  const teamsBySlug = useMemo(() => {
    const map = new Map(getTeamsByGroup(groupId).map((t) => [t.slug, t]));
    return map;
  }, [groupId]);

  const standings = useMemo(
    () => computeStandings(standingsFromFixtures(groupId, fixtures)),
    [groupId, fixtures],
  );

  const qualified = standings.filter((s) => s.qualifies);

  function changeGroup(id: string) {
    setGroupId(id);
    setFixtures(buildFixtures(id));
  }

  function updateScore(index: number, side: "home" | "away", value: number) {
    setFixtures((prev) =>
      prev.map((f, i) =>
        i === index
          ? { ...f, [side === "home" ? "homeGoals" : "awayGoals"]: value }
          : f,
      ),
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Panel de edición de resultados */}
      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <label htmlFor="calc-group" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Grupo
            </label>
            <select
              id="calc-group"
              value={groupId}
              onChange={(e) => changeGroup(e.target.value)}
              className="appearance-none rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-8 text-sm font-semibold text-navy focus:border-pitch dark:border-white/15 dark:bg-navy-900 dark:text-slate-100"
            >
              {GROUP_IDS.map((g) => (
                <option key={g} value={g}>
                  Grupo {g}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => setFixtures(buildFixtures(groupId))}
            className="btn-ghost !px-3 !py-2 text-xs"
          >
            ↺ Reiniciar
          </button>
        </div>

        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
          Edita los marcadores y la tabla se recalcula al instante.
        </p>

        <ul className="space-y-2.5">
          {fixtures.map((f, i) => {
            const home = teamsBySlug.get(f.homeSlug);
            const away = teamsBySlug.get(f.awaySlug);
            if (!home || !away) return null;
            return (
              <li
                key={`${f.homeSlug}-${f.awaySlug}`}
                className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 p-2.5 dark:bg-white/[0.03]"
              >
                <span className="flex min-w-0 flex-1 items-center justify-end gap-1.5 text-right text-sm font-medium text-navy dark:text-slate-100">
                  <span className="truncate">{home.name}</span>
                  <span aria-hidden>
                    <Flag isoCode={home.isoCode} alt={home.name} width={28} />
                  </span>
                </span>
                <div className="flex shrink-0 items-center gap-1.5">
                  <ScoreInput
                    value={f.homeGoals}
                    onChange={(v) => updateScore(i, "home", v)}
                    label={`Goles de ${home.name}`}
                  />
                  <span className="text-slate-300 dark:text-slate-600">·</span>
                  <ScoreInput
                    value={f.awayGoals}
                    onChange={(v) => updateScore(i, "away", v)}
                    label={`Goles de ${away.name}`}
                  />
                </div>
                <span className="flex min-w-0 flex-1 items-center gap-1.5 text-sm font-medium text-navy dark:text-slate-100">
                  <span aria-hidden>
                    <Flag isoCode={away.isoCode} alt={away.name} width={28} />
                  </span>
                  <span className="truncate">{away.name}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Resultado: tabla + clasificados */}
      <div className="space-y-4">
        <GroupTable standings={standings} label={`Grupo ${groupId} — proyección`} />

        <div className="card border-pitch/30 bg-pitch/[0.04] p-5">
          <p className="eyebrow">Clasifican (Top 2)</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {qualified.map((s) => {
              const team = teamsBySlug.get(s.teamSlug);
              if (!team) return null;
              return (
                <span
                  key={s.teamSlug}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-navy shadow-sm dark:bg-navy-900 dark:text-slate-100"
                >
                  <span aria-hidden>
                    <Flag isoCode={team.isoCode} alt={team.name} width={28} />
                  </span>
                  {team.name}
                  <span className="stat-num text-xs text-pitch-600 dark:text-pitch-300">
                    {s.points} pts
                  </span>
                </span>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            En caso de empate a puntos se ordena por diferencia de goles y goles a favor.
          </p>
        </div>
      </div>
    </div>
  );
}
