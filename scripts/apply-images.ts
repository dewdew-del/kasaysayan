// npm run apply-images -- manifest.json
// manifest: { "<id>": [["File:Title.jpg", "Caption", "Alt text"], ...] }
// Downloads each allowed-license photo as public/images/events/<id>-<n>.webp,
// writes the images: list into the event file and places {{photo:2}} / {{photo:3}} in the text.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { USER_AGENT, cleanAuthor, fetchWithRetry, normalizeLicense, thumbFallback } from "../lib/commons";
import { CONTENT_DIR as CONTENT, IMAGE_DIR as IMG } from "../lib/events";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const manifest: Record<string, [string, string, string][]> = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));

type Info = { thumburl: string; descriptionurl: string; extmetadata?: Record<string, { value: string }> };

async function download(url: string): Promise<Buffer | null> {
  for (const [i, u] of [url, thumbFallback(url), thumbFallback(url)].entries()) {
    if (i) await sleep(i === 1 ? 5000 : 90000);
    const res = await fetch(u, { headers: { "User-Agent": USER_AGENT } });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
  }
  return null;
}

async function main() {
fs.mkdirSync(IMG, { recursive: true });
for (const [id, list] of Object.entries(manifest)) {
  const file = fs.readdirSync(CONTENT).find((f) => new RegExp(`^e\\d+-${id}\\.md$`).test(f));
  if (!file) { console.log(`✗ ${id}: no event file`); continue; }
  const md = path.join(CONTENT, file);
  let src = fs.readFileSync(md, "utf8");
  if (!/^images: \[\]$/m.test(src)) { console.log(`- ${id}: images already set, skipped`); continue; }
  const out: string[] = [];
  let n = 0;
  for (const [rawTitle, caption, alt] of list) {
    const title = rawTitle.startsWith("File:") ? rawTitle : `File:${rawTitle}`;
    await sleep(6000);
    try {
      const api = `https://commons.wikimedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1200`;
      const data = (await fetchWithRetry(fetch, api)) as { query?: { pages?: Record<string, { imageinfo?: Info[] }> } };
      const info = Object.values(data.query?.pages ?? {})[0]?.imageinfo?.[0];
      if (!info) { console.log(`  ✗ ${title}: not found`); continue; }
      const license = normalizeLicense(info.extmetadata?.LicenseShortName?.value);
      if (!license) { console.log(`  ✗ ${title}: license ${info.extmetadata?.LicenseShortName?.value}`); continue; }
      const buf = await download(info.thumburl);
      if (!buf) { console.log(`  ✗ ${title}: download failed`); continue; }
      const name = `${id}-${++n}.webp`;
      await sharp(buf).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 78 }).toFile(path.join(IMG, name));
      out.push(`  - file: ${name}\n    caption: ${JSON.stringify(caption)}\n    alt: ${JSON.stringify(alt)}\n    author: ${JSON.stringify(cleanAuthor(info.extmetadata?.Artist?.value))}\n    license: ${license}\n    sourceUrl: ${info.descriptionurl}`);
    } catch (e) {
      console.log(`  ✗ ${title}: ${(e as Error).message}`);
    }
  }
  if (!out.length) { console.log(`✗ ${id}: no photos`); continue; }
  src = src.replace(/^images: \[\]$/m, `images:\n${out.join("\n")}`);
  // place photo 2 before the 2nd chapter and photo 3 before the 4th
  const [head, body] = [src.slice(0, src.indexOf("\n---\n", 4) + 5), src.slice(src.indexOf("\n---\n", 4) + 5)];
  let k = 0;
  const placed = body.replace(/^## /gm, (m) => {
    k++;
    if (k === 2 && out.length >= 2) return `{{photo:2}}\n\n## `;
    if (k === 4 && out.length >= 3) return `{{photo:3}}\n\n## `;
    return m;
  });
  fs.writeFileSync(md, head + placed);
  console.log(`✓ ${id}: ${out.length} photos`);
}
console.log("DONE");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
