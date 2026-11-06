import { afterEach, describe, expect, test } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { loadAllEvents } from "@/lib/events";
import { parseStory } from "@/lib/story";

// Each test builds its own content folder in a temp dir, so story lengths can be generated
// instead of pasting 600+ word fixtures into the repo.
const dirs: string[] = [];
afterEach(() => dirs.splice(0).forEach((d) => fs.rmSync(d, { recursive: true, force: true })));

function workspace() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "kasaysayan-"));
  dirs.push(root);
  const content = path.join(root, "events");
  const images = path.join(root, "images");
  fs.mkdirSync(content);
  fs.mkdirSync(images);
  return { content, images };
}

const words = (n: number) => Array.from({ length: n }, (_, i) => `word${i}`).join(" ");
const longStory = (extra = "") =>
  `## One\n\n${words(250)}\n\n${extra}## Two\n\n${words(250)}\n\n## Three\n\n${words(250)}\n`;

function eventFile(o: {
  id: string;
  year: number;
  verified?: boolean;
  images?: string[];
  body?: string;
}) {
  const imgs = (o.images ?? [])
    .map(
      (f) => `  - file: ${f}
    caption: A caption
    alt: Alt text
    author: Unknown author
    license: Public domain
    sourceUrl: https://commons.wikimedia.org/wiki/File:${f}`,
    )
    .join("\n");
  return `---
id: ${o.id}
title: Event ${o.id}
date: { year: ${o.year} }
era: spanish
topics: [war]
summary: A short summary.
images:${imgs ? "\n" + imgs : " []"}
sources:
  - { title: A source, publisher: NHCP, url: "https://nhcp.gov.ph/", accessed: 2026-11-06 }
verified: ${o.verified ?? true}
---
${o.body ?? longStory()}`;
}

function write(dir: string, name: string, body: string) {
  fs.writeFileSync(path.join(dir, name), body);
}

describe("loadAllEvents", () => {
  test("loads and sorts verified events", () => {
    const { content, images } = workspace();
    write(content, "1872-b.md", eventFile({ id: "b", year: 1872 }));
    write(content, "1521-a.md", eventFile({ id: "a", year: 1521 }));
    const r = loadAllEvents(content, images);
    expect(r.errors).toEqual([]);
    expect(r.events.map((e) => e.id)).toEqual(["a", "b"]);
    expect(r.events[0].slug).toBe("1521-a");
    expect(r.events[0].story.chapters.map((c) => c.heading)).toEqual(["One", "Two", "Three"]);
  });

  test("lists unverified ids and leaves them out of events", () => {
    const { content, images } = workspace();
    write(content, "1521-a.md", eventFile({ id: "a", year: 1521 }));
    write(content, "1600-draft.md", eventFile({ id: "draft", year: 1600, verified: false, body: "Short draft." }));
    const r = loadAllEvents(content, images);
    expect(r.unverified).toEqual(["draft"]);
    expect(r.events.map((e) => e.id)).toEqual(["a"]);
  });

  test("includeDrafts also returns unverified events, marked as drafts", () => {
    const { content, images } = workspace();
    write(content, "1521-a.md", eventFile({ id: "a", year: 1521 }));
    write(content, "1600-draft.md", eventFile({ id: "draft", year: 1600, verified: false, body: "Short draft." }));
    const r = loadAllEvents(content, images, { includeDrafts: true });
    expect(r.events.map((e) => [e.id, e.verified])).toEqual([
      ["a", true],
      ["draft", false],
    ]);
    expect(r.unverified).toEqual(["draft"]);
  });

  test("drafts are never shown in a production build, even with SHOW_DRAFTS=1", async () => {
    const { showDrafts } = await import("@/lib/events");
    expect(showDrafts({ SHOW_DRAFTS: "1", NODE_ENV: "production" })).toBe(false);
    expect(showDrafts({ SHOW_DRAFTS: "1", NODE_ENV: "development" })).toBe(true);
    expect(showDrafts({ NODE_ENV: "development" })).toBe(false);
  });

  test("ignores files starting with an underscore (the template)", () => {
    const { content, images } = workspace();
    write(content, "_template.md", "not valid at all");
    expect(loadAllEvents(content, images)).toEqual({ events: [], unverified: [], errors: [] });
  });

  test("reports missing image file with file name", () => {
    const { content, images } = workspace();
    write(content, "1521-a.md", eventFile({ id: "a", year: 1521, images: ["a-1.webp"] }));
    const r = loadAllEvents(content, images);
    expect(r.errors).toHaveLength(1);
    expect(r.errors[0]).toContain("1521-a.md");
    expect(r.errors[0]).toContain("images.0.file");
    expect(r.errors[0]).toContain("a-1.webp");
  });

  test("reports duplicate id", () => {
    const { content, images } = workspace();
    write(content, "1521-a.md", eventFile({ id: "a", year: 1521 }));
    write(content, "1522-a.md", eventFile({ id: "a", year: 1522 }));
    const r = loadAllEvents(content, images);
    expect(r.errors.some((e) => e.includes("1522-a.md") && e.includes("id") && e.includes("duplicate"))).toBe(true);
  });

  test("reports schema errors as file: field: message", () => {
    const { content, images } = workspace();
    write(content, "1521-a.md", eventFile({ id: "a", year: 1521 }).replace("era: spanish", "era: medieval"));
    const r = loadAllEvents(content, images);
    expect(r.errors[0]).toMatch(/^1521-a\.md: era: /);
  });

  test("verified story under 600 words is an error", () => {
    const { content, images } = workspace();
    write(content, "1521-a.md", eventFile({ id: "a", year: 1521, body: `## One\n\n${words(100)}\n\n## Two\n\nx\n\n## Three\n\ny\n` }));
    const r = loadAllEvents(content, images);
    expect(r.errors.some((e) => e.startsWith("1521-a.md: body:") && e.includes("600"))).toBe(true);
  });

  test("verified story with fewer than 3 chapters is an error", () => {
    const { content, images } = workspace();
    write(content, "1521-a.md", eventFile({ id: "a", year: 1521, body: `## One\n\n${words(700)}\n` }));
    expect(loadAllEvents(content, images).errors.some((e) => e.includes("chapters"))).toBe(true);
  });

  test("unverified short story is allowed", () => {
    const { content, images } = workspace();
    write(content, "1600-draft.md", eventFile({ id: "draft", year: 1600, verified: false, body: "Short draft." }));
    expect(loadAllEvents(content, images).errors).toEqual([]);
  });

  test("{{photo:9}} with 5 images is an error naming the file", () => {
    const { content, images } = workspace();
    const files = [1, 2, 3, 4, 5].map((n) => `a-${n}.webp`);
    files.forEach((f) => write(images, f, "x"));
    write(content, "1521-a.md", eventFile({ id: "a", year: 1521, images: files, body: longStory("{{photo:9}}\n\n") }));
    const r = loadAllEvents(content, images);
    expect(r.errors).toHaveLength(1);
    expect(r.errors[0]).toContain("1521-a.md");
    expect(r.errors[0]).toContain("photo:9");
  });
});

describe("parseStory", () => {
  test("parseStory splits chapters on ## headings", () => {
    const s = parseStory("Opening line.\n\n## The dig\n\nFirst.\n\nSecond.\n\n## The date\n\nThird.");
    expect(s.chapters.map((c) => c.heading)).toEqual(["", "The dig", "The date"]);
    expect(s.chapters[1].blocks).toEqual([
      { type: "p", text: "First." },
      { type: "p", text: "Second." },
    ]);
  });

  test("parseStory turns {{photo:2}} into photo block index 1", () => {
    const s = parseStory("## One\n\nBefore.\n\n{{photo:2}}\n\nAfter.");
    expect(s.chapters[0].blocks).toEqual([
      { type: "p", text: "Before." },
      { type: "photo", index: 1 },
      { type: "p", text: "After." },
    ]);
  });

  test("readMinutes is ceil(words/220)", () => {
    const s = parseStory(`## One\n\n${words(1000)}`);
    expect(s.words).toBe(1000);
    expect(s.readMinutes).toBe(5);
  });

  test("joins wrapped lines inside a paragraph", () => {
    const s = parseStory("## One\n\nA line\nthat wraps.");
    expect(s.chapters[0].blocks).toEqual([{ type: "p", text: "A line that wraps." }]);
  });
});

describe("getEvent", () => {
  test("getEvent returns undefined for unknown id", async () => {
    const { getEvent } = await import("@/lib/events");
    expect(getEvent("no-such-event")).toBeUndefined();
  });
});
