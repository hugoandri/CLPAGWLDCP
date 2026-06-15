"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import type { MatchStatus } from "@/lib/types";

type Props = {
  status: MatchStatus;
  matchDateUTC: string;
};

export default function LiveAutoRefresh({ status, matchDateUTC }: Props) {
  const router = useRouter();

  useEffect(() => {
    if (status === "finished") return;

    const matchTime = new Date(matchDateUTC).getTime();
    const msUntilMatch = matchTime - Date.now();
    const isLive = status === "live" || status === "halftime";

    // Refresh when: explicitly live, kickoff < 15 min away, or server shows "upcoming"
    // but match started < 120 min ago (stale deployment data)
    const shouldRefresh =
      isLive ||
      (msUntilMatch > -120 * 60_000 && msUntilMatch < 15 * 60_000);

    if (!shouldRefresh) return;

    const interval = isLive ? 30_000 : 60_000;
    const timer = setInterval(() => router.refresh(), interval);
    return () => clearInterval(timer);
  }, [status, matchDateUTC, router]);

  return null;
}
