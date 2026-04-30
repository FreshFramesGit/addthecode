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
  const subs = await client.fetch('*[_type == "newsletterSubscription"] | order(subscribedAt desc) [0..2] { _id, email, source, brevoSyncStatus, subscribedAt }')
  console.log('Recent subscriptions:', JSON.stringify(subs, null, 2))
  const inquiries = await client.fetch('*[_type == "inquiry"] | order(receivedAt desc) [0..2] { _id, name, email, topic, status, receivedAt }')
  console.log('Recent inquiries:', JSON.stringify(inquiries, null, 2))
}
main().catch(e => { console.error(e); process.exit(1) })
