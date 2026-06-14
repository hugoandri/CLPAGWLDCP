"use client";

import { useState } from "react";

/**
 * Formulario de contacto visual. En el MVP no envía datos:
 * al enviar muestra una confirmación de demostración.
 * Para hacerlo funcional, conecta el onSubmit a un endpoint/API o a un
 * servicio como Formspree, Resend o una API route en /app/api.
 */
export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="card p-8 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-pitch/10 text-2xl">
          ✅
        </div>
        <h2 className="mt-4 font-display text-xl font-bold text-navy dark:text-slate-100">
          ¡Mensaje listo!
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Esta es una demostración: el formulario aún no envía datos. Conecta un
          endpoint para activarlo (ver instrucciones en el código).
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="btn-ghost mt-5"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-6">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-navy dark:text-slate-200">
          Nombre
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Tu nombre"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-navy placeholder:text-slate-400 focus:border-pitch dark:border-white/15 dark:bg-navy-900 dark:text-slate-100"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-navy dark:text-slate-200">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="tu@email.com"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-navy placeholder:text-slate-400 focus:border-pitch dark:border-white/15 dark:bg-navy-900 dark:text-slate-100"
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-navy dark:text-slate-200">
          Mensaje
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="¿En qué podemos ayudarte?"
          className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-navy placeholder:text-slate-400 focus:border-pitch dark:border-white/15 dark:bg-navy-900 dark:text-slate-100"
        />
      </div>

      <button type="submit" className="btn-primary w-full">
        Enviar mensaje
      </button>
      <p className="text-center text-xs text-slate-400">
        Demo: el formulario no envía datos todavía.
      </p>
    </form>
  );
}
