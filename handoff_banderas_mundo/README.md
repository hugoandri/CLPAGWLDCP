# Handoff: Explorador de Banderas del Mundo

## Overview
An interactive **world flags explorer** ("atlas/encyclopedia" style). Users browse 231 flags (sovereign countries + partially-recognized states + dependent territories + the UK home nations), **search** by name / capital / alias, **filter** by continent, **sort**, switch **grid/list** views, and open any entry in a **detail modal** (capital, population, continent, ISO code).

The visual language is intentionally **neutral and editorial** so the flags themselves provide all the color: warm off-white paper, ink-navy text, a single ocean-blue accent, serif display + clean sans for data.

> **Note on data scope:** "Countries" here is deliberately broad — it includes the 193 UN members **plus** Vatican, Kosovo, Taiwan and Palestine, **plus** 30 dependent territories (Greenland, Puerto Rico, Hong Kong, Gibraltar, …), **plus** the 4 UK constituent nations (England, Scotland, Wales, Northern Ireland). Adjust the dataset if your product needs a stricter "sovereign only" list — a single `r` (region) field controls grouping.

## About the Design File
The file in this bundle (`Banderas del Mundo.dc.html`) is a **functional design reference built in HTML** — it is a real, working prototype of the experience and the source of truth for layout, tokens, data shape, and interactions. It is **not necessarily the production artifact**: recreate it in your codebase's environment (React/Vue/Svelte + your styling system), reusing the patterns below.

Format note: it is a "Design Component" — markup uses **inline styles** and a small render-data class (`renderVals()` returns the template's inputs; `<sc-for>`/`<sc-if>` are its loop/conditional primitives). Read it for exact values; don't transplant the `x-dc` runtime itself.

## Fidelity
**High-fidelity.** Colors, type, spacing, and component states are final. Recreate faithfully.

---

## Data Model
Each entry is a flat object:
```js
{
  n:   'España',        // display name (Spanish)
  c:   'es',            // ISO 3166-1 alpha-2 (lowercase) — also used to build the flag URL
  r:   'Europa',        // region/group: África | América | Asia | Europa | Oceanía | Territorios
  cap: 'Madrid',        // capital
  p:   47000000,        // population (approx, integer)
  alt: 'Holanda'        // OPTIONAL space-separated search aliases (alternate names)
}
```
- **Subdivision codes:** UK nations use flagcdn subdivision codes as `c`: `gb-eng`, `gb-sct`, `gb-wls`, `gb-nir`.
- The full array (231 entries, grouped by region with comments) lives in the logic class as `this.ALL`. Lift it into your own data file / API.

### Flag images
Flags are loaded from the **flagcdn.com** public CDN (no key, requires network):
- Grid / list thumbnail: `https://flagcdn.com/w320/${c}.png`
- Modal (larger): `https://flagcdn.com/w640/${c}.png`

`c` is lowercased ISO alpha-2 (or the subdivision code). Use `loading="lazy"` on thumbnails (231 images). If you need offline/self-hosted assets, mirror flagcdn or swap to your own flag set keyed by the same codes. (No official/branded assets are bundled here.)

---

## Design Tokens

### Color
| Token | Role | Hex |
|---|---|---|
| Paper | Page background | `#F6F3EC` |
| Ink | Primary text, active chip bg | `#1C2530` |
| Ink-soft | Body / secondary text | `#5A6472` |
| Ink-muted | Tertiary text, labels | `#7C8696` / `#8A93A0` |
| Faint | Placeholder, micro codes | `#98A0AD` / `#A7AEB9` |
| Accent (ocean) | Kickers, links, hover border, active focus | `#1F6189` |
| Card | Card surface | `#FFFFFF` |
| Hairline | Borders / dividers (warm) | `#E6E0D2` / `#E0D9C8` / `#ECE6D8` |
| Flag well | Image placeholder bg behind flags | `#EEEADF` |
| Modal scrim | Backdrop | `rgba(20,27,38,.55)` + `backdrop-filter: blur(3px)` |

### Typography
Google Fonts: **Newsreader** (serif display) + **Libre Franklin** (sans, UI/data).
- **Newsreader** — page title (52px/600, letter-spacing -0.5px), card/country names (16.5–17px/600), modal title (30px/600).
- **Libre Franklin** — all UI, controls, body (17px), labels, data. Weights 400/500/600/700.
- Use `font-variant-numeric: tabular-nums` for population figures.
- Micro labels: 11px, weight 600–700, `letter-spacing` ~0.5–2px, UPPERCASE.

### Spacing / radius / shadow
- Radius: 4 (small flag thumb) · 10 (controls, list rows) · 12 (cards) · 16 (modal) · 999 (chips).
- Borders: 1px hairlines.
- Card hover shadow: `0 12px 26px rgba(28,37,48,.15)`; list hover `0 6px 16px rgba(28,37,48,.10)`; modal `0 30px 70px rgba(20,27,38,.4)`.
- Section max-width: 1160px; list view capped at 840px for readability.

---

## Components & Layout

### Header
Kicker (accent caps + 22px rule) · H1 (Newsreader 52px) · lead paragraph (ink-soft 17px).

### Controls bar (sticky)
`position:sticky; top:0; z-index:20;` translucent paper bg + `backdrop-filter: blur(8px)` + bottom hairline. Contains:
- **Search input** with inline magnifier SVG (left, 16px, stroke `#98A0AD`). Uncontrolled — read `e.target.value` on `input`, push to `query` state. Matches against name **and** capital **and** `alt` aliases (case-insensitive).
- **Sort `<select>`**: `az` (A→Z), `za` (Z→A), `pop-desc`, `pop-asc`. Name sorts use `localeCompare(…, 'es')` so accents order correctly.
- **View toggle**: two icon buttons (grid / list) in a segmented control; active button bg = ink `#1C2530`, icon fill white; inactive icon `#98A0AD`.
- **Region chips** (pill row): `Todos` + the 6 regions, each with a live count. Active chip: bg ink, white text, ink border. Inactive: white bg, `#5A6472` text, `#E0D9C8` border.

### Result count
Small muted line above the grid: `"{N} países"` (singular "país" when 1).

### Grid card
`repeat(auto-fill, minmax(190px, 1fr))`, gap 16. Card: white, 1px `#E6E0D2`, radius 12, overflow hidden. Flag = `aspect-ratio: 3/2; object-fit: cover` with a `#EEEADF` well + bottom hairline. Body: name (Newsreader 17/600) + row of capital (12.5px ink-soft, ellipsis) and ISO code (10px/700, letter-spacing 1px, faint). **Hover:** `translateY(-3px)`, accent border `#1F6189`, lifted shadow. Whole card is clickable → opens modal.

### List row
Max-width 840, gap 8. Flex row: 56×37 flag thumb (radius 4, hairline) · name + capital block · region label (uppercase, faint, right-aligned 88px) · population (tabular-nums, 104px right). Hover: accent border + soft shadow.

### Detail modal
Fixed scrim (click to close) + centered panel (max-width 440, radius 16). Round close button top-right (`rgba(20,27,38,.55)`). Large flag (3/2) on top. Body: region kicker (accent caps) · name (Newsreader 30) · 2×2 fact grid (Capital · Población · Continente · Código ISO) built as white cells over a `#ECE6D8` 1px gap. Animations: scrim `fadeIn .15s`, panel `popIn .22s cubic-bezier(.2,.8,.2,1)`. Stop propagation on the panel so inner clicks don't close it.

### Empty state
When no matches: centered Newsreader 24 "Sin resultados" + muted hint.

---

## State & Behavior
State: `{ query, region ('Todos' default), sort ('az'), view ('grid'|'list'), selected (entry|null) }`.
Derived per render: filtered+sorted list → mapped to display objects carrying precomputed `flag`/`flagBig` URLs, `code` (uppercased), `pFmt` (`toLocaleString('es-ES')`), and an `open()` handler. Region chips carry live counts and their active styling. Everything recomputes from the four state fields — no external store needed for this scope.

## Localization
All names, capitals, region labels and UI copy are **Spanish**. Population formatting uses `es-ES` grouping (e.g. `47.000.000`). To localize, translate `n`/`cap`/region labels and swap the `toLocaleString` locale.

## Assets
- **Fonts:** Newsreader, Libre Franklin (Google Fonts).
- **Flags:** flagcdn.com (external CDN, keyed by ISO alpha-2 / subdivision code). Not bundled.
- **Icons:** inline SVG only (magnifier, grid, list). No icon library.

## Files
- `Banderas del Mundo.dc.html` — the working design reference (open in a browser to inspect every value, the full 231-entry dataset, and all interactions).
