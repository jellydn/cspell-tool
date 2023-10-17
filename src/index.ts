#!/usr/bin/env node

import { exec } from 'child_process'
import consola from 'consola'
import { $ } from 'zx'

import { writeFile } from './lib'

let isInstalled = false
try {
  await $`cspell --version`
  isInstalled = true
} catch {
  consola.warn(
    'cSpell is not installed. Please install with your package manager.'
  )
  // Print hint to console with cmd: npm install -g cspell@latest
  consola.info('Hint: npm install -g cspell@latest')
}

// Ask the user for the project name
const projectName = await consola.prompt('Enter project name', {
  type: 'text',
  placeholder: 'Your project name',
  initial: 'cspell-tool',
})

// Create cspell.json configuration file
const cSpellContent = {
  $schema:
    'https://raw.githubusercontent.com/streetsidesoftware/cspell/main/cspell.schema.json',
  version: '0.2',
  language: 'en',
  globRoot: '.',
  dictionaryDefinitions: [
    {
      name: projectName,
      path: `./${projectName}.txt`,
      addWords: true,
    },
  ],
  dictionaries: [projectName],
  ignorePaths: ['node_modules', 'dist', 'build', `/${projectName}.txt`],
}

// Create a project-name.txt file with the project name
writeFile(`./${projectName}.txt`, '')
writeFile('./cspell.json', JSON.stringify(cSpellContent, null, 2))

// Ask the user if they want to use the default file types
// Define the file types as a constant array
const fileTypes = ['md', 'ts', 'tsx', 'json', 'lua']

// Create a mapping between file type extensions and their descriptive names
const fileTypeDescriptions = {
  'md': 'Markdown',
  'ts': 'TypeScript',
  'tsx': 'TypeScript React',
  'json': 'JSON',
  'lua': 'Lua',
}

const useDefaultFileTypes = await consola.prompt(`Use default file types (${fileTypes.join(', ')})?`, {
  type: 'confirm',
  options: [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' },
  ],
})

let selectedFileTypes: string[]
if (useDefaultFileTypes) {
  selectedFileTypes = fileTypes
} else {
  // Ask the user for the file types they want to check
  // Use the mapping to generate the options for the multiselect prompt
  selectedFileTypes = await consola.prompt('Select file types to check.', {
    type: 'multiselect',
    options: fileTypes.map(fileType => ({ value: fileType, label: fileTypeDescriptions[fileType] })),
  }) as unknown as string[]
}

const cspellCmd = isInstalled ? 'cspell' : 'npx cspell'
// Run cspell on the selected file types to get unknown words
const cmd = `${cspellCmd} --words-only --unique --no-progress --show-context ${fileTypes
  .map((fileType) => `"**/**/*.${fileType}"`)
  .join(' ')}`
const unknownWords = await new Promise<string[]>((resolve) => {
  consola.start('Running cSpell...')
  exec(cmd, (error: any, stdout: string) => {
    if (error) {
      consola.error(error)
    }

    const words = stdout ? stdout.split('\n').filter((word: any) => word) : []
    resolve(words)
  })
})

consola.log(`Found ${unknownWords.length} unknown words.`)

// Save unknown words in project-name.txt
writeFile(`./${projectName}.txt`, unknownWords.join('\n'))
consola.success('cSpell setup completed. Please review the unknown words.')
process.exit(0)
