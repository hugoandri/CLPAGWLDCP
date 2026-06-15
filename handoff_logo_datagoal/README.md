# Handoff: Logo DataGoal — Opción A "Trayectoria"

## Overview
Final logo for **DataGoal**, a football (soccer) results & statistics app. This package contains **only the approved direction — Concept A, "Trayectoria"**: a green ball (the goal) with a dotted amber trajectory arcing up toward a target — "data in motion / prediction." Designed minimal, app-icon-first, legible down to favicon size.

> Original mark — no third-party or licensed assets. Palette taken from the DataGoal app UI.

## Files
**Icon (symbol only)**
- `datagoal-icon.svg` — the icon, for dark/colored backgrounds (pentagon cut-out is the dark bg color `#0A0F14`).
- `datagoal-icon-on-light.svg` — same icon with a **white** pentagon cut-out, for use on white/light backgrounds.

**Wordmark (lettering only — "DataGoal")**
- `datagoal-wordmark-light.svg` — for white/light backgrounds ("Data" `#0A0F14`, "Goal" `#1E9C49`).
- `datagoal-wordmark-dark.svg` — for dark backgrounds, e.g. the app itself ("Data" `#EAF1ED`, "Goal" `#2FB85C`).

**Lockup (icon + wordmark together)**
- `datagoal-lockup-light.svg` — for white/light backgrounds.
- `datagoal-lockup-dark.svg` — for dark backgrounds (primary, matches the DataGoal app).

**Presentation**
- `Logo DataGoal — Opción A.dc.html` — presentation sheet (icon, lockup, favicon scale, app-tile & 1-tint applications). Open in a browser to inspect every value.

### ⚠ About the wordmark/lockup SVGs and the font
The wordmark is **Poppins Bold** kept as live `<text>` (with a Google Fonts `@import` embedded in the SVG), not converted to outlines. This means:
- ✅ Renders perfectly when the SVG is **opened directly in a browser** or **inlined into HTML** (the DataGoal app already loads Poppins, so inline use is ideal — copy the `<svg>…</svg>` markup straight into the page).
- ⚠️ When used as an `<img src>` or CSS `background-image`, browsers block the SVG's external font fetch and it falls back to a system font. For that case (or print/native apps), open the file in **Figma/Illustrator and "Convert/Outline text"** (one click) to bake the letters into vector paths — then it needs no font at all. I can't outline it here without degrading quality, so this last step is left to a vector editor.

## The mark — construction
Drawn on a **64×64** viewBox (`0 0 64 64`):
1. **Trajectory** — quadratic path `M16 49 Q39 43 51 15`, `stroke #F5A623`, `stroke-width 3.6`, `stroke-linecap round`, `stroke-dasharray "0.1 7.5"` (round dots). 
2. **Target dot** — `circle cx51 cy14 r4`, fill `#F5A623`, at the path's end.
3. **Ball** — `circle cx18 cy46 r12`, fill `#2FB85C`.
4. **Pentagon** — `polygon 18,40 23.5,44 21.5,50.5 14.5,50.5 12.5,44`, filled with the **background color** (knock-out), so the ball reads as a soccer ball. On dark → `#0A0F14`; on white → `#FFFFFF`; on the green 1-tint tile the whole icon is `brightness(0) invert(1)` (solid white).

Keep the icon's internal padding — it's centered with margin inside the 64-grid so it sits well in a rounded app tile.

## Color
| Token | Role | Hex |
|---|---|---|
| Green (primary) | Ball, brand, "Goal" in wordmark | `#2FB85C` |
| Amber (accent) | Trajectory + target dot | `#F5A623` |
| Ink (bg) | App background, pentagon knock-out on dark | `#0A0F14` |
| Surface | Panels / icon tiles | `#0E1620` / `#10171F` |
| Hairline | Borders | `#1E2A34` / `#243240` |
| Text | Primary text | `#EAF1ED` |
| Green (on white) | "Goal" when wordmark sits on light bg | `#1E9C49` |

Icon tile glow (optional, on dark): `box-shadow: 0 8px 24px rgba(47,184,92,.16)`.

## Wordmark & lockup
- **Wordmark:** "DataGoal" set in **Poppins 700**, `letter-spacing -0.5px`. "Data" in text color, "**Goal**" in green (`#2FB85C` on dark, `#1E9C49` on light).
- **Tagline (optional):** "ESTADÍSTICAS · MUNDIAL 2026" in **Space Grotesk**, ~9.5px, `letter-spacing 2.5px`, uppercase, muted (`#7C8A92`).
- **Horizontal lockup:** icon in a rounded tile (radius ≈ 17px at 64px) + gap 16px + wordmark. At 30px wordmark, use a 64px icon tile.
- **Clear space:** keep at least the ball's diameter (~⅓ of icon height) clear on all sides.

## App-icon tile
Rounded-square tile, corner radius ≈ 25% of size (e.g. 24px @ 96px). Dark tile `#0E1620` with `#243240` hairline, or green gradient `linear-gradient(145deg,#34C063,#1E8C44)` with the white (knock-out) icon.

## Minimum sizes & usage
- Verified legible at **16 / 24 / 40 / 64 px**. Don't go below 16px.
- On busy photos, place the icon on a solid tile, not directly on the image.
- Don't recolor the ball away from green, rotate the trajectory, or add effects/shadows to the glyph itself.

## Typography (fonts to load)
- **Poppins** (700 for wordmark; 400–800 available) — headings/brand.
- **Space Grotesk** (400/500/700) — taglines, mono-ish labels, UI accents.
Both from Google Fonts.

## Implementation notes
- Use `datagoal-icon.svg` for the favicon and dark UI; `datagoal-icon-on-light.svg` on white. For a single-tint/monochrome context, render the icon solid white via `filter: brightness(0) invert(1)` (or recolor all fills to one color and drop the knock-out).
- SVG is resolution-independent — no PNG export needed, but if you need PNGs (e.g. iOS app icon), rasterize at 16/32/48/180/512/1024 from the SVG with the appropriate background filled (icons here are transparent except the knock-out pentagon, which must match the tile).
