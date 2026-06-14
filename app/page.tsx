import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import MatchCard from "@/components/MatchCard";
import ArticleCard from "@/components/ArticleCard";
import SeoJsonLd from "@/components/SeoJsonLd";
import Flag from "@/components/Flag";
import { teams, getTeam } from "@/data/teams";
import {
  getTodayMatches,
  getMatchOfTheDay,
  getLiveMatches,
} from "@/data/matches";
import { getLatestArticles } from "@/data/articles";
import { formatDayMonth } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mundial 2026: partidos de hoy, tabla, resultados y predicciones",
  description:
    "Consulta partidos de hoy del Mundial 2026, resultados, tabla por grupos, selecciones, predicciones estadísticas y calculadora de clasificación en DataGoal 2026.",
  alternates: { canonical: "/" },
};

// Métricas derivadas para las tarjetas rápidas.
const topAdvance = [...teams].sort((a, b) => b.probAdvance - a.probAdvance)[0];
const topRanked = [...teams].sort((a, b) => a.internalRank - b.internalRank).slice(0, 3);
const biggestSurprise = [...teams]
  .filter((t) => t.internalRank <= 30)
  .sort((a, b) => b.fifaRank - b.internalRank - (a.fifaRank - a.internalRank))[0];
const matchOfDay = getMatchOfTheDay();

const todayMatches = getTodayMatches();
const liveCount = getLiveMatches().length;
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
  const home = getTeam(matchOfDay.homeSlug);
  const away = getTeam(matchOfDay.awaySlug);
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
            <QuickStatCard eyebrow="⚽ Partido del día" href={`/partidos/${matchOfDay.slug}`}>
              {home && away && (
                <div>
                  <div className="flex items-center gap-2">
                    <span aria-hidden>
                      <Flag isoCode={home.isoCode} alt={home.name} width={32} />
                    </span>
                    <span className="text-sm font-bold text-slate-400">vs</span>
                    <span aria-hidden>
                      <Flag isoCode={away.isoCode} alt={away.name} width={32} />
                    </span>
                  </div>
                  <p className="mt-2 font-display font-bold leading-tight text-navy dark:text-slate-100">
                    {home.name} · {away.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {formatDayMonth(matchOfDay.date)} · {matchOfDay.time} · Gr. {matchOfDay.group}
                  </p>
                </div>
              )}
            </QuickStatCard>

            <QuickStatCard eyebrow="🚀 Más probable de avanzar" href={`/selecciones/${topAdvance.slug}`}>
              <div className="flex items-center gap-3">
                <span aria-hidden>
                  <Flag isoCode={topAdvance.isoCode} alt={topAdvance.name} width={48} />
                </span>
                <div>
                  <p className="font-display text-lg font-bold leading-tight text-navy dark:text-slate-100">
                    {topAdvance.name}
                  </p>
                  <p className="stat-num text-2xl font-extrabold text-pitch-600 dark:text-pitch-300">
                    {topAdvance.probAdvance}%
                  </p>
                </div>
              </div>
            </QuickStatCard>

            <QuickStatCard eyebrow="📈 Mayor sorpresa" href={`/selecciones/${biggestSurprise.slug}`}>
              <div className="flex items-center gap-3">
                <span aria-hidden>
                  <Flag isoCode={biggestSurprise.isoCode} alt={biggestSurprise.name} width={48} />
                </span>
                <div>
                  <p className="font-display text-lg font-bold leading-tight text-navy dark:text-slate-100">
                    {biggestSurprise.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    FIFA #{biggestSurprise.fifaRank} → modelo #{biggestSurprise.internalRank}
                  </p>
                </div>
              </div>
            </QuickStatCard>

            <QuickStatCard eyebrow="🏆 Ranking por rendimiento" href="/predicciones">
              <ol className="space-y-1.5">
                {topRanked.map((t, i) => (
                  <li key={t.slug} className="flex items-center gap-2 text-sm">
                    <span className="stat-num w-4 font-bold text-slate-400">{i + 1}</span>
                    <span aria-hidden>
                      <Flag isoCode={t.isoCode} alt={t.name} width={24} />
                    </span>
                    <span className="font-semibold text-navy dark:text-slate-100">{t.name}</span>
                  </li>
                ))}
              </ol>
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
                  value={biggestSurprise.name}
                  label="La selección que más sube respecto a su ranking FIFA"
                  href="/tendencias/cinco-selecciones-sorprenden-datos"
                />
                <TrendStat
                  emoji="📊"
                  value={`${topAdvance.probAdvance}%`}
                  label={`${topAdvance.name} lidera la probabilidad de avanzar`}
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
