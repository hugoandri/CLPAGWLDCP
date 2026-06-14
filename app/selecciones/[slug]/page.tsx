import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { teams, getTeam, getTeamsByGroup } from "@/data/teams";
import { getUpcomingMatchesByTeam } from "@/data/matches";
import { getPrediction } from "@/data/predictions";
import type { FormResult } from "@/lib/types";
import { cn } from "@/lib/utils";
import { DISCLAIMER_BETTING } from "@/lib/site";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import AdSlot from "@/components/AdSlot";
import StatBar from "@/components/StatBar";
import MatchCard from "@/components/MatchCard";
import PredictionCard from "@/components/PredictionCard";
import DisclaimerBox from "@/components/DisclaimerBox";
import SeoJsonLd from "@/components/SeoJsonLd";

export function generateStaticParams() {
  return teams.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const team = getTeam(params.slug);
  if (!team) return { title: "Selección no encontrada" };
  const title = `${team.name}: análisis, grupo, probabilidades y datos`;
  const description = `Perfil de ${team.name} en el Mundial 2026: Grupo ${team.group}, forma reciente, fortalezas y debilidades, probabilidad de clasificación (${team.probAdvance}%), análisis táctico y preguntas frecuentes.`;
  return {
    title,
    description,
    alternates: { canonical: `/selecciones/${team.slug}` },
    openGraph: { title, description, type: "profile" },
  };
}

function FormPips({ form }: { form: FormResult[] }) {
  const map: Record<FormResult, string> = {
    W: "bg-pitch text-white",
    D: "bg-slate-300 text-slate-700 dark:bg-slate-600 dark:text-white",
    L: "bg-red-500 text-white",
  };
  const letter: Record<FormResult, string> = { W: "G", D: "E", L: "P" };
  return (
    <div className="flex gap-1.5">
      {form.map((r, i) => (
        <span
          key={i}
          className={cn("grid h-7 w-7 place-items-center rounded-md text-xs font-bold", map[r])}
          title={r === "W" ? "Victoria" : r === "D" ? "Empate" : "Derrota"}
        >
          {letter[r]}
        </span>
      ))}
    </div>
  );
}

const STAT_LABELS = [
  { key: "attack", label: "Ataque" },
  { key: "defense", label: "Defensa" },
  { key: "possession", label: "Posesión" },
  { key: "pressing", label: "Presión" },
  { key: "finishing", label: "Efectividad" },
] as const;

export default function TeamPage({ params }: { params: { slug: string } }) {
  const team = getTeam(params.slug);
  if (!team) notFound();

  const prediction = getPrediction(team.slug);
  const upcoming = getUpcomingMatchesByTeam(team.slug, 3);
  const rivals = getTeamsByGroup(team.group).filter((t) => t.slug !== team.slug);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SportsTeam",
      name: team.name,
      alternateName: team.nickname,
      description: team.analysis.headline,
      sport: "Soccer",
      url: absoluteUrl(`/selecciones/${team.slug}`),
      memberOf: {
        "@type": "SportsOrganization",
        name: team.confederation,
      },
      coach: { "@type": "Person", name: team.coach },
      athlete: { "@type": "Person", name: team.keyPlayer },
    },
    breadcrumbJsonLd([
      { name: "Inicio", path: "/" },
      { name: "Selecciones", path: "/selecciones" },
      { name: team.name, path: `/selecciones/${team.slug}` },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: team.faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ];

  return (
    <div className="container-page pb-12">
      <SeoJsonLd data={jsonLd} />

      <nav aria-label="Migas de pan" className="pt-6 text-sm text-slate-500 dark:text-slate-400">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-pitch">Inicio</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/selecciones" className="hover:text-pitch">Selecciones</Link></li>
          <li aria-hidden>/</li>
          <li className="font-medium text-navy dark:text-slate-200">{team.name}</li>
        </ol>
      </nav>

      {/* Cabecera */}
      <section className="mt-4 overflow-hidden rounded-2xl bg-field bg-navy-950 p-6 text-white sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <span aria-hidden className="text-7xl">{team.flag}</span>
          <div className="flex-1">
            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              {team.name}
            </h1>
            <p className="mt-1 text-slate-300">
              {team.nickname} · {team.confederation}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <span className="chip bg-white/10 text-white">Grupo {team.group}</span>
              <span className="chip bg-white/10 text-white">Ranking modelo #{team.internalRank}</span>
              <span className="chip bg-white/10 text-white">FIFA #{team.fifaRank}</span>
              <span className="chip bg-pitch/20 text-pitch-300">DT: {team.coach}</span>
            </div>
          </div>
          <div className="rounded-2xl bg-white/10 p-5 text-center">
            <p className="text-xs uppercase tracking-wider text-slate-300">Prob. de avanzar</p>
            <p className="stat-num text-4xl font-extrabold text-pitch-300">{team.probAdvance}%</p>
          </div>
        </div>
      </section>

      <div className="my-6">
        <AdSlot slotName="seleccion-top-banner" format="leaderboard" />
      </div>

      {/* Datos rápidos */}
      <section className="mb-8">
        <h2 className="section-title mb-4 text-xl">Datos rápidos</h2>
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {team.quickFacts.map((f) => (
            <div key={f.label} className="card p-4">
              <dt className="text-xs uppercase tracking-wider text-slate-400">{f.label}</dt>
              <dd className="mt-1 font-display text-lg font-bold text-navy dark:text-slate-100">
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-8">
          {/* Conoce a la selección */}
          <section className="card overflow-hidden p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-pitch-600 dark:text-pitch-300">
                  Conoce a esta selección
                </p>
                <h2 className="mt-1 font-display text-2xl font-extrabold text-navy dark:text-slate-100">
                  {team.analysis.headline}
                </h2>
              </div>
              <span className="chip bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300">
                Grupo {team.group}
              </span>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <article className="rounded-2xl bg-pitch/10 p-4 dark:bg-pitch/15">
                <h3 className="font-display text-sm font-bold text-pitch-800 dark:text-pitch-200">
                  Cosas buenas
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {team.analysis.goodThings}
                </p>
              </article>
              <article className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
                <h3 className="font-display text-sm font-bold text-navy dark:text-slate-100">
                  Qué se espera
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {team.analysis.expectation}
                </p>
              </article>
              <article className="rounded-2xl bg-gold/10 p-4 dark:bg-gold/15">
                <h3 className="font-display text-sm font-bold text-gold-700 dark:text-gold-300">
                  Punto a mirar
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {team.analysis.watchPoint}
                </p>
              </article>
            </div>
          </section>

          {/* Fortalezas (gráfico) */}
          <section className="card p-6">
            <h2 className="section-title mb-4 text-xl">Perfil estadístico</h2>
            <div className="space-y-3">
              {STAT_LABELS.map((s) => (
                <StatBar key={s.key} label={s.label} value={team.stats[s.key]} />
              ))}
            </div>
          </section>

          {/* Fortalezas y debilidades */}
          <section className="grid gap-4 sm:grid-cols-2">
            <div className="card p-6">
              <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-navy dark:text-slate-100">
                <span aria-hidden>✅</span> Fortalezas
              </h3>
              <ul className="space-y-2">
                {team.strengths.map((s) => (
                  <li key={s} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <span aria-hidden className="text-pitch-500">▸</span> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-6">
              <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-navy dark:text-slate-100">
                <span aria-hidden>⚠️</span> Debilidades
              </h3>
              <ul className="space-y-2">
                {team.weaknesses.map((w) => (
                  <li key={w} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <span aria-hidden className="text-red-400">▸</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Análisis táctico + forma */}
          <section className="card p-6">
            <h2 className="section-title mb-3 text-xl">Análisis táctico</h2>
            <p className="text-slate-600 dark:text-slate-300">{team.style}</p>
            <div className="mt-5 border-t border-slate-100 pt-4 dark:border-white/5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Forma reciente (últimos 5)
              </p>
              <div className="flex items-center gap-4">
                <FormPips form={team.form} />
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Jugador clave:{" "}
                  <span className="font-semibold text-navy dark:text-slate-200">
                    {team.keyPlayer}
                  </span>{" "}
                  ({team.keyPlayerRole})
                </span>
              </div>
            </div>
          </section>

          <AdSlot slotName="seleccion-mid-rectangle" format="rectangle" />

          {/* Próximos partidos */}
          <section>
            <h2 className="section-title mb-4 text-xl">Próximos partidos</h2>
            {upcoming.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {upcoming.map((m) => (
                  <MatchCard key={m.slug} match={m} />
                ))}
              </div>
            ) : (
              <p className="card p-6 text-sm text-slate-500 dark:text-slate-400">
                No hay próximos partidos programados en el calendario cargado.{" "}
                <Link href="/partidos" className="data-link">Ver calendario</Link>.
              </p>
            )}
          </section>

          {/* FAQ */}
          <section className="card p-6">
            <h2 className="section-title mb-4 text-xl">Preguntas frecuentes</h2>
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {team.faqs.map((f) => (
                <details key={f.question} className="group py-3">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-navy dark:text-slate-100">
                    {f.question}
                    <span aria-hidden className="text-pitch-500 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <DisclaimerBox>{DISCLAIMER_BETTING}</DisclaimerBox>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {prediction && (
            <div>
              <h2 className="mb-3 font-display text-base font-bold text-navy dark:text-slate-100">
                Recorrido esperado
              </h2>
              <PredictionCard team={team} prediction={prediction} />
            </div>
          )}

          <div className="card p-5">
            <h2 className="mb-3 font-display text-base font-bold text-navy dark:text-slate-100">
              Rivales en el Grupo {team.group}
            </h2>
            <ul className="space-y-2">
              {rivals.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/selecciones/${r.slug}`}
                    className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5"
                  >
                    <span aria-hidden className="text-lg">{r.flag}</span>
                    <span className="text-navy dark:text-slate-100">{r.name}</span>
                    <span className="ml-auto text-xs text-slate-400">#{r.internalRank}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/tabla" className="mt-3 inline-block data-link text-sm">
              Ver la tabla del grupo →
            </Link>
          </div>

          <div className="lg:sticky lg:top-20">
            <AdSlot slotName="seleccion-sidebar" format="vertical" />
          </div>
        </aside>
      </div>
    </div>
  );
}
