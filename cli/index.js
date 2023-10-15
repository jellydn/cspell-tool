#!/usr/bin/env node
import{$ as B} from"zx";
import{exec as K} from"child_process";
import{writeFileSync as J} from"node:fs";
import process from 'process';

function y(g,q){J(g,q)}

function getFileTypesFromArgs() {
  return process.argv.filter(arg => arg.startsWith('**/**.'));
}

var D=!1;
try{
  await B`cspell --version`,D=!0
}catch(g){
  console.error("cSpell is not installed. Please install with your package manager."),
  console.info("Hint: npm install -g cspell@latest")
}
var L=await B`pwd`,
b=String(L.stdout.split("/").slice(-1)[0]).trim(),
M={$schema:"https://raw.githubusercontent.com/streetsidesoftware/cspell/main/cspell.schema.json",version:"0.2",language:"en",globRoot:".",dictionaryDefinitions:[{name:b,path:`./${b}.txt`,addWords:!0}],dictionaries:[b],ignorePaths:["node_modules",`/${b}.txt`]};
y(`./${b}.txt`,"");
y("./cspell.json",JSON.stringify(M,null,2));
var fileTypes = getFileTypesFromArgs().join(' '),
O=`${D?"":"npx "}cspell --words-only --unique --no-progress --show-context ${fileTypes}`,
E=await new Promise((g)=>{K(O,(q,A)=>{if(q)console.error(`Error running cspell: ${q}`);const G=A?A.split("\n").filter((H)=>H):[];g(G)})});
console.log(`Found ${E.length} unknown words.`);
y(`./${b}.txt`,E.join("\n"));
console.log("cSpell setup completed.");
process.exit(0);
