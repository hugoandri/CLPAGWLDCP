import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { matches, getMatch } from "@/data/matches";
import { getTeam } from "@/data/teams";
import { getPrediction } from "@/data/predictions";
import type { FormResult, Team } from "@/lib/types";
import { cn, formatDateLong, pctWidth } from "@/lib/utils";
import { siteConfig, DISCLAIMER_BETTING } from "@/lib/site";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";
import AdSlot from "@/components/AdSlot";
import ProbBar from "@/components/ProbBar";
import StatusBadge from "@/components/StatusBadge";
import DisclaimerBox from "@/components/DisclaimerBox";
import SeoJsonLd from "@/components/SeoJsonLd";

export function generateStaticParams() {
  return matches.map((m) => ({ slug: m.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const match = getMatch(params.slug);
  if (!match) return { title: "Partido no encontrado" };
  const home = getTeam(match.homeSlug);
  const away = getTeam(match.awaySlug);
  const hasScore = match.status !== "upcoming";
  const score = hasScore ? ` ${match.homeScore}-${match.awayScore}` : "";
  const title = hasScore
    ? `${home?.name} vs ${away?.name}${score}: resultado, resumen y datos`
    : `${home?.name} vs ${away?.name}: horario, previa, probabilidades y datos`;
  const description = hasScore
    ? `Resultado de ${home?.name} vs ${away?.name}${score} en el Grupo ${match.group} del Mundial 2026: marcador, sede, comparativa estadística y claves del partido.`
    : `Previa estadística de ${home?.name} contra ${away?.name} (Grupo ${match.group}, Mundial 2026): horario, ${match.stadium}, probabilidades, comparativa de selecciones y claves del partido.`;
  return {
    title,
    description,
    alternates: { canonical: `/partidos/${match.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/partidos/${match.slug}`,
    },
  };
}

const STAT_LABELS: { key: keyof Team["stats"]; label: string }[] = [
  { key: "attack", label: "Ataque" },
  { key: "defense", label: "Defensa" },
  { key: "possession", label: "Posesión" },
  { key: "pressing", label: "Presión" },
  { key: "finishing", label: "Efectividad" },
];

function FormPips({ form }: { form: FormResult[] }) {
  const map: Record<FormResult, string> = {
    W: "bg-pitch text-white",
    D: "bg-slate-300 text-slate-700 dark:bg-slate-600 dark:text-white",
    L: "bg-red-500 text-white",
  };
  const label: Record<FormResult, string> = { W: "G", D: "E", L: "P" };
  return (
    <div className="flex gap-1.5">
      {form.map((r, i) => (
        <span
          key={i}
          className={cn(
            "grid h-6 w-6 place-items-center rounded-md text-xs font-bold",
            map[r],
          )}
          title={r === "W" ? "Victoria" : r === "D" ? "Empate" : "Derrota"}
        >
          {label[r]}
        </span>
      ))}
    </div>
  );
}

function H2HRow({
  label,
  homeVal,
  awayVal,
}: {
  label: string;
  homeVal: number;
  awayVal: number;
}) {
  const homeWins = homeVal >= awayVal;
  return (
    <div className="grid grid-cols-[2.5rem_1fr_2.5rem] items-center gap-3">
      <span
        className={cn(
          "stat-num text-right text-sm font-bold",
          homeWins ? "text-pitch-600 dark:text-pitch-300" : "text-slate-400",
        )}
      >
        {homeVal}
      </span>
      <div>
        <p className="mb-1 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <div className="flex items-center gap-1">
          <div className="flex h-2 flex-1 justify-end overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
            <span className="h-full rounded-full bg-pitch" style={{ width: pctWidth(homeVal) }} />
          </div>
          <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
            <span className="h-full rounded-full bg-navy-700 dark:bg-blue-500" style={{ width: pctWidth(awayVal) }} />
          </div>
        </div>
      </div>
      <span
        className={cn(
          "stat-num text-sm font-bold",
          !homeWins ? "text-navy-700 dark:text-blue-300" : "text-slate-400",
        )}
      >
        {awayVal}
      </span>
    </div>
  );
}

function TeamColumn({ team, side }: { team: Team; side: "Local" | "Visitante" }) {
  return (
    <Link
      href={`/selecciones/${team.slug}`}
      className="flex flex-1 flex-col items-center gap-2 text-center"
    >
      <span aria-hidden className="text-5xl sm:text-6xl">
        {team.flag}
      </span>
      <span className="font-display text-lg font-bold leading-tight text-navy dark:text-slate-100">
        {team.name}
      </span>
      <span className="text-xs text-slate-400">
        {side} · #{team.internalRank}
      </span>
    </Link>
  );
}

export default function MatchPage({ params }: { params: { slug: string } }) {
  const match = getMatch(params.slug);
  if (!match) notFound();

  const home = getTeam(match.homeSlug);
  const away = getTeam(match.awaySlug);
  if (!home || !away) notFound();

  const homePred = getPrediction(home.slug);
  const awayPred = getPrediction(away.slug);
  const hasScore = match.status !== "upcoming";

  const relatedMatches = matches
    .filter((m) => m.group === match.group && m.slug !== match.slug)
    .slice(0, 4);

  const matchTitle = `${home.name} vs ${away.name}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SportsEvent",
      name: `${matchTitle} — Mundial 2026`,
      description: hasScore
        ? `Resultado ${match.homeScore}-${match.awayScore} de ${matchTitle} en el Grupo ${match.group} del Mundial 2026.`
        : `Previa estadística de ${matchTitle} en el Grupo ${match.group} del Mundial 2026.`,
      sport: "Soccer",
      startDate: `${match.date}T${match.time}:00Z`,
      eventStatus:
        match.status === "finished"
          ? "https://schema.org/EventCompleted"
          : "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: match.stadium,
        address: match.city,
      },
      homeTeam: {
        "@type": "SportsTeam",
        name: home.name,
        url: absoluteUrl(`/selecciones/${home.slug}`),
      },
      awayTeam: {
        "@type": "SportsTeam",
        name: away.name,
        url: absoluteUrl(`/selecciones/${away.slug}`),
      },
      performer: [
        { "@type": "SportsTeam", name: home.name },
        { "@type": "SportsTeam", name: away.name },
      ],
      url: absoluteUrl(`/partidos/${match.slug}`),
      organizer: {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
      },
    },
    breadcrumbJsonLd([
      { name: "Inicio", path: "/" },
      { name: "Partidos", path: "/partidos" },
      { name: matchTitle, path: `/partidos/${match.slug}` },
    ]),
  ];

  return (
    <div className="container-page pb-12">
      <SeoJsonLd data={jsonLd} />

      {/* Breadcrumb */}
      <nav aria-label="Migas de pan" className="pt-6 text-sm text-slate-500 dark:text-slate-400">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-pitch">Inicio</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/partidos" className="hover:text-pitch">Partidos</Link></li>
          <li aria-hidden>/</li>
          <li className="font-medium text-navy dark:text-slate-200">
            {home.name} vs {away.name}
          </li>
        </ol>
      </nav>

      <h1 className="sr-only">
        {home.name} vs {away.name}: análisis, horario, probabilidades y datos
      </h1>

      {/* Cabecera del partido */}
      <section className="mt-4 overflow-hidden rounded-2xl bg-field bg-navy-950 p-6 text-white sm:p-8">
        <div className="mb-4 flex items-center justify-center gap-3 text-sm text-slate-300">
          <StatusBadge status={match.status} minute={match.minute} />
          <span>{match.stage} · Grupo {match.group}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <TeamColumn team={home} side="Local" />
          <div className="px-2 text-center">
            {hasScore ? (
              <div className="stat-num text-4xl font-extrabold sm:text-5xl">
                {match.homeScore}
                <span className="mx-2 text-white/40">·</span>
                {match.awayScore}
              </div>
            ) : (
              <div className="stat-num text-3xl font-extrabold sm:text-4xl">{match.time}</div>
            )}
            <p className="mt-2 text-xs text-slate-400">{formatDateLong(match.date)}</p>
          </div>
          <TeamColumn team={away} side="Visitante" />
        </div>
        <p className="mt-6 text-center text-sm text-slate-300">
          📍 {match.stadium}, {match.city}
        </p>
      </section>

      <div className="my-6">
        <AdSlot slotName="partido-top-banner" format="leaderboard" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        {/* Columna principal */}
        <div className="space-y-8">
          {/* Probabilidades */}
          <section className="card p-6">
            <h2 className="section-title mb-1 text-xl">Probabilidades estadísticas</h2>
            <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
              Estimación del modelo para victoria local, empate y victoria visitante.
            </p>
            <ProbBar home={match.probHome} draw={match.probDraw} away={match.probAway} />
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <ProbStat label={home.name} value={match.probHome} tone="pitch" />
              <ProbStat label="Empate" value={match.probDraw} tone="slate" />
              <ProbStat label={away.name} value={match.probAway} tone="navy" />
            </div>
          </section>

          {/* Comparativa / gráfico de fortalezas */}
          <section className="card p-6">
            <h2 className="section-title mb-1 text-xl">Comparativa de selecciones</h2>
            <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-pitch-600 dark:text-pitch-300">{home.name}</span>{" "}
              vs{" "}
              <span className="font-semibold text-navy-700 dark:text-blue-300">{away.name}</span>
            </p>
            <div className="space-y-4">
              {STAT_LABELS.map((s) => (
                <H2HRow
                  key={s.key}
                  label={s.label}
                  homeVal={home.stats[s.key]}
                  awayVal={away.stats[s.key]}
                />
              ))}
            </div>
          </section>

          {/* Forma reciente + jugadores clave */}
          <section className="grid gap-4 sm:grid-cols-2">
            {[home, away].map((t) => (
              <div key={t.slug} className="card p-6">
                <div className="flex items-center gap-2">
                  <span aria-hidden className="text-2xl">{t.flag}</span>
                  <h3 className="font-display text-lg font-bold text-navy dark:text-slate-100">
                    {t.name}
                  </h3>
                </div>
                <div className="mt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Últimos 5 partidos
                  </p>
                  <FormPips form={t.form} />
                </div>
                <div className="mt-4 border-t border-slate-100 pt-4 dark:border-white/5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Jugador clave
                  </p>
                  <p className="mt-1 font-semibold text-navy dark:text-slate-100">
                    {t.keyPlayer}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t.keyPlayerRole}
                  </p>
                </div>
              </div>
            ))}
          </section>

          <AdSlot slotName="partido-mid-rectangle" format="rectangle" />

          {/* Qué mirar */}
          <section className="card p-6">
            <h2 className="section-title mb-4 text-xl">Qué mirar en este partido</h2>
            <ul className="space-y-3">
              {match.whatToWatch.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-pitch/10 text-xs font-bold text-pitch-600 dark:text-pitch-300"
                  >
                    {i + 1}
                  </span>
                  <span className="text-slate-600 dark:text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Probabilidades de torneo */}
          {homePred && awayPred && (
            <section className="card p-6">
              <h2 className="section-title mb-4 text-xl">Recorrido esperado en el torneo</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  { t: home, p: homePred },
                  { t: away, p: awayPred },
                ].map(({ t, p }) => (
                  <div key={t.slug}>
                    <p className="mb-2 font-semibold text-navy dark:text-slate-100">
                      {t.flag} {t.name}
                    </p>
                    <dl className="space-y-1.5 text-sm">
                      <PredRow label="Pasar de grupo" value={p.passGroup} />
                      <PredRow label="Llegar a semifinal" value={p.semifinal} />
                      <PredRow label="Ganar el torneo" value={p.winner} highlight />
                    </dl>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-right">
                <Link href="/predicciones" className="data-link text-sm">
                  Ver todas las predicciones →
                </Link>
              </p>
            </section>
          )}

          <DisclaimerBox>{DISCLAIMER_BETTING}</DisclaimerBox>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="lg:sticky lg:top-20">
            <AdSlot slotName="partido-sidebar" format="vertical" />
          </div>
          {relatedMatches.length > 0 && (
            <div className="card p-5">
              <h2 className="mb-3 font-display text-base font-bold text-navy dark:text-slate-100">
                Más del Grupo {match.group}
              </h2>
              <ul className="space-y-2">
                {relatedMatches.map((m) => {
                  const h = getTeam(m.homeSlug);
                  const a = getTeam(m.awaySlug);
                  return (
                    <li key={m.slug}>
                      <Link
                        href={`/partidos/${m.slug}`}
                        className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 text-sm hover:bg-slate-50 dark:hover:bg-white/5"
                      >
                        <span className="truncate">
                          {h?.flag} {h?.name} - {a?.name} {a?.flag}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function ProbStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "pitch" | "slate" | "navy";
}) {
  const toneCls =
    tone === "pitch"
      ? "text-pitch-600 dark:text-pitch-300"
      : tone === "navy"
        ? "text-navy-700 dark:text-blue-300"
        : "text-slate-500 dark:text-slate-400";
  return (
    <div className="rounded-xl bg-slate-50 p-3 dark:bg-white/[0.03]">
      <div className={cn("stat-num text-2xl font-extrabold", toneCls)}>{value}%</div>
      <div className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{label}</div>
    </div>
  );
}

function PredRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  const display = value > 0 && value < 1 ? "<1%" : `${Math.round(value)}%`;
  return (
    <div className="flex items-center justify-between">
      <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
      <dd
        className={cn(
          "stat-num font-bold",
          highlight ? "text-gold-600 dark:text-gold-400" : "text-navy dark:text-slate-100",
        )}
      >
        {display}
      </dd>
    </div>
  );
}
