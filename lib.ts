import { writeFileSync } from "node:fs";

export function writeFile(
  filePath: string | URL,
  content: string | Uint8Array,
) {
  // Write file to disk
  writeFileSync(filePath, content);
}
