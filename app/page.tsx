import type { Metadata } from "next";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import LocalTime from "@/components/LocalTime";
import LocalDate from "@/components/LocalDate";
import TodayMatches from "@/components/TodayMatches";
import SeoJsonLd from "@/components/SeoJsonLd";
import Flag from "@/components/Flag";
import StatusBadge from "@/components/StatusBadge";
import { getTeam } from "@/data/teams";
import { getFreshMatches, matches } from "@/data/matches";
import { computeTopScorers, computeTopAssists } from "@/lib/stats";
import PlayerStatTable from "@/components/PlayerStatTable";
import { readLiveUpdatesWithFIFA } from "@/lib/live";
import { getLatestArticles } from "@/data/articles";
import { siteConfig } from "@/lib/site";
import LiveAutoRefresh from "@/components/LiveAutoRefresh";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mundial 2026: partidos de hoy, tabla, resultados y predicciones",
  description:
    "Consulta partidos de hoy del Mundial 2026, resultados, tabla por grupos, selecciones, predicciones estadísticas y análisis editorial en DataGoal Lab.",
  alternates: { canonical: "/" },
};

const latestArticles = getLatestArticles(4);

export default async function HomePage() {
  const freshUpdates = await readLiveUpdatesWithFIFA();
  const freshMatches = getFreshMatches(freshUpdates);

  const upcomingSorted = [...freshMatches]
    .filter((m) => m.status === "upcoming")
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
  const nextMatch = upcomingSorted[0];

  const liveMatches = freshMatches.filter((m) => m.status === "live" || m.status === "halftime");
  const finishedSorted = [...freshMatches]
    .filter((m) => m.status === "finished")
    .sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`));
  const lastFinished = finishedSorted[0];

  const topScorers = computeTopScorers(matches);
  const topAssists = computeTopAssists(matches);

  const todayStr = new Date().toISOString().slice(0, 10);
  const liveCount = liveMatches.length;

  const liveMatch = liveMatches.length > 0 ? liveMatches[0] : null;
  const heroMatches = liveMatches.slice(0, 2);
  if (heroMatches.length < 2 && nextMatch && !heroMatches.some(m => m.slug === nextMatch.slug)) {
    heroMatches.push(nextMatch);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: metadata.title,
    description: metadata.description,
    url: siteConfig.url,
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    inLanguage: "es",
    about: { "@type": "SportsEvent", name: "Copa Mundial de la FIFA 2026", sport: "Soccer" },
  };

  return (
    <>
      <SeoJsonLd data={jsonLd} />
      {liveMatch && (
        <LiveAutoRefresh status="live" matchDateUTC={`${liveMatch.date}T${liveMatch.time}:00Z`} />
      )}
      {!liveMatch && nextMatch && (
        <LiveAutoRefresh status="upcoming" matchDateUTC={`${nextMatch.date}T${nextMatch.time}:00Z`} />
      )}

      {/* ───────────────── Hero ───────────────── */}
      <section className="relative overflow-hidden bg-field bg-navy-950 text-white">
        <div className="container-page relative py-16 sm:py-20 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
            <div>
              <p className="eyebrow !text-pitch-300">
                <span className="inline-block h-2 w-2 rounded-full bg-pitch" />
                Análisis estadístico · Mundial 2026
              </p>
              <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
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
                    <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs">{liveCount} en vivo</span>
                  )}
                </Link>
                <Link href="/predicciones" className="btn-ghost !border-white/20 !text-white hover:!border-pitch-300 hover:!text-pitch-300">
                  Predicciones del torneo
                </Link>
              </div>
            </div>

            {/* Live / Next match cards */}
            <div className="flex flex-col items-center gap-4 lg:items-end">
              {heroMatches.length > 0 ? heroMatches.map((m) => <LiveMatchCard key={m.slug} match={m} />) : (
                <div className="w-full max-w-sm rounded-2xl bg-white/10 p-6 text-center">
                  <p className="text-sm text-slate-300">No hay partidos programados</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container-page">
        {/* ───────────────── Últimos análisis (antes QuickStats) ───────────────── */}
        <section aria-labelledby="analisis" className="py-10">
          <div className="mb-6 flex items-end justify-between gap-4">
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {latestArticles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </section>

        {/* ───────────────── Partidos de hoy ───────────────── */}
        <section aria-labelledby="hoy" className="py-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Jornada</p>
              <h2 id="hoy" className="section-title">Partidos de hoy</h2>
            </div>
            <Link href="/partidos" className="shrink-0 text-sm font-semibold text-pitch-600 hover:underline dark:text-pitch-300">
              Calendario completo →
            </Link>
          </div>
          <TodayMatches matches={freshMatches} initialTodayKey={todayStr} />
        </section>

        {/* ───────────────── Destacados ───────────────── */}
        <section aria-labelledby="destacados" className="py-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Estadísticas</p>
              <h2 id="destacados" className="section-title">Destacados</h2>
            </div>
            <Link href="/tabla" className="shrink-0 text-sm font-semibold text-pitch-600 hover:underline dark:text-pitch-300">
              Tablas completas →
            </Link>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <PlayerStatTable title="Goleadores" rows={topScorers} valueLabel="Goles" emptyLabel="Aún no hay goles registrados." limit={5} />
            <PlayerStatTable title="Asistencias" rows={topAssists} valueLabel="Asist." emptyLabel="Aún no hay asistencias registradas." limit={5} />
          </div>
        </section>
      </div>
    </>
  );

  function LiveMatchCard({ match: m }: { match: typeof freshMatches[0] }) {
    const home = getTeam(m.homeSlug);
    const away = getTeam(m.awaySlug);
    if (!home || !away) return null;
    const isLive = m.status === "live" || m.status === "halftime";
    return (
      <Link
        href={`/partidos/${m.slug}`}
        className="w-full max-w-sm rounded-2xl bg-white/10 p-5 backdrop-blur-sm transition hover:bg-white/15"
      >
        <div className="mb-3 flex items-center gap-2 text-xs text-slate-300">
          <StatusBadge status={m.status} minute={m.minute} />
          <span>Grupo {m.group}</span>
          {!isLive && <><span aria-hidden>·</span><LocalDate date={m.date} time={m.time} format="dayMonth" /></>}
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Flag isoCode={home.isoCode} alt={home.name} width={36} />
            <span className="text-sm font-semibold">{home.name}</span>
          </div>
          {isLive ? (
            <span className="stat-num text-xl font-extrabold text-pitch-300">
              {m.homeScore}–{m.awayScore}
            </span>
          ) : (
            <span className="stat-num text-lg font-bold text-pitch-300">
              <LocalTime date={m.date} time={m.time} />
            </span>
          )}
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-semibold">{away.name}</span>
            <Flag isoCode={away.isoCode} alt={away.name} width={36} />
          </div>
        </div>
        {!isLive && (
          <p className="mt-2 text-center text-xs text-slate-400">
            {m.stadium} · {m.city}
          </p>
        )}
      </Link>
    );
  }
}
