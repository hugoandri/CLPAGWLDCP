import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import MatchCard from "@/components/MatchCard";
import ArticleCard from "@/components/ArticleCard";
import SeoJsonLd from "@/components/SeoJsonLd";
import Flag from "@/components/Flag";
import { teams, getTeam } from "@/data/teams";
import {
  getFreshMatches,
} from "@/data/matches";
import { readLiveUpdates } from "@/lib/live";
import { groups } from "@/data/groups";
import { getLatestArticles } from "@/data/articles";
import { computeStandings, formatDayMonth } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mundial 2026: partidos de hoy, tabla, resultados y predicciones",
  description:
    "Consulta partidos de hoy del Mundial 2026, resultados, tabla por grupos, selecciones, predicciones estadísticas y calculadora de clasificación en DataGoal 2026.",
  alternates: { canonical: "/" },
};

// Datos frescos: lee live-updates.json desde disco en cada request
const freshUpdates = readLiveUpdates();
const freshMatches = getFreshMatches(freshUpdates);

const upcomingSorted = [...freshMatches]
  .filter((m) => m.status === "upcoming")
  .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
const nextMatch = upcomingSorted[0];

const liveMatch = freshMatches.find((m) => m.status === "live");
const finishedSorted = [...freshMatches]
  .filter((m) => m.status === "finished")
  .sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`));
const lastFinished = finishedSorted[0];

// Sorpresa: el equipo que tenía menos probabilidades de ganar y ganó
type Surprise = { team: typeof teams[0]; match: (typeof freshMatches)[0]; prob: number };
const surprises: Surprise[] = [];
for (const m of freshMatches) {
  if (m.status !== "finished" || m.homeScore == null || m.awayScore == null) continue;
  if (m.homeScore > m.awayScore) {
    const t = getTeam(m.homeSlug);
    if (t) surprises.push({ team: t, match: m, prob: m.probHome });
  } else if (m.awayScore > m.homeScore) {
    const t = getTeam(m.awaySlug);
    if (t) surprises.push({ team: t, match: m, prob: m.probAway });
  }
}
surprises.sort((a, b) => a.prob - b.prob);
const biggestSurprise = surprises[0];

// Ranking general: computed standings de todos los grupos combinados y ordenados
const allStandings = groups.flatMap((g) => computeStandings(g.rows));
allStandings.sort(
  (a, b) =>
    b.points - a.points ||
    b.gd - a.gd ||
    b.gf - a.gf ||
    a.teamSlug.localeCompare(b.teamSlug),
);
const topRankedGlobal = allStandings.slice(0, 3);
const topAdvanceTeam = [...teams].sort((a, b) => b.probAdvance - a.probAdvance)[0];

const todayStr = new Date().toISOString().slice(0, 10);
const todayMatches = freshMatches.filter((m) => m.date === todayStr);
const liveCount = freshMatches.filter((m) => m.status === "live").length;
const latestArticles = getLatestArticles(3);

function QuickStatCard({
  eyebrow,
  href,
  children,
}: {
  eyebrow: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="card card-hover flex flex-col p-5">
      <p className="eyebrow">{eyebrow}</p>
      <div className="mt-3 flex-1">{children}</div>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-pitch-600 dark:text-pitch-300">
        Ver detalle <span aria-hidden>→</span>
      </span>
    </Link>
  );
}

export default function HomePage() {
  const next = nextMatch ? { home: getTeam(nextMatch.homeSlug), away: getTeam(nextMatch.awaySlug) } : { home: null, away: null };
  const live = liveMatch
    ? { match: liveMatch, home: getTeam(liveMatch.homeSlug), away: getTeam(liveMatch.awaySlug) }
    : lastFinished
      ? { match: lastFinished, home: getTeam(lastFinished.homeSlug), away: getTeam(lastFinished.awaySlug) }
      : null;
  const surpriseTeam = biggestSurprise?.team ?? null;
  const surpriseRival = biggestSurprise ? getTeam(
    biggestSurprise.match.awaySlug === biggestSurprise.team.slug
      ? biggestSurprise.match.homeSlug
      : biggestSurprise.match.awaySlug
  ) : null;
  const surpriseProb = biggestSurprise?.prob;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: metadata.title,
    description: metadata.description,
    url: siteConfig.url,
    isPartOf: {
      "@id": `${siteConfig.url}/#website`,
    },
    inLanguage: "es",
    about: {
      "@type": "SportsEvent",
      name: "Copa Mundial de la FIFA 2026",
      sport: "Soccer",
    },
  };

  return (
    <>
      <SeoJsonLd data={jsonLd} />
      {/* ───────────────── Hero ───────────────── */}
      <section className="relative overflow-hidden bg-field bg-navy-950 text-white">
        <div className="container-page relative py-16 sm:py-20 lg:py-24">
          <p className="eyebrow !text-pitch-300">
            <span className="inline-block h-2 w-2 rounded-full bg-pitch" />
            Análisis estadístico · Mundial 2026
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Mundial 2026 en datos: partidos, probabilidades y tendencias
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-300">
            Análisis diario, tablas, predicciones estadísticas y visualizaciones
            del torneo. Sin lenguaje de apuestas: solo números.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/partidos" className="btn-primary">
              Ver partidos de hoy
              {liveCount > 0 && (
                <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                  {liveCount} en vivo
                </span>
              )}
            </Link>
            <Link href="/predicciones" className="btn-ghost !border-white/20 !text-white hover:!border-pitch-300 hover:!text-pitch-300">
              Predicciones del torneo
            </Link>
          </div>

          <dl className="mt-12 grid max-w-2xl grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {[
              { v: "48", l: "Selecciones" },
              { v: "12", l: "Grupos" },
              { v: "104", l: "Partidos totales" },
            ].map((s) => (
              <div key={s.l}>
                <dt className="stat-num text-3xl font-extrabold text-white sm:text-4xl">
                  {s.v}
                </dt>
                <dd className="mt-1 text-sm text-slate-400">{s.l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="container-page">
        {/* Banner superior AdSense */}
        <div className="py-6">
          <AdSlot slotName="home-top-banner" format="leaderboard" />
        </div>

        {/* ───────────────── Tarjetas rápidas ───────────────── */}
        <section aria-labelledby="rapidas" className="pb-4">
          <h2 id="rapidas" className="sr-only">
            Resumen rápido
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <QuickStatCard eyebrow="⚽ Próximo partido" href={nextMatch ? `/partidos/${nextMatch.slug}` : "/partidos"}>
              {next.home && next.away && (
                <div>
                  <div className="flex items-center gap-2">
                    <span aria-hidden>
                      <Flag isoCode={next.home.isoCode} alt={next.home.name} width={32} />
                    </span>
                    <span className="text-sm font-bold text-slate-400">vs</span>
                    <span aria-hidden>
                      <Flag isoCode={next.away.isoCode} alt={next.away.name} width={32} />
                    </span>
                  </div>
                  <p className="mt-2 font-display font-bold leading-tight text-navy dark:text-slate-100">
                    {next.home.name} · {next.away.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {formatDayMonth(nextMatch!.date)} · {nextMatch!.time} · Gr. {nextMatch!.group}
                  </p>
                </div>
              )}
            </QuickStatCard>

            <QuickStatCard
              eyebrow={liveMatch ? "🔴 En vivo" : "⚪ Último resultado"}
              href={live ? `/partidos/${live.match.slug}` : "/partidos"}
            >
              {live && live.home && live.away && (
                <div>
                  <div className="flex items-center gap-2">
                    <span aria-hidden>
                      <Flag isoCode={live.home.isoCode} alt={live.home.name} width={32} />
                    </span>
                    <span className="text-sm font-bold text-slate-400">
                      {live.match.homeScore ?? ""}-{live.match.awayScore ?? ""}
                    </span>
                    <span aria-hidden>
                      <Flag isoCode={live.away.isoCode} alt={live.away.name} width={32} />
                    </span>
                  </div>
                  <p className="mt-2 font-display font-bold leading-tight text-navy dark:text-slate-100">
                    {live.home.name} · {live.away.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {liveMatch ? `EN VIVO · ${liveMatch.minute ?? ""}'` : `${formatDayMonth(lastFinished!.date)} · Finalizado`}
                  </p>
                </div>
              )}
            </QuickStatCard>

            <QuickStatCard eyebrow="📈 Sorpresa" href={surpriseTeam ? `/selecciones/${surpriseTeam.slug}` : "#"}>
              {surpriseTeam && (
                <div className="flex items-center gap-3">
                  <span aria-hidden>
                    <Flag isoCode={surpriseTeam.isoCode} alt={surpriseTeam.name} width={48} />
                  </span>
                  <div>
                    <p className="font-display text-lg font-bold leading-tight text-navy dark:text-slate-100">
                      {surpriseTeam.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      Solo {surpriseProb}% de ganar · Venció a {surpriseRival?.name ?? ""}
                    </p>
                  </div>
                </div>
              )}
            </QuickStatCard>

            <QuickStatCard eyebrow="🏆 Ranking por rendimiento" href="/tendencias?tab=tabla">
              <div className="space-y-1.5">
                {topRankedGlobal.map((s, i) => {
                  const t = getTeam(s.teamSlug);
                  if (!t) return null;
                  return (
                    <div key={s.teamSlug} className="flex items-center gap-2 text-sm">
                      <span className="stat-num w-4 font-bold text-slate-400">{i + 1}</span>
                      <span aria-hidden>
                        <Flag isoCode={t.isoCode} alt={t.name} width={24} />
                      </span>
                      <span className="flex-1 truncate font-semibold text-navy dark:text-slate-100">{t.name}</span>
                      <span className="stat-num font-bold text-navy dark:text-slate-100">{s.points}</span>
                      <span className="text-xs text-slate-400">pts</span>
                    </div>
                  );
                })}
              </div>
            </QuickStatCard>
          </div>
        </section>

        {/* ───────────────── Partidos de hoy ───────────────── */}
        <section aria-labelledby="hoy" className="py-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Jornada</p>
              <h2 id="hoy" className="section-title">
                Partidos de hoy
              </h2>
            </div>
            <Link href="/partidos" className="shrink-0 text-sm font-semibold text-pitch-600 hover:underline dark:text-pitch-300">
              Calendario completo →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {todayMatches.slice(0, 2).map((m) => (
              <MatchCard key={m.slug} match={m} />
            ))}

            {/* Anuncio in-feed entre tarjetas */}
            <AdSlot
              slotName="home-infeed"
              format="in-feed"
              className="sm:col-span-2 lg:col-span-1"
            />

            {todayMatches.slice(2).map((m) => (
              <MatchCard key={m.slug} match={m} />
            ))}
          </div>
        </section>

        {/* ───────── Tendencias + anuncio lateral (desktop) ───────── */}
        <section aria-labelledby="tendencias" className="py-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
            <div>
              <div className="mb-5">
                <p className="eyebrow">Lo que dicen los números</p>
                <h2 id="tendencias" className="section-title">
                  Tendencias del Mundial
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <TrendStat
                  emoji="🛡️"
                  value="Grupo C"
                  label="El grupo más difícil del torneo según el índice de dificultad"
                  href="/tendencias/camino-mas-dificil-mundial-2026"
                />
                <TrendStat
                  emoji="🔥"
                  value={biggestSurprise?.team.name ?? ""}
                  label="La sorpresa del torneo: el equipo con la victoria más improbable"
                  href={`/selecciones/${biggestSurprise?.team.slug ?? ""}`}
                />
                <TrendStat
                  emoji="📊"
                  value={`${topAdvanceTeam.probAdvance}%`}
                  label={`${topAdvanceTeam.name} lidera la probabilidad de avanzar`}
                  href="/predicciones"
                />
              </div>

              <div className="mt-4">
                <Link href="/tendencias" className="btn-ghost">
                  Ver todas las tendencias
                </Link>
              </div>
            </div>

            {/* Anuncio lateral solo en desktop */}
            <div className="hidden lg:block">
              <div className="sticky top-20">
                <AdSlot slotName="home-sidebar" format="vertical" />
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────── Últimos análisis ───────────────── */}
        <section aria-labelledby="analisis" className="py-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Editorial</p>
              <h2 id="analisis" className="section-title">
                Últimos análisis
              </h2>
            </div>
            <Link href="/tendencias" className="shrink-0 text-sm font-semibold text-pitch-600 hover:underline dark:text-pitch-300">
              Ver todos →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </section>

        {/* Anuncio inferior antes del footer */}
        <div className="py-8">
          <AdSlot slotName="home-bottom-banner" format="leaderboard" />
        </div>
      </div>
    </>
  );
}

function TrendStat({
  emoji,
  value,
  label,
  href,
}: {
  emoji: string;
  value: string;
  label: string;
  href: string;
}) {
  return (
    <Link href={href} className="card card-hover flex flex-col p-5">
      <span aria-hidden className="text-2xl">
        {emoji}
      </span>
      <p className="mt-3 font-display text-xl font-extrabold text-navy dark:text-slate-100">
        {value}
      </p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </Link>
  );
}
