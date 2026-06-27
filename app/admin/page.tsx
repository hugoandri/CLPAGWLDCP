"use client";

import { useState, useEffect } from "react";

interface ArticleForm {
  title: string;
  category: string;
  date: string;
  excerpt: string;
  author: string;
  authorSocial: string;
  imageUrl: string;
  imageCaption: string;
  sections: { heading: string; body: string }[];
  faqs: { question: string; answer: string }[];
}

const CATEGORIES = ["Análisis", "Tendencias", "Datos", "Clasificación", "Herramienta"];
const DRAFTS_KEY = "datagoal-admin-drafts";

const emptyForm = (): ArticleForm => ({
  title: "",
  category: "Análisis",
  date: new Date().toISOString().slice(0, 10),
  excerpt: "",
  author: "",
  authorSocial: "",
  imageUrl: "",
  imageCaption: "",
  sections: [{ heading: "", body: "" }],
  faqs: [],
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [storedPw, setStoredPw] = useState("");
  const [form, setForm] = useState<ArticleForm>(emptyForm());
  const [drafts, setDrafts] = useState<ArticleForm[]>([]);
  const [published, setPublished] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFTS_KEY);
      if (saved) setDrafts(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const saveDraft = () => {
    const updated = [...drafts.filter((d) => d.title !== form.title), form];
    setDrafts(updated);
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(updated));
    alert("Borrador guardado");
  };

  const loadDraft = (d: ArticleForm) => {
    setForm(d);
  };

  const deleteDraft = (title: string) => {
    const updated = drafts.filter((d) => d.title !== title);
    setDrafts(updated);
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(updated));
  };

  const addSection = () => {
    setForm({ ...form, sections: [...form.sections, { heading: "", body: "" }] });
  };

  const updateSection = (i: number, field: "heading" | "body", value: string) => {
    const s = [...form.sections];
    s[i] = { ...s[i], [field]: value };
    setForm({ ...form, sections: s });
  };

  const removeSection = (i: number) => {
    setForm({ ...form, sections: form.sections.filter((_, idx) => idx !== i) });
  };

  const addFaq = () => {
    setForm({ ...form, faqs: [...form.faqs, { question: "", answer: "" }] });
  };

  const updateFaq = (i: number, field: "question" | "answer", value: string) => {
    const f = [...form.faqs];
    f[i] = { ...f[i], [field]: value };
    setForm({ ...form, faqs: f });
  };

  const removeFaq = (i: number) => {
    setForm({ ...form, faqs: form.faqs.filter((_, idx) => idx !== i) });
  };

  const generateCode = (): string => {
    const slug = slugify(form.title);
    const sections = form.sections
      .filter((s) => s.body)
      .map((s) => {
        const h = s.heading || "Análisis";
        return `      { heading: "${h}", body: "${s.body.replace(/"/g, '\\"')}" }`;
      })
      .join(",\n");
    const faqs = form.faqs
      .filter((f) => f.question && f.answer)
      .map((f) => `      { question: "${f.question}", answer: "${f.answer.replace(/"/g, '\\"')}" }`)
      .join(",\n");

    const authorLine = form.author ? `"${form.author}"` : '"Redacción DataGoal"';
    const socialLine = form.authorSocial ? `    authorSocial: "${form.authorSocial}",` : '';
    const imageLine = form.imageUrl ? `    imageUrl: "${form.imageUrl}",\n    imageCaption: "${form.imageCaption || ''}",` : '';
    return `  {
    slug: "${slug}",
    title: "${form.title}",
    category: "${form.category}" as const,
    date: "${form.date}",
    readingMinutes: Math.ceil((${form.sections.filter(s => s.body).reduce((a, s) => a + s.body.split(' ').length, 0)} / 200) + 1),
    excerpt: "${form.excerpt}",
    author: ${authorLine},
    ${socialLine}
    ${imageLine}
    trend: "${form.category}",
    sections: [\n${sections}\n    ],
    faqs: [\n${faqs}\n    ],
  },`;
  };

  const publish = async () => {
    setPublishing(true);
    setPublished(null);
    try {
      const res = await fetch("/api/admin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: storedPw },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setPublished(`Artículo publicado. ${data.commitUrl ? `Commit: ${data.commitUrl}` : ""}`);
        setForm(emptyForm());
      } else {
        setPublished(`Error: ${data.error}. Código generado abajo para copiar manualmente.`);
      }
    } catch {
      setPublished("Error de conexión. Código generado abajo para copiar manualmente.");
    }
    setPublishing(false);
  };

  if (!authed) {
    return (
      <div className="container-page flex min-h-[50vh] items-center justify-center pb-12">
        <div className="card max-w-sm p-8 text-center">
          <h1 className="font-display text-2xl font-bold text-navy dark:text-slate-100">
            Admin DataGoal
          </h1>
          <p className="mt-2 text-sm text-slate-500">Ingresa la contraseña</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-white/20 dark:bg-navy-900"
            placeholder="Contraseña"
          />
          <button
            onClick={() => {
              const check = async () => {
                const res = await fetch("/api/admin/check", { headers: { Authorization: password } });
                if (res.ok) { setAuthed(true); setStoredPw(password); }
                else alert("Contraseña incorrecta");
              };
              check();
            }}
            className="btn-primary mt-4 w-full"
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  const code = generateCode();

  return (
    <div className="container-page pb-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-navy dark:text-slate-100">
            Admin DataGoal
          </h1>
          <p className="text-sm text-slate-500">Publica nuevos artículos editoriales</p>
        </div>
        <button
          onClick={() => setAuthed(false)}
          className="text-sm text-slate-400 hover:text-red-500"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <section className="card p-6">
            <h2 className="section-title mb-4 text-xl">Nuevo artículo</h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Título</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-white/20 dark:bg-navy-900"
                  placeholder="Título del artículo"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Categoría</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-white/20 dark:bg-navy-900"
                  >
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Fecha</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-white/20 dark:bg-navy-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Autor</label>
                  <input
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-white/20 dark:bg-navy-900"
                    placeholder="Ej: Juan Pérez"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Red social del autor</label>
                  <input
                    value={form.authorSocial}
                    onChange={(e) => setForm({ ...form, authorSocial: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-white/20 dark:bg-navy-900"
                    placeholder="https://twitter.com/usuario"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">URL de la imagen</label>
                <input
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-white/20 dark:bg-navy-900"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pie de foto</label>
                <input
                  value={form.imageCaption}
                  onChange={(e) => setForm({ ...form, imageCaption: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-white/20 dark:bg-navy-900"
                  placeholder="Descripción de la imagen"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Extracto (meta description)</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-white/20 dark:bg-navy-900"
                  rows={3}
                  placeholder="Resumen del artículo"
                />
              </div>
            </div>
          </section>

          <section className="card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="section-title text-xl">Secciones</h2>
              <button onClick={addSection} className="btn-ghost text-xs">
                + Agregar sección
              </button>
            </div>
            <div className="space-y-4">
              {form.sections.map((s, i) => (
                <div key={i} className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase text-slate-400">Sección {i + 1}</span>
                    {form.sections.length > 1 && (
                      <button onClick={() => removeSection(i)} className="text-xs text-red-400 hover:text-red-500">
                        Eliminar
                      </button>
                    )}
                  </div>
                  <input
                    value={s.heading}
                    onChange={(e) => updateSection(i, "heading", e.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold dark:border-white/20 dark:bg-navy-900"
                    placeholder="Título (opcional — se usará 'Análisis' si se deja vacío)"
                  />
                  <textarea
                    value={s.body}
                    onChange={(e) => updateSection(i, "body", e.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-white/20 dark:bg-navy-900"
                    rows={10}
                    placeholder="Contenido de la sección (el heading es opcional)"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="section-title text-xl">Preguntas Frecuentes</h2>
              <button onClick={addFaq} className="btn-ghost text-xs">
                + Agregar FAQ
              </button>
            </div>
            <div className="space-y-4">
              {form.faqs.map((f, i) => (
                <div key={i} className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase text-slate-400">FAQ {i + 1}</span>
                    <button onClick={() => removeFaq(i)} className="text-xs text-red-400 hover:text-red-500">
                      Eliminar
                    </button>
                  </div>
                  <input
                    value={f.question}
                    onChange={(e) => updateFaq(i, "question", e.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold dark:border-white/20 dark:bg-navy-900"
                    placeholder="Pregunta"
                  />
                  <textarea
                    value={f.answer}
                    onChange={(e) => updateFaq(i, "answer", e.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-white/20 dark:bg-navy-900"
                    rows={2}
                    placeholder="Respuesta"
                  />
                </div>
              ))}
            </div>
          </section>

          <div className="flex gap-3">
            <button onClick={saveDraft} className="btn-ghost">
              💾 Guardar borrador
            </button>
            <button onClick={publish} disabled={publishing || !form.title} className="btn-primary">
              {publishing ? "Publicando..." : "📢 Publicar artículo"}
            </button>
          </div>

          {published && (
            <div className="rounded-xl bg-pitch/10 p-4 text-sm text-pitch-800 dark:text-pitch-200">
              {published}
            </div>
          )}
        </div>

        <div className="space-y-5">
          {drafts.length > 0 && (
            <section className="card p-5">
              <h2 className="section-title mb-3 text-base">Borradores</h2>
              <div className="space-y-2">
                {drafts.map((d) => (
                  <div key={d.title} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-white/[0.03]">
                    <button onClick={() => loadDraft(d)} className="truncate text-navy hover:text-pitch dark:text-slate-100">
                      {d.title}
                    </button>
                    <button onClick={() => deleteDraft(d.title)} className="text-xs text-red-400">✕</button>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="card p-5">
            <h2 className="section-title mb-3 text-base">Vista previa del código</h2>
            <p className="mb-3 text-xs text-slate-400">
              Si la publicación automática falla, copia este código y pégalo en <code>data/articles.ts</code>
            </p>
            <pre className="max-h-[60vh] overflow-auto rounded-lg bg-slate-900 p-4 text-[11px] text-green-400">
              {code}
            </pre>
            <button
              onClick={() => navigator.clipboard.writeText(code)}
              className="btn-ghost mt-3 w-full text-xs"
            >
              📋 Copiar código
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
