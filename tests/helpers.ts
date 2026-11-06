import type { Event } from "@/lib/events";
import type { EventImage } from "@/lib/schema";
import { parseStory } from "@/lib/story";

export const img = (n: number, id = "x"): EventImage => ({
  file: `${id}-${n}.webp`,
  caption: `Caption ${n}`,
  alt: `Alt ${n}`,
  author: "Unknown author",
  license: "Public domain",
  sourceUrl: `https://commons.wikimedia.org/wiki/File:${id}-${n}.jpg`,
});

/** A valid published event for component tests; override any field. */
export function makeEvent(over: Partial<Event> & { id: string }): Event {
  const body = over.body ?? "## One\n\nFirst paragraph.\n\n## Two\n\nSecond.\n\n## Three\n\nThird.";
  return {
    title: `Title ${over.id}`,
    date: { year: 1898, month: 6, day: 12 },
    era: "revolution",
    topics: ["politics"],
    place: { name: "Kawit, Cavite", lat: 14.44, lng: 120.9 },
    summary: `Summary of ${over.id}.`,
    images: [],
    sources: [{ title: "A source", publisher: "NHCP", url: "https://nhcp.gov.ph/", accessed: "2026-11-06" }],
    contested: false,
    contestedNote: "",
    verified: true,
    slug: over.id,
    story: parseStory(body),
    ...over,
    body,
  };
}
