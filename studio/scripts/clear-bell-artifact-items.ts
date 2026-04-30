import {createClient} from '@sanity/client'
import {readFileSync} from 'node:fs'
try {
  const env = readFileSync('.env', 'utf8')
  env.split('\n').forEach(line => { const m = line.match(/^([A-Z_]+)=(.*)$/); if (m) process.env[m[1]] = m[2] })
} catch {}
const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2026-04-29', useCdn: false,
})

async function main() {
  for (const id of ['case-bell', 'drafts.case-bell']) {
    const doc = await client.getDocument(id)
    if (!doc) { console.log(`${id}: not found`); continue }
    const content = ((doc as any).content || []).map((block: any) => {
      if (block?._type === 'artifactGalleryBlock') {
        return { ...block, items: [] }  // leeg items array → geen null images
      }
      return block
    })
    await client.patch(id).set({ content }).commit()
    console.log(`✓ ${id}: artifactGalleryBlock items cleared`)
  }
}
main().catch(e => { console.error(e); process.exit(1) })
