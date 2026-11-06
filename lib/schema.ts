import { z } from "zod";

export const ERAS = ["precolonial", "spanish", "revolution", "american", "japanese", "third", "martial", "edsa", "modern"] as const;
export type EraId = (typeof ERAS)[number];

export const ERA_LABELS: Record<EraId, string> = {
  precolonial: "Pre-colonial",
  spanish: "Spanish Era",
  revolution: "Revolution",
  american: "American Era",
  japanese: "Japanese Occupation",
  third: "Third Republic",
  martial: "Martial Law",
  edsa: "EDSA",
  modern: "Modern Times",
};

export const TOPICS = ["war", "politics", "culture", "science", "visayas"] as const;
export type TopicId = (typeof TOPICS)[number];

/** Only these licenses may appear on the site (spec, Global Constraints). */
export const LICENSE_RE = /^(Public domain|CC0|CC BY(-SA)? \d\.\d)$/;
export const MAX_IMAGES = 8;

const text = z.string().trim().min(1, "required");

const DateSchema = z.union([
  z.object({ label: text, sort: z.number(), approx: z.literal(true) }).strict(),
  z
    .object({
      year: z.number().int(),
      month: z.number().int().min(1).max(12).optional(),
      day: z.number().int().min(1).max(31).optional(),
    })
    .strict(),
]);

const ImageSchema = z.object({
  file: text,
  caption: text,
  alt: text,
  author: text,
  license: z.string().regex(LICENSE_RE, "license must be Public domain, CC0, CC BY x.x or CC BY-SA x.x"),
  sourceUrl: z.url(),
});

// gray-matter turns `accessed: 2026-11-06` into a Date; keep it as YYYY-MM-DD text.
const AccessedSchema = z.union([z.string(), z.date()]).transform((v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v));

const SourceSchema = z.object({
  title: text,
  publisher: text,
  url: z.url(),
  accessed: AccessedSchema,
});

export const EventSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/, "use lowercase letters, digits and hyphens"),
    title: text,
    date: DateSchema,
    era: z.enum(ERAS),
    topics: z.array(z.enum(TOPICS)).min(1),
    place: z.object({ name: text, lat: z.number().min(4).max(22), lng: z.number().min(115).max(128) }).optional(),
    summary: text,
    images: z.array(ImageSchema).max(MAX_IMAGES, `at most ${MAX_IMAGES} images`).default([]),
    sources: z.array(SourceSchema).min(1, "at least one source"),
    contested: z.boolean().default(false),
    contestedNote: z.string().default(""),
    verified: z.boolean().default(false),
  })
  .superRefine((e, ctx) => {
    if (e.contested && e.sources.length < 2) {
      ctx.addIssue({ code: "custom", path: ["sources"], message: "contested events need at least 2 independent sources" });
    }
    if (e.contested && !e.contestedNote.trim()) {
      ctx.addIssue({ code: "custom", path: ["contestedNote"], message: "contested events need a note saying where sources differ" });
    }
    e.sources.forEach((s, i) => {
      if (/(^|\.)wikipedia\.org$/i.test(new URL(s.url).hostname)) {
        ctx.addIssue({ code: "custom", path: ["sources", i, "url"], message: "Wikipedia can point to sources but is never cited as one" });
      }
    });
  });

export type EventMeta = z.infer<typeof EventSchema>;
export type EventImage = EventMeta["images"][number];
