// npm run new-event -- <year> <slug>
// Copies content/events/_template.md to content/events/<year>-<slug>.md as an unverified draft.
import fs from "node:fs";
import path from "node:path";
import { CONTENT_DIR } from "../lib/events";

const [year, slug] = process.argv.slice(2);
if (!year || !slug || !/^-?\d+$/.test(year) || !/^[a-z0-9-]+$/.test(slug)) {
  console.error('Usage: npm run new-event -- <year> <slug>   e.g. npm run new-event -- 1898 independence');
  process.exit(1);
}

const id = `${year}-${slug}`;
const target = path.join(CONTENT_DIR, `${id}.md`);
if (fs.existsSync(target)) {
  console.error(`${path.relative(process.cwd(), target)} already exists. Not overwriting it.`);
  process.exit(1);
}

const template = fs.readFileSync(path.join(CONTENT_DIR, "_template.md"), "utf8");
const draft = template
  .replace("id: YEAR-SLUG", `id: ${id}`)
  .replace("date: { year: YEAR }", `date: { year: ${year} }`)
  .replace(/YEAR-SLUG/g, id);
fs.writeFileSync(target, draft);
console.log(`Created ${path.relative(process.cwd(), target)} (verified: false). Fill it in, then run npm run check.`);
