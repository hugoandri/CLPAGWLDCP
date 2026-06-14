import notesSnapshot from "@/data/team-notes.json";

export type TeamPerformanceTrend = "positive" | "neutral" | "negative";

export interface TeamPerformanceNote {
  teamSlug: string;
  headline: string;
  body: string;
  trend: TeamPerformanceTrend;
  evidenceUrls: string[];
  confidence: number;
}

interface TeamNotesSnapshot {
  generatedAt: string | null;
  source: string;
  notes: TeamPerformanceNote[];
}

const snapshot = notesSnapshot as TeamNotesSnapshot;

export const teamNotes = snapshot.notes;
export const teamNotesGeneratedAt = snapshot.generatedAt;

const noteByTeamSlug = new Map(teamNotes.map((note) => [note.teamSlug, note]));

export function getTeamNote(teamSlug: string): TeamPerformanceNote | undefined {
  return noteByTeamSlug.get(teamSlug);
}
