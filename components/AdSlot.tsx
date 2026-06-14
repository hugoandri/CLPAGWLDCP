import { cn } from "@/lib/utils";

export type AdFormat =
  | "leaderboard" // banner ancho (cabecera / pie)
  | "horizontal" // banner responsive
  | "rectangle" // 300x250 in-feed
  | "in-feed" // entre tarjetas
  | "vertical"; // skyscraper lateral (desktop)

interface AdSlotProps {
  slotName: string;
  format?: AdFormat;
  className?: string;
}

const FORMAT_STYLES: Record<AdFormat, string> = {
  leaderboard: "min-h-[90px] sm:min-h-[100px]",
  horizontal: "min-h-[100px] sm:min-h-[120px]",
  rectangle: "min-h-[250px] max-w-[336px] mx-auto",
  "in-feed": "min-h-[120px]",
  vertical: "min-h-[600px] w-full max-w-[300px]",
};

/**
 * Hueco reservado para Google AdSense.
 *
 * En el MVP muestra un placeholder visual. Cuando tu cuenta esté aprobada:
 *
 * 1. Añade el script de AdSense una sola vez en app/layout.tsx (ver README).
 * 2. Sustituye el bloque "PLACEHOLDER" de abajo por el anuncio real, p. ej.:
 *
 *    "use client";
 *    import { useEffect } from "react";
 *    // ...
 *    useEffect(() => {
 *      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); }
 *      catch (e) {}
 *    }, []);
 *
 *    return (
 *      <ins
 *        className="adsbygoogle"
 *        style={{ display: "block" }}
 *        data-ad-client={siteConfig.adsenseClientId}
 *        data-ad-slot="TU_ID_DE_SLOT"
 *        data-ad-format="auto"
 *        data-full-width-responsive="true"
 *      />
 *    );
 */
export default function AdSlot({
  slotName,
  format = "horizontal",
  className,
}: AdSlotProps) {
  return (
    <aside
      aria-label="Espacio publicitario"
      className={cn(
        "flex w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-slate-300 bg-slate-100/70 px-4 py-4 text-center dark:border-white/15 dark:bg-white/[0.03]",
        FORMAT_STYLES[format],
        className,
      )}
    >
      {/* PLACEHOLDER — reemplazar por el <ins class="adsbygoogle" ...> real */}
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
        Publicidad
      </span>
      <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
        AdSense Slot: {slotName}
      </span>
      <span className="text-[11px] text-slate-400 dark:text-slate-500">
        Formato: {format}
      </span>
    </aside>
  );
}
