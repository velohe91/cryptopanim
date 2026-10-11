/**
 * Checks that every sprite path in the catalog exists and matches AVATAR_FRAME.
 * Frame size must stay in sync with types/avatar.ts and the sprite generator.
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const FRAME = { width: 990, height: 990 };
const catalog = readFileSync(join(root, "lib", "avatar", "catalog.ts"), "utf8");

const paths = [...catalog.matchAll(/["'](\/assets\/[^"']+\.png)["']/g)].map((match) => match[1]);
const ids = [...catalog.matchAll(/\bid:\s*"([^"]+)"/g)].map((match) => match[1]);

let failed = 0;

if (paths.length === 0) {
  console.error("No /assets paths found in lib/avatar/catalog.ts");
  failed++;
}

const uniquePaths = [...new Set(paths)];
for (const assetPath of uniquePaths) {
  const file = join(root, "public", assetPath.replace(/^\/+/, ""));
  if (!existsSync(file)) {
    console.error(`Missing ${assetPath}`);
    failed++;
    continue;
  }
  const buf = readFileSync(file);
  const png = buf[0] === 137 && buf.toString("ascii", 1, 4) === "PNG";
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  if (!png || width !== FRAME.width || height !== FRAME.height) {
    console.error(`Bad sprite ${assetPath} (${width}×${height})`);
    failed++;
  }
}

const idCounts = new Map();
for (const id of ids) idCounts.set(id, (idCounts.get(id) ?? 0) + 1);
for (const [id, count] of idCounts) {
  if (count > 1) {
    console.error(`Duplicate catalog id: ${id}`);
    failed++;
  }
}

if (failed > 0) process.exit(1);
console.log(`OK ${uniquePaths.length} sprites, ${ids.length} catalog ids`);
