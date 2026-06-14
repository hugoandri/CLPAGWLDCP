"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { mainNav, siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label={`${siteConfig.name} — inicio`}>
      <span
        aria-hidden
        className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-pitch to-navy-900 text-lg shadow-sm"
      >
        ⚽
      </span>
      <span className="font-display text-lg font-extrabold leading-none tracking-tight text-navy dark:text-white">
        Data<span className="text-pitch">Goal</span>{" "}
        <span className="text-gold">2026</span>
      </span>
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Cierra el menú móvil al navegar.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-white/10 dark:bg-navy-950/85">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-3.5 py-2 text-sm font-semibold transition",
                isActive(item.href)
                  ? "bg-pitch/10 text-pitch-700 dark:bg-pitch/15 dark:text-pitch-300"
                  : "text-slate-600 hover:bg-slate-100 hover:text-navy dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Abrir menú"
            className="grid h-9 w-9 place-items-center rounded-full border border-slate-300 text-slate-600 lg:hidden dark:border-white/15 dark:text-slate-300"
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Navegación móvil */}
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Principal (móvil)"
          className="container-page grid gap-1 pb-4 lg:hidden"
        >
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-xl px-4 py-2.5 text-sm font-semibold transition",
                isActive(item.href)
                  ? "bg-pitch/10 text-pitch-700 dark:bg-pitch/15 dark:text-pitch-300"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
