import { describe, expect, test } from "vitest";
import { EventSchema } from "@/lib/schema";

// Fixture copied from spec section 5.
const valid = () => ({
  id: "1898-independence",
  title: "Declaration of Philippine Independence",
  date: { year: 1898, month: 6, day: 12 },
  era: "revolution",
  topics: ["politics"],
  place: { name: "Kawit, Cavite", lat: 14.44, lng: 120.9 },
  summary: "Emilio Aguinaldo proclaims independence from Spain in Kawit.",
  images: [
    {
      file: "1898-independence-1.webp",
      caption: "Emilio Aguinaldo, about 1898",
      alt: "Portrait of Emilio Aguinaldo in uniform",
      author: "Unknown author",
      license: "Public domain",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Emilio_Aguinaldo_(ca._1898).jpg",
    },
  ],
  sources: [{ title: "Philippine Declaration of Independence", publisher: "NHCP", url: "https://nhcp.gov.ph/", accessed: "2026-11-06" }],
  contested: false,
  contestedNote: "",
  verified: false,
});

const issuePaths = (input: unknown) => {
  const r = EventSchema.safeParse(input);
  return r.success ? [] : r.error.issues.map((i) => i.path.join("."));
};

describe("EventSchema", () => {
  test("accepts valid event", () => {
    expect(EventSchema.safeParse(valid()).success).toBe(true);
  });

  test("rejects disallowed license", () => {
    const e = valid();
    e.images[0].license = "All rights reserved";
    expect(issuePaths(e)).toContain("images.0.license");
  });

  test("accepts each allowed license form", () => {
    for (const license of ["Public domain", "CC0", "CC BY 2.0", "CC BY-SA 4.0"]) {
      const e = valid();
      e.images[0].license = license;
      expect(EventSchema.safeParse(e).success, license).toBe(true);
    }
  });

  test("rejects more than 8 images", () => {
    const e = valid();
    e.images = Array.from({ length: 9 }, (_, i) => ({ ...valid().images[0], file: `x-${i}.webp` }));
    expect(issuePaths(e)).toContain("images");
  });

  test("image requires caption and alt", () => {
    const e = valid();
    e.images[0].caption = "";
    e.images[0].alt = "";
    const paths = issuePaths(e);
    expect(paths).toContain("images.0.caption");
    expect(paths).toContain("images.0.alt");
  });

  test("rejects contested event with one source", () => {
    const e = { ...valid(), contested: true, contestedNote: "Sources disagree on the date." };
    expect(issuePaths(e)).toContain("sources");
  });

  test("rejects contested without note", () => {
    const e = valid();
    e.contested = true;
    e.sources.push({ title: "Second source", publisher: "Official Gazette", url: "https://www.officialgazette.gov.ph/", accessed: "2026-11-06" });
    expect(issuePaths(e)).toContain("contestedNote");
  });

  test("rejects wikipedia source url", () => {
    const e = valid();
    e.sources[0].url = "https://en.wikipedia.org/wiki/Philippine_Declaration_of_Independence";
    expect(issuePaths(e)).toContain("sources.0.url");
  });

  test("place is optional", () => {
    const { place: _omit, ...e } = valid();
    expect(EventSchema.safeParse(e).success).toBe(true);
  });

  test("images may be empty", () => {
    expect(EventSchema.safeParse({ ...valid(), images: [] }).success).toBe(true);
  });

  test("accepted date from YAML may arrive as a Date and becomes a string", () => {
    const e = valid();
    (e.sources[0] as { accessed: unknown }).accessed = new Date("2026-11-06T00:00:00Z");
    const r = EventSchema.parse(e);
    expect(r.sources[0].accessed).toBe("2026-11-06");
  });

  test("rejects unknown era and topic", () => {
    const paths = issuePaths({ ...valid(), era: "medieval", topics: ["sports"] });
    expect(paths).toContain("era");
    expect(paths).toContain("topics.0");
  });
});
