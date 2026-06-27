import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

export async function POST(request: Request) {
  const auth = request.headers.get("Authorization");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminPassword && auth !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${randomUUID()}.${ext}`;
  const uploadDir = join(process.cwd(), "public", "uploads");
  const filePath = join(uploadDir, filename);

  await fs.mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  const publicUrl = `/uploads/${filename}`;

  // Commit to GitHub via API
  const githubToken = process.env.GITHUB_TOKEN_ADMIN;
  if (githubToken) {
    try {
      const owner = process.env.GITHUB_OWNER || "hugoandri";
      const repo = process.env.GITHUB_REPO || "CLPAGWLDCP";
      const gitPath = `public/uploads/${filename}`;

      const base64Content = buffer.toString("base64");

      await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${gitPath}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${githubToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `feat: upload image ${filename}`,
          content: base64Content,
        }),
      });
    } catch (err) {
      console.error("GitHub upload failed (non-fatal):", err);
    }
  }

  return NextResponse.json({ ok: true, url: publicUrl, filename });
}
