import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { EventSchema, type EventMeta } from "./schema";
import { sortKey } from "./dates";
import { parseStory, type Story } from "./story";

export type Event = EventMeta & { body: string; slug: string; story: Story };

export const CONTENT_DIR = path.join(process.cwd(), "content", "events");
export const IMAGE_DIR = path.join(process.cwd(), "public", "images", "events");

/** Limits for verified stories (spec section 5). */
export const STORY_MIN_WORDS = 600;
export const STORY_MAX_WORDS = 1500;
export const STORY_MIN_CHAPTERS = 3;

export type LoadResult = { events: Event[]; unverified: string[]; errors: string[] };

/**
 * Reads every event file, validates it and returns the verified events in time order.
 * Every problem becomes one "<file>: <field>: <message>" line in `errors`.
 * Files whose names start with "_" (the template) are skipped.
 */
export function loadAllEvents(dir: string = CONTENT_DIR, imageDir: string = IMAGE_DIR): LoadResult {
  const errors: string[] = [];
  const unverified: string[] = [];
  const events: Event[] = [];
  if (!fs.existsSync(dir)) return { events, unverified, errors };

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .sort();
  const seen = new Map<string, string>();

  for (const file of files) {
    const err = (field: string, message: string) => errors.push(`${file}: ${field}: ${message}`);
    let parsed: matter.GrayMatterFile<string>;
    try {
      parsed = matter(fs.readFileSync(path.join(dir, file), "utf8"));
    } catch (e) {
      err("frontmatter", `could not be read (${(e as Error).message.split("\n")[0]})`);
      continue;
    }

    const result = EventSchema.safeParse(parsed.data);
    if (!result.success) {
      for (const issue of result.error.issues) err(issue.path.join(".") || "frontmatter", issue.message);
      continue;
    }
    const meta = result.data;

    if (seen.has(meta.id)) {
      err("id", `duplicate id "${meta.id}" (also used in ${seen.get(meta.id)})`);
      continue;
    }
    seen.set(meta.id, file);

    const before = errors.length;
    meta.images.forEach((img, i) => {
      if (!fs.existsSync(path.join(imageDir, img.file))) err(`images.${i}.file`, `missing file ${img.file} in public/images/events`);
    });

    const story = parseStory(parsed.content);
    for (const ch of story.chapters) {
      for (const b of ch.blocks) {
        if (b.type === "photo" && !meta.images[b.index]) {
          err("body", `{{photo:${b.index + 1}}} points to a missing image (this event has ${meta.images.length})`);
        }
      }
    }

    if (meta.verified) {
      if (story.words < STORY_MIN_WORDS || story.words > STORY_MAX_WORDS) {
        err("body", `verified stories need ${STORY_MIN_WORDS}–${STORY_MAX_WORDS} words (this one has ${story.words})`);
      }
      const titled = story.chapters.filter((c) => c.heading).length;
      if (titled < STORY_MIN_CHAPTERS) err("body", `verified stories need at least ${STORY_MIN_CHAPTERS} chapters with ## headings (found ${titled})`);
    }

    if (errors.length > before) continue;
    if (!meta.verified) {
      unverified.push(meta.id);
      continue;
    }
    events.push({ ...meta, body: parsed.content, slug: file.replace(/\.md$/, ""), story });
  }

  events.sort((a, b) => sortKey(a.date) - sortKey(b.date));
  return { events, unverified, errors };
}

let cache: Event[] | null = null;

/** Verified events in time order. Throws if any event file has an error, so a bad file fails the build. */
export function getPublishedEvents(): Event[] {
  if (cache) return cache;
  const { events, errors } = loadAllEvents();
  if (errors.length) throw new Error(`Event content has ${errors.length} error(s):\n${errors.join("\n")}`);
  cache = events;
  return events;
}

export function getEvent(id: string): Event | undefined {
  return getPublishedEvents().find((e) => e.id === id);
}
