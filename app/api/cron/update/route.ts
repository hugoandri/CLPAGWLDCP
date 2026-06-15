import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const token = process.env.GITHUB_PAT;
  if (!token) {
    return NextResponse.json({ error: "GITHUB_PAT not set" }, { status: 500 });
  }

  const res = await fetch(
    "https://api.github.com/repos/hugoandri/CLPAGWLDCP/actions/workflows/update-data.yml/dispatches",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "User-Agent": "datagoal-vercel-cron",
      },
      body: JSON.stringify({ ref: "main" }),
    }
  );

  if (res.status === 204) {
    return NextResponse.json({ ok: true, triggered: new Date().toISOString() });
  }

  const body = await res.text();
  return NextResponse.json({ error: body }, { status: res.status });
}
