import {createClient} from '@sanity/client'
import {readFileSync} from 'node:fs'

// Load .env manually
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

function findMissingKeys(value: any, path = ''): string[] {
  const issues: string[] = []
  if (Array.isArray(value)) {
    value.forEach((item, i) => {
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        if (!('_key' in item)) issues.push(`${path}[${i}] (${item._type || '?'})`)
        Object.entries(item).forEach(([k, v]) => {
          if (k.startsWith('_')) return
          issues.push(...findMissingKeys(v, `${path}[${i}].${k}`))
        })
      }
    })
  } else if (value && typeof value === 'object') {
    Object.entries(value).forEach(([k, v]) => {
      if (k.startsWith('_')) return
      issues.push(...findMissingKeys(v, path ? `${path}.${k}` : k))
    })
  }
  return issues
}

async function main() {
  const docs = await client.fetch<any[]>(`*[!(_id in path("drafts.**"))]{ _id, _type, ... }`)
  let total = 0, withIssues = 0
  for (const doc of docs) {
    const issues = findMissingKeys(doc)
    if (issues.length) {
      withIssues++
      console.log(`\n${doc._id} (${doc._type}):`)
      issues.forEach(i => console.log(`  - ${i}`))
      total += issues.length
    }
  }
  console.log(`\n=== ${docs.length} docs scanned · ${withIssues} with issues · ${total} total missing _key ===`)
}
main().catch(e => { console.error(e); process.exit(1) })
