#!/usr/bin/env node

import { $ } from "zx";
import { exec } from "child_process";
import { writeFile } from "./lib";
import consola from 'consola';

async function main() {
  let isInstalled = false;
  try {
    await $`cspell --version`;
    isInstalled = true;
  } catch (error) {
    console.error(
      "cSpell is not installed. Please install with your package manager.",
    );
    // Print hint to console with cmd: npm install -g cspell@latest
    console.info("Hint: npm install -g cspell@latest");
  }
}

// Extract project name from current directory
const dirname = await $`pwd`;
const projectName = String(dirname.stdout.split("/").slice(-1)[0]).trim();

// Create cspell.json configuration file
const cSpellContent = {
  $schema:
    "https://raw.githubusercontent.com/streetsidesoftware/cspell/main/cspell.schema.json",
  version: "0.2",
  language: "en",
  globRoot: ".",
  dictionaryDefinitions: [
    {
      name: projectName,
      path: `./${projectName}.txt`,
      addWords: true,
    },
  ],
  dictionaries: [projectName],
  ignorePaths: ["node_modules", `/${projectName}.txt`],
};

// Create a project-name.txt file with the project name
writeFile(`./${projectName}.txt`, "");
  const projectName = await consola.prompt("What is your project name?", {
    placeholder: "Not sure",
    initial: "java",
  });

  const confirmed = await consola.prompt("Do you want to continue?", {
    type: "confirm",
  });

  if (!confirmed) {
    process.exit(0);
  }

  const projectType = await consola.prompt("Pick a project type.", {
    type: "select",
    options: [
      "md",
      "ts",
      "json",
    ],
  });

  const tools = await consola.prompt("Select additional tools.", {
    type: "multiselect",
    required: false,
    options: [
      { value: "eslint", label: "ESLint", hint: "recommended" },
      { value: "prettier", label: "Prettier" },
      { value: "gh-action", label: "GitHub Action" },
    ],
  });

  consola.start("Creating project...");

  const cmd = `${
    isInstalled ? "" : "npx "
  }cspell --words-only --unique --no-progress --show-context "**/**/*.${projectType}"`;
  const unknownWords = await new Promise<string[]>((resolve) => {
    exec(cmd, (error: any, stdout: string) => {
      if (error) {
        console.error(`Error running cspell: ${error}`);
      }

      const words = stdout ? stdout.split("\n").filter((word: any) => word) : [];
      resolve(words);
    });
  });

  console.log(`Found ${unknownWords.length} unknown words.`);

  // Save unknown words in project-name.txt
  writeFile(`./${projectName}.txt`, unknownWords.join("\n"));
  console.log("cSpell setup completed.");
  process.exit(0);
}

main();
