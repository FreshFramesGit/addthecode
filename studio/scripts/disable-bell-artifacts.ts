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
  // Patch BOTH published + draft if exists
  const ids = ['case-bell', 'drafts.case-bell']
  for (const id of ids) {
    const doc = await client.getDocument(id)
    if (!doc) { console.log(`${id}: not found, skipping`); continue }
    
    // Find artifactGalleryBlock in content[] and set enabled:false
    const content = (doc as any).content || []
    let patchedCount = 0
    const newContent = content.map((block: any) => {
      if (block?._type === 'artifactGalleryBlock') {
        patchedCount++
        return { ...block, enabled: false }
      }
      return block
    })
    
    if (patchedCount === 0) { console.log(`${id}: no artifactGalleryBlock found`); continue }
    
    await client.patch(id).set({ content: newContent }).commit()
    console.log(`✓ ${id}: ${patchedCount} artifactGalleryBlock(s) disabled`)
  }
}
main().catch(e => { console.error(e); process.exit(1) })
