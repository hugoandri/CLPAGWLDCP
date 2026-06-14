import Link from "next/link";
import type { Article } from "@/lib/types";
import { cn, formatDateShort } from "@/lib/utils";
import TrendBadge from "@/components/TrendBadge";

interface ArticleCardProps {
  article: Article;
  className?: string;
}

/** Tarjeta de artículo para /tendencias y bloques de "últimos análisis". */
export default function ArticleCard({ article, className }: ArticleCardProps) {
  const href = article.href ?? `/tendencias/${article.slug}`;
  const isTool = Boolean(article.href);

  return (
    <Link
      href={href}
      className={cn("card card-hover group flex flex-col p-5", className)}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="chip bg-navy-900 text-white dark:bg-white/10">
          {article.category}
        </span>
        {article.trend && <TrendBadge label={article.trend} />}
      </div>

      <h3 className="mt-3 font-display text-lg font-bold leading-snug text-navy group-hover:text-pitch dark:text-slate-100 dark:group-hover:text-pitch-300">
        {article.title}
      </h3>

      <p className="mt-2 line-clamp-3 flex-1 text-sm text-slate-500 dark:text-slate-400">
        {article.excerpt}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400 dark:border-white/5">
        <span>{formatDateShort(article.date)}</span>
        <span className="inline-flex items-center gap-1.5 font-semibold text-pitch-600 dark:text-pitch-300">
          {isTool ? "Abrir herramienta" : `${article.readingMinutes} min de lectura`}
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
