import { exec } from "child_process";
import consola from "consola";
import { writeFileSync } from "node:fs";
import { $ } from "zx";

const fileTypesOptions = [
  { value: "md", label: "Markdown" },
  { value: "ts", label: "TypeScript" },
  { value: "tsx", label: "TypeScript React" },
  { value: "json", label: "JSON" },
  { value: "y*ml", label: "YAML" },
  { value: "lua", label: "Lua" },
  { value: "py", label: "Python" },
  { value: "go", label: "Go" },
  { value: "mod", label: "Go Module" },
  { value: "rs", label: "Rust" },
  { value: "java", label: "Java" },
  { value: "js", label: "JavaScript" },
  { value: "jsx", label: "JavaScript React" },
  { value: "css", label: "CSS" },
  { value: "toml", label: "TOML" },
];

export function writeFile(
  filePath: string | URL,
  content: string | Uint8Array,
) {
  // Write file to disk
  writeFileSync(filePath, content);
}

/**
 * Show the help message
 */
export function helpCommand() {
  consola.info(`
    Usage: cspell-tool [command] [options]
    Commands:
      init        Create a cspell.json configuration file manually
    Options:
      --version   Print cspell-tool version
      --help      Print usage information
  `);
}

/**
 * Show the version of cspell-tool
 */
export async function versionCommand() {
  // Get version from package.json and print to console
  const pkg = await import("../package.json");

  consola.info(`cspell-tool version: ${pkg.version}`);
}

/**
 * Run initial command
 * @param isManual - Whether the command is run manually
 */
export async function initCommand(isManual = false) {
  let isInstalled = false;
  try {
    await $`cspell --version`;
    isInstalled = true;
  } catch {
    consola.warn(
      "cSpell is not installed. Please install with your package manager.",
    );
    // Print hint to console with cmd: npm install -g cspell@latest
    consola.info("Hint: npm install -g cspell@latest");
  }

  // Ask the user for the project name
  const projectName = isManual
    ? await consola.prompt("Enter project name", {
        type: "text",
        placeholder: "Your project name",
        initial: "cspell-tool",
      })
    : "cspell-tool";

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
    ignorePaths: ["node_modules", "dist", "build", `/${projectName}.txt`],
  };

  // Create a project-name.txt file with the project name
  writeFile(`./${projectName}.txt`, "");
  writeFile("./cspell.json", JSON.stringify(cSpellContent, null, 2));

  // Ask the user if they want to use the default file types
  const useDefaultFileTypes = isManual
    ? await consola.prompt(
        "Use default file types (md, ts, tsx, json, yaml, lua, css)?",
        {
          type: "confirm",
          options: [
            { value: true, label: "Yes" },
            { value: false, label: "No" },
          ],
        },
      )
    : true;

  let fileTypes: string[];
  if (useDefaultFileTypes) {
    fileTypes = fileTypesOptions.map((option) => option.value);
  } else {
    // Ask the user for the file types they want to check
    fileTypes = (await consola.prompt("Select file types to check.", {
      type: "multiselect",
      options: fileTypesOptions,
    })) as unknown as string[];
  }

  const cspellCmd = isInstalled ? "cspell" : "npx cspell";
  // Run cspell on the selected file types to get unknown words
  const cmd = `${cspellCmd} --words-only --unique --no-progress --show-context ${fileTypes
    .map((fileType) => `"**/**/*.${fileType}"`)
    .join(" ")}`;
  const unknownWords = await new Promise<string[]>((resolve) => {
    consola.start("Running cSpell...");
    exec(cmd, (error: any, stdout: string) => {
      if (error) {
        consola.error(error);
      }

      const words = stdout
        ? stdout.split("\n").filter((word: any) => word)
        : [];
      resolve(words);
    });
  });

  consola.log(`Found ${unknownWords.length} unknown words.`);

  return {
    projectName,
    unknownWords,
  };
}
