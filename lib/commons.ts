// Helpers for fetching photos and their credits from the Wikimedia Commons API.
import type { EventImage } from "./schema";

export const USER_AGENT = "Kasaysayan/1.0 (https://github.com/dewdew-del/kasaysayan)";
export const RETRY_WAIT_MS = 30000;

/** Maps a Commons LicenseShortName to one of the site's allowed licenses, or null. */
export function normalizeLicense(raw: string | undefined): string | null {
  if (!raw) return null;
  const s = raw.trim().replace(/\s+/g, " ");
  if (/^public domain$/i.test(s)) return "Public domain";
  if (/^cc0( 1\.0)?$/i.test(s)) return "CC0";
  const m = /^cc by(-sa)? (\d\.\d)$/i.exec(s);
  return m ? `CC BY${m[1] ? "-SA" : ""} ${m[2]}` : null;
}

/** Commons artist fields are HTML and sometimes repeat "Unknown author". */
export function cleanAuthor(raw: string | undefined): string {
  const s = (raw ?? "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  if (!s || /^unknown author/i.test(s)) return "Unknown author";
  return s.slice(0, 120);
}

const isRateLimit = (text: string, status: number) => status === 429 || /too many requests/i.test(text);

/** GET JSON; on a rate-limit answer wait 30 s and try once more. */
export async function fetchWithRetry(
  fetchFn: typeof fetch,
  url: string,
  sleep: (ms: number) => Promise<void> = (ms) => new Promise((r) => setTimeout(r, ms)),
): Promise<unknown> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetchFn(url, { headers: { "User-Agent": USER_AGENT } });
    const text = await res.text();
    if (!isRateLimit(text, res.status)) return JSON.parse(text);
    if (attempt === 0) await sleep(RETRY_WAIT_MS);
  }
  throw new Error(`Commons rate-limited the request twice: ${url}`);
}

/** Non-standard thumbnail widths get throttled; 500px is a standard cached size. */
export const thumbFallback = (url: string) => url.replace(/\/(lossy-page1-)?\d+px-/, "/$1500px-");

export function toImageEntry(file: string, info: { author: string; license: string; sourceUrl: string }): EventImage {
  return { file, caption: "TODO", alt: "TODO", ...info };
}
