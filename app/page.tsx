import type { Metadata } from "next";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import LocalTime from "@/components/LocalTime";
import LocalDate from "@/components/LocalDate";
import TodayMatches from "@/components/TodayMatches";
import SeoJsonLd from "@/components/SeoJsonLd";
import Flag from "@/components/Flag";
import MatchCard from "@/components/MatchCard";
import StatusBadge from "@/components/StatusBadge";
import { getTeam } from "@/data/teams";
import { getFreshMatches, matches } from "@/data/matches";
import { computeTopScorers, computeTopAssists } from "@/lib/stats";
import PlayerStatTable from "@/components/PlayerStatTable";
import { readLiveUpdatesWithFIFA, fetchAllFIFAResults } from "@/lib/live";
import { getLatestArticles } from "@/data/articles";
import { siteConfig } from "@/lib/site";
import LiveAutoRefresh from "@/components/LiveAutoRefresh";
import { buildKnockoutRounds } from "@/lib/knockout-utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mundial 2026: partidos de hoy, tabla, resultados y predicciones",
  description:
    "Consulta partidos de hoy del Mundial 2026, resultados, tabla por grupos, selecciones, predicciones estadísticas y análisis editorial en DataGoal Lab.",
  alternates: { canonical: "/" },
};

const latestArticles = getLatestArticles(4);

function KnockMatchCard({ match }: { match: any }) {
  const home = match.homeSlug ? getTeam(match.homeSlug) : null;
  const away = match.awaySlug ? getTeam(match.awaySlug) : null;
  if (!home || !away) return null;
  return (
    <Link
      href="/eliminatorias"
      className="card card-hover block w-full max-w-sm p-4"
    >
      <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="rounded bg-pitch/10 px-2 py-0.5 font-semibold text-pitch-600 dark:text-pitch-400">
          {match.roundLabel}
        </span>
        {match.date && (
          <span>
            <LocalDate date={match.date} time={match.time || ""} format="dayMonth" />
            {match.time && <> · <LocalTime date={match.date} time={match.time} /></>}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Flag isoCode={home.isoCode} alt={home.name} width={28} />
          <span className="truncate text-sm font-semibold">{home.name}</span>
        </div>
        <span className="shrink-0 text-xs font-bold text-slate-400">vs</span>
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-sm font-semibold">{away.name}</span>
          <Flag isoCode={away.isoCode} alt={away.name} width={28} />
        </div>
      </div>
      {match.stadium && (
        <p className="mt-2 truncate text-center text-xs text-slate-400">
          {match.stadium} · {match.city}
        </p>
      )}
    </Link>
  );
}

export default async function HomePage() {
  const [freshUpdates, fifaResults] = await Promise.all([
    readLiveUpdatesWithFIFA(),
    fetchAllFIFAResults(),
  ]);
  const freshMatches = getFreshMatches(freshUpdates);

  const upcomingSorted = [...freshMatches]
    .filter((m) => m.status === "upcoming")
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
  const nextMatch = upcomingSorted[0];

  const liveMatches = freshMatches.filter((m) => m.status === "live" || m.status === "halftime");

  // Build knockout rounds and find upcoming matches
  const rounds = await buildKnockoutRounds(fifaResults);
  const allKoMatches = rounds.flatMap((r) => r.matches);
  const upcomingKo = allKoMatches
    .filter((m) => m.status === "upcoming" && m.homeSlug && m.awaySlug)
    .sort((a, b) => {
      const aDate = a.date || "2099-12-31";
      const bDate = b.date || "2099-12-31";
      const aTime = a.time || "00:00";
      const bTime = b.time || "00:00";
      return `${aDate}T${aTime}`.localeCompare(`${bDate}T${bTime}`);
    });
  const nextKoMatch = upcomingKo[0];

  const topScorers = computeTopScorers(matches);
  const topAssists = computeTopAssists(matches);

  const todayStr = new Date().toISOString().slice(0, 10);
  const liveCount = liveMatches.length;

  const liveMatch = liveMatches.length > 0 ? liveMatches[0] : null;

  // Hero: prioritize live, then upcoming knockout, then upcoming group
  const heroMatch = liveMatch || nextKoMatch || nextMatch;

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
      {heroMatch && "date" in heroMatch && (
        <LiveAutoRefresh
          status={liveMatch ? "live" : "upcoming"}
          matchDateUTC={`${heroMatch.date || ""}T${heroMatch.time || "00:00"}:00Z`}
        />
      )}

      {/* ───────────────── Hero ───────────────── */}
      <section className="relative overflow-hidden bg-field bg-navy-950 text-white">
        <div className="container-page relative py-16 sm:py-20 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:items-center">
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
                <Link href="/eliminatorias" className="btn-primary">
                  Ver fase eliminatoria
                  {upcomingKo.length > 0 && (
                    <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs">{upcomingKo.length} cruces</span>
                  )}
                </Link>
                <Link href="/predicciones" className="btn-ghost !border-white/20 !text-white hover:!border-pitch-300 hover:!text-pitch-300">
                  Predicciones del torneo
                </Link>
              </div>
            </div>

            {/* Next match card */}
            <div className="flex w-full flex-col items-center gap-4 lg:max-w-sm">
              {liveMatch ? (
                <div className="w-full max-w-sm">
                  <MatchCard match={liveMatch} className="w-full" />
                </div>
              ) : nextKoMatch ? (
                <KnockMatchCard match={nextKoMatch} />
              ) : nextMatch ? (
                <div className="w-full max-w-sm">
                  <MatchCard match={nextMatch} className="w-full" />
                </div>
              ) : (
                <div className="w-full max-w-sm rounded-2xl bg-white/10 p-6 text-center">
                  <p className="text-sm text-slate-300">Todos los partidos finalizados</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container-page">
        {/* ───────────────── Últimos análisis ───────────────── */}
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

        {/* ──────── Fase eliminatoria ──────── */}
        <section aria-labelledby="ko" className="py-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Eliminación directa</p>
              <h2 id="ko" className="section-title">Próximos cruces</h2>
            </div>
            <Link href="/eliminatorias" className="shrink-0 text-sm font-semibold text-pitch-600 hover:underline dark:text-pitch-300">
              Bracket completo →
            </Link>
          </div>
          {upcomingKo.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingKo.slice(0, 6).map((m) => (
                <KnockMatchCard key={m.slug} match={m} />
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center text-slate-500">
              {rounds.some((r) => r.matches.some((m) => m.status === "finished"))
                ? "La fase eliminatoria ha finalizado."
                : "Los cruces se definirán al terminar la fase de grupos."}
            </div>
          )}
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
}
