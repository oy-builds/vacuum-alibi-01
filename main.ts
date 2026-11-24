// The Vacuum's Alibi — writes the vacuum's one-line excuse to /output/entry.txt.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

// Read the entry text, failing with one clear line instead of a stack trace.
function readEntry(): string {
  const candidates = [join(here, "entry.txt"), join(process.cwd(), "entry.txt")];
  for (const path of candidates) {
    try {
      return readFileSync(path, "utf8");
    } catch {
      // try the next location
    }
  }
  console.error("error: entry.txt not found next to main.ts or in the working directory");
  process.exit(1);
}

const line = readEntry();

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, line, "utf8");

// Read back what landed on disk; a truncated or corrupted write must fail
// loudly here instead of being silently judged.
const written = readFileSync(outPath, "utf8");
if (written !== line) {
  console.error("error: written output does not match entry.txt");
  process.exit(1);
}
