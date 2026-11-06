// npm run fetch-image -- <event-id> "<Commons file title 1>" "<title 2>" ...   (up to 8)
// Downloads each photo from Wikimedia Commons, checks its license, saves it as
// public/images/events/<event-id>-<n>.webp (max 1200px wide) and prints an `images:` list.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { IMAGE_DIR } from "../lib/events";
import { MAX_IMAGES } from "../lib/schema";
import { USER_AGENT, cleanAuthor, fetchWithRetry, normalizeLicense, thumbFallback, toImageEntry } from "../lib/commons";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const [id, ...titles] = process.argv.slice(2);
if (!id || !titles.length || titles.length > MAX_IMAGES) {
  console.error(`Usage: npm run fetch-image -- <event-id> "File:Title.jpg" ... (1–${MAX_IMAGES} titles)`);
  process.exit(1);
}

type ImageInfo = { thumburl: string; descriptionurl: string; extmetadata?: Record<string, { value: string }> };
type ApiResult = { query?: { pages?: Record<string, { missing?: string; imageinfo?: ImageInfo[] }> } };

async function download(url: string): Promise<Buffer> {
  for (const u of [url, thumbFallback(url)]) {
    const res = await fetch(u, { headers: { "User-Agent": USER_AGENT } });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    if (res.status === 429) await sleep(60000);
  }
  throw new Error(`could not download ${url}`);
}

async function main() {
fs.mkdirSync(IMAGE_DIR, { recursive: true });
const entries = [];
for (const [k, raw] of titles.entries()) {
  const title = raw.startsWith("File:") ? raw : `File:${raw}`;
  if (k > 0) await sleep(5000);
  const api = `https://commons.wikimedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1200`;
  const data = (await fetchWithRetry(fetch, api)) as ApiResult;
  const page = Object.values(data.query?.pages ?? {})[0];
  const info = page?.imageinfo?.[0];
  if (!info) {
    console.error(`✗ ${title}: not found on Commons`);
    continue;
  }
  const license = normalizeLicense(info.extmetadata?.LicenseShortName?.value);
  if (!license) {
    console.error(`✗ ${title}: license "${info.extmetadata?.LicenseShortName?.value}" is not allowed (Public domain, CC0, CC BY, CC BY-SA only)`);
    continue;
  }
  const file = `${id}-${k + 1}.webp`;
  const img = await download(info.thumburl);
  await sharp(img).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(IMAGE_DIR, file));
  entries.push(toImageEntry(file, { author: cleanAuthor(info.extmetadata?.Artist?.value), license, sourceUrl: info.descriptionurl }));
  console.error(`✓ ${title} → ${file} (${license})`);
}

console.log("images:");
for (const e of entries) {
  console.log(`  - file: ${e.file}\n    caption: ${e.caption}\n    alt: ${e.alt}\n    author: ${JSON.stringify(e.author)}\n    license: ${e.license}\n    sourceUrl: ${e.sourceUrl}`);
}
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
