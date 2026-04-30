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
    if (!doc) { console.log(`${id}: NOT FOUND\n`); continue }
    console.log(`=== ${id} ===`)
    console.log(`_updatedAt: ${(doc as any)._updatedAt}`)
    
    // Find artifactGalleryBlock
    const content = (doc as any).content || []
    content.forEach((block: any, i: number) => {
      if (block?._type === 'artifactGalleryBlock') {
        const itemsWithNullImage = (block.items || []).filter((it: any) => !it.image).length
        console.log(`  content[${i}] artifactGalleryBlock: enabled=${block.enabled}, items=${block.items?.length || 0}, itemsWithoutImage=${itemsWithNullImage}`)
      }
    })
    
    // Look for ANY null fields in items[].image
    function findNullImage(value: any, path = ''): string[] {
      const issues: string[] = []
      if (Array.isArray(value)) {
        value.forEach((item, i) => {
          if (item && typeof item === 'object') {
            issues.push(...findNullImage(item, `${path}[${i}]`))
          }
        })
      } else if (value && typeof value === 'object') {
        for (const [k, v] of Object.entries(value)) {
          if (k.startsWith('_')) continue
          if (k === 'image' && v === null) issues.push(`${path}.${k}`)
          if (typeof v === 'object') issues.push(...findNullImage(v, path ? `${path}.${k}` : k))
        }
      }
      return issues
    }
    const nullImages = findNullImage(doc)
    console.log(`  null image fields: ${nullImages.length}`)
    nullImages.slice(0, 8).forEach(p => console.log(`    - ${p}`))
    console.log()
  }
}
main().catch(e => { console.error(e); process.exit(1) })
