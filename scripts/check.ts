// npm run check: validates every event file and lists the drafts still waiting for fact-checking.
// Exits with code 1 if any file has an error, so CI and the build stop on bad content.
import { loadAllEvents } from "../lib/events";

const { events, unverified, errors } = loadAllEvents();

if (errors.length) {
  console.error(`\n${errors.length} error(s):`);
  for (const e of errors) console.error(`  ✗ ${e}`);
}
if (unverified.length) {
  console.log(`\nNot verified yet (hidden from the site):`);
  for (const id of unverified) console.log(`  • ${id}`);
}
console.log(`\n${events.length} published, ${unverified.length} unverified${errors.length ? `, ${errors.length} error(s)` : ""}`);
process.exit(errors.length ? 1 : 0);
