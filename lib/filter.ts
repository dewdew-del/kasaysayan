import type { Event } from "./events";
import { TOPICS, type TopicId } from "./schema";

export const TOPIC_LABELS: Record<TopicId, string> = {
  war: "War",
  politics: "Politics",
  culture: "Culture",
  science: "Science",
  visayas: "Bohol & Visayas",
};

export function filterByTopic(events: Event[], topic: TopicId | null): Event[] {
  return topic ? events.filter((e) => e.topics.includes(topic)) : events;
}

/** Reads ?topic= safely: anything that isn't a known topic means "all". */
export function parseTopic(value: string | null): TopicId | null {
  return value && (TOPICS as readonly string[]).includes(value) ? (value as TopicId) : null;
}
