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

async function main() {
  const docs = await client.fetch<any[]>(`*[_type == "case" && slug.current == "bell"]{ _id, _type, title, ... }`)
  console.log(`Found ${docs.length} bell case docs (incl. drafts):`)
  for (const doc of docs) {
    console.log(`\n=== ${doc._id} ===`)
    // Show top-level fields with null/missing values
    const nullFields: string[] = []
    function walk(obj: any, path = '') {
      if (obj === null || obj === undefined) {
        nullFields.push(path || '(root)')
        return
      }
      if (typeof obj !== 'object') return
      if (Array.isArray(obj)) {
        obj.forEach((item, i) => walk(item, `${path}[${i}]`))
        return
      }
      for (const [k, v] of Object.entries(obj)) {
        if (k.startsWith('_')) continue
        const p = path ? `${path}.${k}` : k
        if (v === null) {
          nullFields.push(p)
        } else if (typeof v === 'object') {
          walk(v, p)
        }
      }
    }
    walk(doc)
    console.log('Null fields:')
    nullFields.forEach(f => console.log(`  - ${f}`))
  }
}
main().catch(e => { console.error(e); process.exit(1) })
