import {createClient} from '@sanity/client'
import {readFileSync} from 'node:fs'

try {
  const env = readFileSync('.env', 'utf8')
  env.split('\n').forEach(line => {
    const m = line.match(/^([A-Z_]+)=(.*)$/)
    if (m) process.env[m[1]] = m[2]
  })
} catch {}

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2026-04-29',
  useCdn: false,
})

function makeKey() {
  return Math.random().toString(36).slice(2, 14)
}

// Add _key to any object inside an array that's missing one
function patchMissingKeys(value: any): any {
  if (Array.isArray(value)) {
    return value.map(item => {
      if (item && typeof item === 'object' && !Array.isArray(item) && !('_key' in item)) {
        return { _key: makeKey(), ...patchObject(item) }
      }
      return Array.isArray(item) ? patchMissingKeys(item) : (item && typeof item === 'object' ? patchObject(item) : item)
    })
  }
  return value
}

function patchObject(obj: any): any {
  const out: any = {}
  for (const [k, v] of Object.entries(obj)) {
    out[k] = Array.isArray(v) ? patchMissingKeys(v) : (v && typeof v === 'object' ? patchObject(v) : v)
  }
  return out
}

async function main() {
  const doc = await client.getDocument('homePage')
  if (!doc) { console.log('homePage doc not found'); return }
  const patched = patchObject(doc)
  
  // Show what would change
  const before = JSON.stringify(doc, null, 2)
  const after = JSON.stringify(patched, null, 2)
  if (before === after) { console.log('No changes needed'); return }
  
  console.log('Patching homePage with new _key values...')
  await client.createOrReplace(patched as any)
  console.log('✓ homePage patched')
}
main().catch(e => { console.error(e); process.exit(1) })
