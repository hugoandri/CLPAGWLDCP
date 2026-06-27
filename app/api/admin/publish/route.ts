import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import { join } from "node:path";

interface Section { heading: string; body: string }
interface Faq { question: string; answer: string }

interface ArticleInput {
  title: string;
  subtitle?: string;
  category: string;
  date: string;
  excerpt: string;
  author?: string;
  authorSocial?: string;
  imageUrl?: string;
  imageCaption?: string;
  status?: string;
  editingSlug?: string;
  sections: Section[];
  faqs: Faq[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function POST(request: Request) {
  const auth = request.headers.get("Authorization");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminPassword && auth !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: ArticleInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.title || !body.excerpt || body.sections.length === 0) {
    return NextResponse.json({ error: "Title, excerpt and at least one section required" }, { status: 400 });
  }

  const sections = body.sections.filter((s) => s.body);
  if (sections.length === 0) {
    sections.push({ heading: "Análisis", body: body.excerpt });
  }

  const article: Record<string, unknown> = {
    slug: slugify(body.title),
    title: body.title,
    category: body.category,
    date: body.date,
    readingMinutes: Math.max(1, Math.ceil(
      sections.reduce((a, s) => a + s.body.split(" ").length, 0) / 200
    )),
    excerpt: body.excerpt,
    subtitle: body.subtitle || undefined,
    author: body.author || "Redacción DataGoal",
    trend: body.category,
    sections,
    faqs: body.faqs.filter((f) => f.question && f.answer),
  };

  if (body.authorSocial) {
    article.authorSocial = body.authorSocial;
  }
  if (body.imageUrl) {
    article.imageUrl = body.imageUrl;
    article.imageCaption = body.imageCaption || "";
  }
  article.status = body.status || "published";

  // Guardar en data/editorial-articles.json
  try {
    const filePath = join(process.cwd(), "data", "editorial-articles.json");
    const existing = JSON.parse(await fs.readFile(filePath, "utf-8"));

    // If editing an existing article, replace it by slug
    if (body.editingSlug) {
      const idx = existing.articles.findIndex((a: { slug: string }) => a.slug === body.editingSlug);
      if (idx >= 0) {
        existing.articles[idx] = article;
      } else {
        existing.articles.push(article);
      }
    } else {
      existing.articles.push(article);
    }

    await fs.writeFile(filePath, JSON.stringify(existing, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write editorial file:", err);
    return NextResponse.json({
      error: "No se pudo guardar en el archivo. Copia el código manualmente.",
      article,
    });
  }

  // Intentar commit via GitHub API (falla silenciosamente si no hay token)
  const githubToken = process.env.GITHUB_TOKEN_ADMIN;
  if (githubToken) {
    try {
      const owner = process.env.GITHUB_OWNER || "hugoandri";
      const repo = process.env.GITHUB_REPO || "CLPAGWLDCP";
      const filePath = "data/editorial-articles.json";

      // Obtener el archivo actual del repo para obtener el sha
      const getRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
        { headers: { Authorization: `Bearer ${githubToken}` } }
      );
      const existingFile = await getRes.json();
      const sha = existingFile.sha;

      // Leer el archivo local actualizado
      const localPath = join(process.cwd(), "data", "editorial-articles.json");
      const content = await fs.readFile(localPath, "base64");

      // Hacer commit
      await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${githubToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `feat: add editorial article "${article.title}"`,
          content,
          sha,
        }),
      });
    } catch (err) {
      console.error("GitHub commit failed (non-fatal):", err);
    }
  }

  return NextResponse.json({
    ok: true,
    article,
    message: "Artículo guardado. Se desplegará automáticamente en la próxima build.",
  });
}
