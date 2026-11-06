import { describe, expect, test, vi } from "vitest";
import { cleanAuthor, fetchWithRetry, normalizeLicense, toImageEntry, thumbFallback } from "@/lib/commons";

describe("Commons helpers", () => {
  test("normalizeLicense allows list only", () => {
    expect(normalizeLicense("Public domain")).toBe("Public domain");
    expect(normalizeLicense("CC0")).toBe("CC0");
    expect(normalizeLicense("CC BY-SA 4.0")).toBe("CC BY-SA 4.0");
    expect(normalizeLicense("CC BY 2.0")).toBe("CC BY 2.0");
    expect(normalizeLicense(" cc by-sa 3.0 ")).toBe("CC BY-SA 3.0");
    expect(normalizeLicense("CC BY-SA 3.0 igo")).toBeNull();
    expect(normalizeLicense("GFDL")).toBeNull();
    expect(normalizeLicense("All rights reserved")).toBeNull();
    expect(normalizeLicense(undefined)).toBeNull();
  });

  test("cleans duplicated Unknown author", () => {
    expect(cleanAuthor("Unknown authorUnknown author")).toBe("Unknown author");
    expect(cleanAuthor("\nUnknown authorUnknown author or not provided")).toBe("Unknown author");
    expect(cleanAuthor('<a href="//x">U.S. Army   Signal Corps</a>')).toBe("U.S. Army Signal Corps");
    expect(cleanAuthor("")).toBe("Unknown author");
  });

  test("retries once on rate-limit text", async () => {
    const sleep = vi.fn(async () => {});
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce(new Response("You are making too many requests to the API.", { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    await expect(fetchWithRetry(fetchFn, "https://x", sleep)).resolves.toEqual({ ok: true });
    expect(fetchFn).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenCalledWith(30000);
  });

  test("gives up after the retry", async () => {
    const fetchFn = vi.fn().mockImplementation(async () => new Response("too many requests", { status: 429 }));
    await expect(fetchWithRetry(fetchFn, "https://x", async () => {})).rejects.toThrow(/rate-limited/);
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });

  test("thumbFallback switches to a standard 500px thumbnail", () => {
    expect(thumbFallback("https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/X.jpg/1200px-X.jpg")).toBe(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/X.jpg/500px-X.jpg",
    );
  });

  test("toImageEntry leaves caption and alt as TODO for the writer", () => {
    const e = toImageEntry("1898-kawit-1.webp", { author: "Unknown author", license: "Public domain", sourceUrl: "https://commons.wikimedia.org/wiki/File:X.jpg" });
    expect(e).toEqual({
      file: "1898-kawit-1.webp",
      caption: "TODO",
      alt: "TODO",
      author: "Unknown author",
      license: "Public domain",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:X.jpg",
    });
  });
});
