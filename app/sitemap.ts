import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { matches } from "@/data/matches";
import { teams } from "@/data/teams";
import { getArticlesWithDetail } from "@/data/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes = [
    "",
    "/partidos",
    "/tabla",
    "/predicciones",
    "/selecciones",
    "/tendencias",
    "/calculadora",
    "/metodologia",
    "/privacidad",
    "/contacto",
    "/sobre-nosotros",
    "/eliminatorias",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const matchRoutes = matches.map((m) => ({
    url: `${base}/partidos/${m.slug}`,
    lastModified: now,
    changeFrequency: "hourly" as const,
    priority: 0.7,
  }));

  const teamRoutes = teams.map((t) => ({
    url: `${base}/selecciones/${t.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const articleRoutes = getArticlesWithDetail().map((a) => ({
    url: `${base}/tendencias/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...matchRoutes, ...teamRoutes, ...articleRoutes];
}
