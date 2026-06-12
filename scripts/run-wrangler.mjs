import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const minimumMajor = 22;
const currentMajor = Number.parseInt(process.versions.node.split(".")[0] ?? "0", 10);
const wranglerBin = join(process.cwd(), "node_modules", "wrangler", "bin", "wrangler.js");
const codexNode = join(
  process.env.USERPROFILE ?? "",
  ".cache",
  "codex-runtimes",
  "codex-primary-runtime",
  "dependencies",
  "node",
  "bin",
  "node.exe",
);

if (!existsSync(wranglerBin)) {
  console.error("Wrangler is not installed. Run npm install first.");
  process.exit(1);
}

const nodeExecutable = currentMajor >= minimumMajor ? process.execPath : codexNode;

if (!existsSync(nodeExecutable)) {
  console.error(`Wrangler requires Node.js v${minimumMajor}.0.0 or newer. Current Node.js is ${process.version}.`);
  console.error("Run `nvm install 22` and `nvm use 22`, then try again.");
  process.exit(1);
}

const result = spawnSync(nodeExecutable, [wranglerBin, ...process.argv.slice(2)], {
  stdio: "inherit",
  shell: false,
});

process.exit(result.status ?? 1);
