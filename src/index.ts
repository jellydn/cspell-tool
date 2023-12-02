#!/usr/bin/env node
import consola from "consola";

import { helpCommand, initCommand, versionCommand, writeFile } from "./lib";

if (process.argv.includes("--version")) {
  await versionCommand();
}

if (process.argv.includes("help")) {
  helpCommand();
  process.exit(0);
}

let manual = false;

if (process.argv.includes("init")) {
  manual = true;
}

const { projectName, unknownWords } = await initCommand(manual);

// Save unknown words in project-name.txt
writeFile(`./${projectName}.txt`, unknownWords.join("\n"));
consola.success("cSpell setup completed. Please review the unknown words.");
process.exit(0);
