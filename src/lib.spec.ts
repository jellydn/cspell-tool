import { writeFileSync } from 'node:fs'
import consola from 'consola'
import { writeFile, helpCommand, versionCommand } from './lib'
import { describe, it, expect, vi } from 'vitest'

vi.mock('node:fs')
vi.mock('consola')
vi.mock('../package.json', () => ({ version: '1.2.3' }))

describe('writeFile', () => {
  it('should write string content to a file', () => {
    writeFile('test.txt', 'Hello, World!')
    expect(writeFileSync).toHaveBeenCalledWith('test.txt', 'Hello, World!')
  })

  it('should write Uint8Array content to a file', () => {
    const content = new Uint8Array([72, 101, 108, 108, 111])
    writeFile('test.txt', content)
    expect(writeFileSync).toHaveBeenCalledWith('test.txt', content)
  })
})

describe('helpCommand', () => {
  it('should print the help message to the console', () => {
    helpCommand()
    expect(consola.info).toHaveBeenCalledWith(
      expect.stringContaining('Usage: cspell-tool'),
    )
  })
})

describe('versionCommand', () => {
  it('should print the version to the console', async () => {
    await versionCommand()
    expect(consola.info).toHaveBeenCalledWith('cspell-tool version: 1.2.3')
  })
})
