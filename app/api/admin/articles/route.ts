import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import { join } from "node:path";

export async function GET(request: Request) {
  const auth = request.headers.get("Authorization");
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminPassword && auth !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const filePath = join(process.cwd(), "data", "editorial-articles.json");
    const content = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(content);
    // Return reversed so newest first
    return NextResponse.json({ articles: (data.articles || []).reverse() });
  } catch {
    return NextResponse.json({ articles: [] });
  }
}

export async function DELETE(request: Request) {
  const auth = request.headers.get("Authorization");
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminPassword && auth !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { slug: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const filePath = join(process.cwd(), "data", "editorial-articles.json");
    const content = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(content);
    const before = data.articles.length;
    data.articles = data.articles.filter((a: { slug: string }) => a.slug !== body.slug);

    if (data.articles.length === before) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

    // Try GitHub commit
    const githubToken = process.env.GITHUB_TOKEN_ADMIN;
    if (githubToken) {
      try {
        const owner = process.env.GITHUB_OWNER || "hugoandri";
        const repo = process.env.GITHUB_REPO || "CLPAGWLDCP";
        const getRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/data/editorial-articles.json`,
          { headers: { Authorization: `Bearer ${githubToken}` } }
        );
        const existingFile = await getRes.json();
        const sha = existingFile.sha;
        const localContent = await fs.readFile(filePath, "base64");
        await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/data/editorial-articles.json`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${githubToken}`, "Content-Type": "application/json" },
          body: JSON.stringify({ message: `chore: delete article "${body.slug}"`, content: localContent, sha }),
        });
      } catch { /* non-fatal */ }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
