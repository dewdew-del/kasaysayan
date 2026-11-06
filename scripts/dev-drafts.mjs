// npm run dev:drafts — local dev server that also shows unverified drafts (marked "Draft").
// Works on Windows too, where "SHOW_DRAFTS=1 next dev" doesn't.
import { spawn } from "node:child_process";

const child = spawn("npx", ["next", "dev", ...process.argv.slice(2)], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, SHOW_DRAFTS: "1" },
});
child.on("exit", (code) => process.exit(code ?? 0));
