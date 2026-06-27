"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ArticleForm {
  title: string;
  subtitle: string;
  category: string;
  date: string;
  excerpt: string;
  author: string;
  authorSocial: string;
  imageUrl: string;
  imageCaption: string;
  status: "draft" | "published";
  sections: { heading: string; body: string }[];
  faqs: { question: string; answer: string }[];
}

interface EditorialEntry extends ArticleForm {
  slug: string;
  readingMinutes: number;
  trend: string;
}

const CATEGORIES = ["Análisis", "Tendencias", "Datos", "Clasificación", "Herramienta"];
const DRAFTS_KEY = "datagoal-admin-drafts";

const emptyForm = (): ArticleForm => ({
  title: "",
  subtitle: "",
  category: "Análisis",
  date: new Date().toISOString().slice(0, 10),
  excerpt: "",
  author: "",
  authorSocial: "",
  imageUrl: "",
  imageCaption: "",
  status: "published",
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

function ImageUploader({ value, onChange, authPw }: { value: string; onChange: (url: string) => void; authPw: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Solo se permiten imágenes");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: authPw },
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
      } else {
        alert("Error al subir: " + (data.error || "desconocido"));
      }
    } catch {
      alert("Error de conexión");
    }
    setUploading(false);
  };

  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Imagen</label>
      <div
        className={`mt-1 flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors cursor-pointer ${
          dragOver
            ? "border-pitch bg-pitch/5"
            : "border-slate-300 bg-slate-50 dark:border-white/20 dark:bg-white/[0.03]"
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
      >
        {uploading ? (
          <p className="text-sm text-slate-500">Subiendo imagen...</p>
        ) : value ? (
          <div className="w-full space-y-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="mx-auto max-h-40 rounded-lg object-cover" />
            <p className="text-center text-xs text-slate-400">Arrastra o haz clic para cambiar</p>
          </div>
        ) : (
          <>
            <span className="text-2xl text-slate-300">📷</span>
            <p className="mt-2 text-sm text-slate-500">Arrastra una imagen o haz clic para seleccionar</p>
            <p className="mt-1 text-xs text-slate-400">JPG, PNG, WebP</p>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-xs dark:border-white/20 dark:bg-navy-900"
        placeholder="O pega una URL manualmente"
      />
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [storedPw, setStoredPw] = useState("");
  const [form, setForm] = useState<ArticleForm>(emptyForm());
  const [tab, setTab] = useState<"nuevo" | "todas">("nuevo");
  const [allArticles, setAllArticles] = useState<EditorialEntry[]>([]);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [loadingList, setLoadingList] = useState(false);
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
    const subtitleLine = form.subtitle ? `    subtitle: "${form.subtitle}",` : '';
    return `  {
    slug: "${slug}",
    title: "${form.title}",
    ${subtitleLine}
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

  const loadArticlesList = async () => {
    setLoadingList(true);
    try {
      const res = await fetch("/api/admin/articles", { headers: { Authorization: storedPw } });
      if (res.ok) {
        const data = await res.json();
        setAllArticles(data.articles || []);
      }
    } catch { /* ignore */ }
    setLoadingList(false);
  };

  const startEdit = (article: EditorialEntry) => {
    setForm({
      title: article.title,
      subtitle: article.subtitle || "",
      category: article.category,
      date: article.date,
      excerpt: article.excerpt,
      author: article.author,
      authorSocial: article.authorSocial || "",
      imageUrl: article.imageUrl || "",
      imageCaption: article.imageCaption || "",
      status: article.status || "published",
      sections: article.sections,
      faqs: article.faqs,
    });
    setEditingSlug(article.slug);
    setTab("nuevo");
  };

  const deleteArticle = async (slug: string) => {
    if (!confirm(`¿Eliminar "${slug}"?`)) return;
    try {
      const res = await fetch("/api/admin/articles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: storedPw },
        body: JSON.stringify({ slug }),
      });
      if (res.ok) {
        loadArticlesList();
        alert("Artículo eliminado");
      } else {
        const data = await res.json();
        alert("Error: " + (data.error || "desconocido"));
      }
    } catch { alert("Error de conexión"); }
  };

  const publish = async () => {
    setPublishing(true);
    setPublished(null);
    try {
      const payload = { ...form, editingSlug };
      const res = await fetch("/api/admin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: storedPw },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setPublished(form.status === "draft" ? "Borrador guardado." : `Artículo publicado. ${data.commitUrl ? `Commit: ${data.commitUrl}` : ""}`);
        setForm(emptyForm());
        setEditingSlug(null);
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

      {/* Tab navigation */}
      <div className="mb-6 flex gap-2 border-b border-slate-200 pb-2 dark:border-white/10">
        <button onClick={() => setTab("nuevo")} className={cn("rounded-t-lg px-4 py-2 text-sm font-semibold transition", tab === "nuevo" ? "bg-pitch text-white" : "text-slate-500 hover:text-navy dark:hover:text-slate-200")}>
          ✏️ Nuevo artículo
        </button>
        <button onClick={() => { setTab("todas"); loadArticlesList(); }} className={cn("rounded-t-lg px-4 py-2 text-sm font-semibold transition", tab === "todas" ? "bg-pitch text-white" : "text-slate-500 hover:text-navy dark:hover:text-slate-200")}>
          📋 Todas las publicaciones
        </button>
      </div>

      {tab === "nuevo" && (
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <section className="card p-6">
            <h2 className="section-title mb-4 text-xl">{editingSlug ? "Editar artículo" : "Nuevo artículo"}</h2>

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

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Bajada / Subtítulo</label>
                <textarea
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-white/20 dark:bg-navy-900"
                  rows={2}
                  placeholder="Texto que aparece justo después del título, antes de la imagen"
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

              <ImageUploader
                value={form.imageUrl}
                onChange={(url) => setForm({ ...form, imageUrl: url })}
                authPw={storedPw}
              />
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

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Estado</label>
                <div className="mt-1 flex gap-3">
                  <label className={cn("flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm transition", form.status === "published" ? "border-pitch bg-pitch/10 text-pitch-800 dark:text-pitch-200" : "border-slate-200 text-slate-500 dark:border-white/10")}>
                    <input type="radio" name="status" value="published" checked={form.status === "published"} onChange={() => setForm({ ...form, status: "published" })} className="sr-only" />
                    <span>📢 Publicado</span>
                  </label>
                  <label className={cn("flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm transition", form.status === "draft" ? "border-gold bg-gold/10 text-gold-800 dark:text-gold-200" : "border-slate-200 text-slate-500 dark:border-white/10")}>
                    <input type="radio" name="status" value="draft" checked={form.status === "draft"} onChange={() => setForm({ ...form, status: "draft" })} className="sr-only" />
                    <span>📝 Borrador</span>
                  </label>
                </div>
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
      )}

      {tab === "todas" && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="section-title text-xl">Todas las publicaciones</h2>
            <button onClick={loadArticlesList} className="btn-ghost text-xs">🔄 Refrescar</button>
          </div>

          {loadingList ? (
            <p className="text-sm text-slate-400">Cargando...</p>
          ) : allArticles.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-sm text-slate-500">No hay publicaciones editoriales todavía.</p>
              <p className="mt-1 text-xs text-slate-400">Las publicaciones aparecerán aquí cuando uses el formulario "Nuevo artículo".</p>
            </div>
          ) : (
            <div className="space-y-3">
              {allArticles.map((a) => (
                <div key={a.slug} className="card flex items-center gap-4 p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={cn("inline-block h-2 w-2 rounded-full", a.status === "published" ? "bg-pitch" : "bg-gold")} />
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{a.status === "published" ? "Publicado" : "Borrador"}</span>
                      <span className="text-xs text-slate-300">·</span>
                      <span className="text-xs text-slate-400">{a.category}</span>
                      <span className="text-xs text-slate-300">·</span>
                      <span className="text-xs text-slate-400">{a.date}</span>
                    </div>
                    <h3 className="mt-1 font-display text-base font-bold text-navy dark:text-slate-100">{a.title}</h3>
                    <p className="mt-0.5 text-xs text-slate-400">{a.author} · {a.slug}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button onClick={() => startEdit(a)} className="btn-ghost text-xs">✏️ Editar</button>
                    <button onClick={() => deleteArticle(a.slug)} className="btn-ghost text-xs text-red-400 hover:text-red-500">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
