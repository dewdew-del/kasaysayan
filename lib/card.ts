import type { Event } from "./events";

/** What the home page's story list and map need: no story text, sources or extra photos. */
export type EventCard = Pick<Event, "id" | "title" | "date" | "era" | "topics" | "place" | "summary" | "contested" | "verified" | "images">;

export function toCard(e: Event): EventCard {
  const { id, title, date, era, topics, place, summary, contested, verified, images } = e;
  return { id, title, date, era, topics, place, summary, contested, verified, images: images.slice(0, 1) };
}
