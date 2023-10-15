import{$ as D} from"zx";import{exec as L} from"child_process";import{writeFileSync as K} from"node:fs";function B(q,A){K(q,A)}var E=!1;try{await D`cspell --version`,E=!0}catch(q){console.error("cSpell is not installed. Please install with your package manager."),console.info("Hint: npm install -g cspell@latest")}var M=await D`pwd`,g=String(M.stdout.split("/").slice(-1)[0]).trim(),O={$schema:"https://raw.githubusercontent.com/streetsidesoftware/cspell/main/cspell.schema.json",version:"0.2",language:"en",globRoot:".",dictionaryDefinitions:[{name:g,path:`./${g}.txt`,addWords:!0}],dictionaries:[g],ignorePaths:["node_modules",`/${g}.txt`]};B(`./${g}.txt`,"");B("./cspell.json",JSON.stringify(O,null,2));var Q=(E?"":"npx ")+'cspell --words-only --unique --no-progress --show-context "**/*.md" "**/*.ts" "**/*.json"',G=await new Promise((q)=>{L(Q,(A,C)=>{if(A)console.error(`Error running cspell: ${A}`);const H=C?C.split("\n").filter((J)=>J):[];q(H)})});console.log(`Found ${G.length} unknown words.`);B(`./${g}.txt`,G.join("\n"));console.log("cSpell setup completed.");process.exit(0);
