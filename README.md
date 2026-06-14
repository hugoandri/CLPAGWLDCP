# DataGoal 2026 ⚽📊

Portal **independiente de análisis estadístico** del Mundial 2026: partidos,
tabla por grupos, predicciones, calculadora de clasificación, perfiles de
selecciones y artículos de tendencias. Pensado para captar tráfico orgánico
(Google, Discover, redes) y monetizarse con **Google AdSense**.

> **No es un sitio de apuestas.** Todo el contenido es informativo y
> estadístico, no constituye consejo de apuestas ni promete resultados.

---

## ✨ Características

- **12 páginas** + rutas dinámicas de partidos, selecciones y artículos.
- **Next.js 14 (App Router) + TypeScript + TailwindCSS**, sin librerías pesadas.
- Diseño **responsive mobile-first** con **modo oscuro** y estética tipo
  cuadro de mando deportivo (verde césped · azul medianoche · dorado).
- **Visualización de datos** con CSS/SVG: barras de probabilidad, comparativas
  head-to-head, gráficos de fortalezas.
- **Calculadora de clasificación interactiva** (recalcula la tabla en vivo).
- **SEO avanzado**: metadatos por página, Open Graph, Twitter Cards, JSON-LD
  (`WebSite`, `Article`, `FAQPage`, `SportsEvent`, `SportsTeam`), `sitemap.xml`,
  `robots.txt` e imagen OG generada dinámicamente.
- **Bloques de AdSense** como placeholders, listos para sustituir.
- **Snapshots locales** en `/data`: grupos, calendario y resultados actuales,
  con tipos preparados para conectar una API en tiempo real.

---

## 🚀 Puesta en marcha

Requisitos: **Node.js 18.17+** (recomendado 20+).

```bash
# 1. Instalar dependencias
npm install

# 2. Entorno de desarrollo (http://localhost:3000)
npm run dev

# 3. Build de producción
npm run build

# 4. Servir el build
npm run start
```

---

## 🗂️ Estructura del proyecto

```
datagoal-2026/
├── app/                       # Rutas (App Router)
│   ├── layout.tsx             # Shell, fuentes, metadatos globales, JSON-LD WebSite
│   ├── page.tsx               # Home
│   ├── partidos/              # Lista (+ filtros) y detalle [slug]
│   ├── tabla/                 # Tabla por grupos + filtro
│   ├── predicciones/          # Ranking por ronda + metodología
│   ├── selecciones/           # Listado (+ buscador) y detalle [slug]
│   ├── tendencias/            # Artículos (+ filtro) y detalle [slug]
│   ├── calculadora/           # Herramienta interactiva
│   ├── metodologia/ privacidad/ contacto/
│   ├── sitemap.ts robots.ts   # SEO técnico
│   ├── icon.tsx opengraph-image.tsx  # Favicon e imagen OG dinámicas
│   └── not-found.tsx
├── components/                # 15+ componentes reutilizables (Header, Footer,
│                              # AdSlot, MatchCard, MatchTable, TeamCard,
│                              # PredictionCard, StatBar, GroupTable, ArticleCard,
│                              # TrendBadge, SearchInput, FilterTabs, SeoJsonLd,
│                              # DisclaimerBox, ProbBar, StatusBadge, ThemeToggle…)
├── data/                      # Snapshots y modelo: teams, matches, groups, predictions, articles
├── lib/                       # types.ts, utils.ts, site.ts (config central)
└── tailwind.config.ts globals.css …
```

---

## 🔌 Cómo reemplazar snapshots locales por una API real

Toda la app consume los datos a través de los archivos de `/data` y sus
funciones de acceso (`getTeam`, `getMatch`, `getPrediction`, etc.). **La
interfaz no conoce el origen de los datos**, así que solo hay que cambiar la capa
de datos.

**Opción A — Reemplazar el contenido de `/data`:** mantén las mismas funciones
exportadas (`getTeam`, `getMatchesByTeam`, …) pero haz que devuelvan datos de tu
API en lugar de los arrays locales.

**Opción B (recomendada) — Capa de fetch + Server Components:** crea
`lib/api.ts` con funciones `async` que llamen a tu proveedor y úsalas en los
Server Components (la mayoría de páginas ya lo son):

```ts
// lib/api.ts
import type { Match } from "@/lib/types";

export async function fetchMatches(): Promise<Match[]> {
  const res = await fetch("https://tu-api.com/v1/matches", {
    headers: { Authorization: `Bearer ${process.env.FOOTBALL_API_KEY}` },
    next: { revalidate: 60 }, // ISR: cachea 60s
  });
  if (!res.ok) throw new Error("Error al cargar partidos");
  return res.json(); // mapea aquí al tipo Match si la forma difiere
}
```

```tsx
// app/partidos/page.tsx (ejemplo)
const matches = await fetchMatches(); // en vez de importar el snapshot local
```

Pasos clave:

1. Guarda las claves en `.env.local` (`FOOTBALL_API_KEY=…`).
2. Mapea la respuesta de la API a los **tipos** de `lib/types.ts` (ya están
   pensados para mapear 1:1 con una API de fútbol).
3. Usa `next: { revalidate }` para datos en vivo (marcadores, tabla) y caché
   más larga para perfiles de selección.
4. Si usas imágenes reales (escudos/fotos), añade el dominio en
   `next.config.mjs → images.remotePatterns` y usa `next/image`.

> El modelo de predicciones (`data/predictions.ts`) se calcula de forma
> determinista a partir de los datos. Puedes sustituirlo por una simulación
> Monte Carlo o por cuotas externas manteniendo el tipo `Prediction`.

---

## 🤖 Agente Groq para resultados y notas

El proyecto incluye un pipeline opcional para leer páginas deportivas públicas,
normalizar resultados con Groq y generar notas breves de desempeño por equipo.

Archivos clave:

- `config/sports-agent.json`: URLs fuente, modelo y umbral de confianza.
- `prompts/sports-update.md`: reglas editoriales y schema JSON exigido a Groq.
- `scripts/sports-update.mjs`: scraper + llamada Groq + validación.
- `data/live-updates.json`: overrides de resultados aplicados a `data/matches.ts`.
- `data/team-notes.json`: notas mostradas en páginas de selección.
- `data/ai-updates/`: borradores generados para auditoría.

Uso:

```bash
# 1. Validar configuración local sin red ni API
npm run sports:update:check

# 2. Añadir URLs públicas en config/sports-agent.json
# "sources": ["https://...", "https://..."]

# 3. Configurar la clave sin commitearla
export GROQ_API_KEY="gsk_..."

# 4. Generar borrador, sin tocar datos usados por la app
npm run sports:update

# 5. Aplicar solo cambios validados por schema y confidence
npm run sports:update:apply
```

Reglas de seguridad:

- Groq no decide por sí solo qué publicar: el script filtra slugs, estados,
  marcadores, minutos, URLs de evidencia y `minimumConfidence`.
- La tabla se recalcula automáticamente desde partidos terminados; la IA solo
  propone overrides en `data/live-updates.json`.
- Las notas requieren evidencia y se muestran como “Nota actualizada por IA”.
- Usa solo fuentes que permitan consulta automatizada y evita páginas con paywall
  o bloqueo explícito de scraping.

---

## 💰 Cómo insertar Google AdSense (cuando te aprueben)

Los anuncios están representados por el componente **`components/AdSlot.tsx`**,
que hoy muestra un placeholder `AdSense Slot: [slotName]`. Para activarlos:

**1. Añade tu ID de editor** en `lib/site.ts`:

```ts
adsenseClientId: "ca-pub-XXXXXXXXXXXXXXXX",
```

**2. Carga el script de AdSense una sola vez** en `app/layout.tsx` (dentro del
`<head>` o con `next/script`):

```tsx
import Script from "next/script";
// …dentro del componente, antes de </body> o en <head>:
<Script
  async
  src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.adsenseClientId}`}
  crossOrigin="anonymous"
  strategy="afterInteractive"
/>
```

**3. Sustituye el placeholder** dentro de `AdSlot.tsx` por el anuncio real
(el archivo incluye el snippet comentado). Tendrás que convertirlo en Client
Component para ejecutar el `push`:

```tsx
"use client";
import { useEffect } from "react";

useEffect(() => {
  try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch {}
}, []);

return (
  <ins
    className="adsbygoogle"
    style={{ display: "block" }}
    data-ad-client={siteConfig.adsenseClientId}
    data-ad-slot="TU_ID_DE_SLOT"      // uno por cada posición
    data-ad-format="auto"
    data-full-width-responsive="true"
  />
);
```

**Posiciones ya colocadas** (`slotName`): banner superior, in-feed entre
tarjetas, lateral (desktop) e inferior, además de banners en cada página y
rectángulos en los detalles. Mapea cada `slotName` a un ID de bloque de AdSense.

> Para la aprobación de AdSense ayuda tener contenido original, las páginas de
> **Privacidad**, **Contacto** y **Metodología** (ya incluidas) y un dominio
> propio. Revisa la política de privacidad antes de publicar.

---

## 🔍 SEO

- Cambia `siteConfig.url` en `lib/site.ts` por tu dominio real **antes de
  publicar** (afecta a canónicas, sitemap, robots y Open Graph).
- Títulos y descripciones optimizados para búsquedas como *“Mundial 2026
  partidos de hoy”, “tabla Mundial 2026”, “predicciones Mundial 2026”, “qué
  necesita [selección] para clasificar”* y *“calculadora Mundial 2026”*.
- `sitemap.xml` y `robots.txt` se generan automáticamente desde los datos.

---

## 🎨 Personalización

- **Colores y tipografías**: `tailwind.config.ts` (paleta `pitch` / `navy` /
  `gold`) y `app/layout.tsx` (fuentes Space Grotesk + Manrope).
- **Navegación, textos legales y disclaimers**: `lib/site.ts`.

---

## ⚠️ Aviso

DataGoal 2026 es un sitio independiente de análisis estadístico. **No está
afiliado a FIFA ni a ninguna federación.** Grupos, calendario y resultados se
cargan desde snapshots locales; las probabilidades son estimaciones del modelo.
No se utilizan logos ni imágenes con copyright.
```
