import Link from "next/link";
import { footerNav, siteConfig, DISCLAIMER_SHORT } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white dark:border-white/10 dark:bg-navy-950">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-pitch to-navy-900"
              >
                <svg viewBox="0 0 64 64" width="22" height="22" fill="none">
                  <path d="M16 49 Q39 43 51 15" stroke="#F5A623" strokeWidth="3.6" strokeLinecap="round" strokeDasharray="0.1 7.5" />
                  <circle cx="51" cy="14" r="4" fill="#F5A623" />
                  <circle cx="18" cy="46" r="12" fill="#2FB85C" />
                  <polygon points="18,40 23.5,44 21.5,50.5 14.5,50.5 12.5,44" fill="#0A0F14" />
                </svg>
              </span>
              <span className="font-brand text-lg tracking-tight text-[#0A0F14] dark:text-[#EAF1ED]">
                Data<span className="text-[#1E9C49] dark:text-[#2FB85C]">Goal</span>{" "}
                <span className="text-gold">Lab</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-slate-500 dark:text-slate-400">
              {siteConfig.slogan} Análisis estadístico, tablas, predicciones y
              herramientas del Mundial 2026.
            </p>
          </div>

          {footerNav.map((col) => (
            <div key={col.title}>
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-navy dark:text-slate-200">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 transition hover:text-pitch dark:text-slate-400 dark:hover:text-pitch-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400">
          {DISCLAIMER_SHORT} Las predicciones son estimaciones estadísticas y no
          constituyen consejo de apuestas ni garantizan resultado alguno.
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-2 text-xs text-slate-400 sm:flex-row">
          <p>
            © {year} {siteConfig.name}. Sitio independiente con datos
            ilustrativos.
          </p>
          <p>Hecho con datos, no con marketing de apuestas.</p>
        </div>
      </div>
    </footer>
  );
}
