import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getArticle,
  getArticlesWithDetail,
  getLatestArticles,
} from "@/data/articles";
import { formatDateLong } from "@/lib/utils";
import { siteConfig, DISCLAIMER_BETTING } from "@/lib/site";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";
import AdSlot from "@/components/AdSlot";
import ArticleCard from "@/components/ArticleCard";
import DisclaimerBox from "@/components/DisclaimerBox";
import TrendBadge from "@/components/TrendBadge";
import SeoJsonLd from "@/components/SeoJsonLd";

export function generateStaticParams() {
  return getArticlesWithDetail().map((a) => ({ slug: a.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const article = getArticle(params.slug);
  if (!article || article.href) return { title: "Artículo no encontrado" };
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/tendencias/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
    },
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug);
  if (!article || article.href) notFound();

  const related = getLatestArticles()
    .filter((a) => a.slug !== article.slug && !a.href)
    .slice(0, 3);

  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: article.title,
      description: article.excerpt,
      datePublished: article.date,
      dateModified: article.date,
      author: { "@type": "Organization", name: article.author },
      publisher: {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        url: siteConfig.url,
      },
      mainEntityOfPage: absoluteUrl(`/tendencias/${article.slug}`),
      url: absoluteUrl(`/tendencias/${article.slug}`),
      inLanguage: "es",
    },
    breadcrumbJsonLd([
      { name: "Inicio", path: "/" },
      { name: "Tendencias", path: "/tendencias" },
      { name: article.title, path: `/tendencias/${article.slug}` },
    ]),
  ];
  if (article.faqs.length > 0) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: article.faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }

  return (
    <div className="container-page pb-12">
      <SeoJsonLd data={jsonLd} />

      <nav aria-label="Migas de pan" className="pt-6 text-sm text-slate-500 dark:text-slate-400">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-pitch">Inicio</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/tendencias" className="hover:text-pitch">Tendencias</Link></li>
          <li aria-hidden>/</li>
          <li className="max-w-[60vw] truncate font-medium text-navy dark:text-slate-200">
            {article.title}
          </li>
        </ol>
      </nav>

      <article className="mx-auto mt-4 max-w-3xl">
        <header>
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip bg-navy-900 text-white dark:bg-white/10">
              {article.category}
            </span>
            {article.trend && <TrendBadge label={article.trend} />}
          </div>
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-navy dark:text-white sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-3 text-lg text-slate-500 dark:text-slate-400">
            {article.excerpt}
          </p>
          <div className="mt-4 flex items-center gap-3 text-sm text-slate-400">
            {article.authorSocial ? (
              <a
                href={article.authorSocial}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-pitch-600 hover:text-pitch-700 dark:text-pitch-400 dark:hover:text-pitch-300"
              >
                {article.author}
              </a>
            ) : (
              <span>{article.author}</span>
            )}
            <span aria-hidden>·</span>
            <span>{formatDateLong(article.date)}</span>
            <span aria-hidden>·</span>
            <span>{article.readingMinutes} min de lectura</span>
          </div>
          {article.subtitle && (
            <p className="mt-4 max-w-3xl text-xl font-semibold leading-snug text-navy dark:text-slate-200">
              {article.subtitle}
            </p>
          )}
        </header>

        {article.imageUrl && (
          <figure className="my-8 overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.imageUrl}
              alt={article.imageCaption || article.title}
              className="w-full object-cover"
            />
            {article.imageCaption && (
              <figcaption className="mt-2 text-center text-sm text-slate-400 italic">
                {article.imageCaption}
              </figcaption>
            )}
          </figure>
        )}

        <div className="space-y-8">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-2xl font-bold tracking-tight text-navy dark:text-slate-100">
                {section.heading}
              </h2>
              <div className="mt-3 text-[1.05rem] leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                {section.body}
              </div>
            </section>
          ))}
        </div>

        <div className="my-8">
          <AdSlot slotName="articulo-mid-rectangle" format="rectangle" />
        </div>

        {article.faqs.length > 0 && (
          <section className="card p-6">
            <h2 className="section-title mb-4 text-xl">Preguntas frecuentes</h2>
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {article.faqs.map((f) => (
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
        )}

        <DisclaimerBox className="mt-8">{DISCLAIMER_BETTING}</DisclaimerBox>
      </article>

      {related.length > 0 && (
        <section className="mx-auto mt-12 max-w-5xl">
          <h2 className="section-title mb-5 text-xl">Sigue leyendo</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
