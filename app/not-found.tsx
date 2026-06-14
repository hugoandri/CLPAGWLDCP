import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span aria-hidden className="text-6xl">⚽</span>
      <p className="stat-num mt-6 font-display text-6xl font-extrabold text-pitch">404</p>
      <h1 className="mt-2 font-display text-2xl font-bold text-navy dark:text-slate-100">
        Página fuera de juego
      </h1>
      <p className="mt-3 max-w-md text-slate-500 dark:text-slate-400">
        No encontramos lo que buscabas. Quizá el partido cambió de campo. Vuelve
        al inicio o explora los datos del Mundial 2026.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          Volver al inicio
        </Link>
        <Link href="/partidos" className="btn-ghost">
          Ver partidos
        </Link>
      </div>
    </div>
  );
}
