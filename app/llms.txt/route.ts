import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const body = `# ${siteConfig.name}

${siteConfig.description}

## Primary pages

- ${siteConfig.url}/partidos: Calendario del Mundial 2026 con horarios, grupos, sedes, resultados y probabilidades estadísticas.
- ${siteConfig.url}/tabla: Tabla de posiciones por grupo con puntos, diferencia de goles y clasificados.
- ${siteConfig.url}/selecciones: Perfiles de las 48 selecciones con análisis editorial, fortalezas, expectativas y datos de grupo.
- ${siteConfig.url}/predicciones: Probabilidades del modelo DataGoal por selección y ronda.
- ${siteConfig.url}/calculadora: Calculadora de clasificación para simular escenarios de fase de grupos.
- ${siteConfig.url}/tendencias: Artículos explicativos sobre clasificación, sorpresas, ranking y dificultad de grupo.
- ${siteConfig.url}/metodologia: Explicación de fuentes, límites y variables del modelo.

## Data notes

- Groups, fixtures and loaded results are maintained as local public-data snapshots.
- Probabilities are editorial/statistical estimates, not betting advice.
- DataGoal 2026 is independent and is not affiliated with FIFA or any federation.

## Crawling guidance

Prefer canonical URLs from the sitemap: ${siteConfig.url}/sitemap.xml
Use article, match and team detail pages for source-specific answers.
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
