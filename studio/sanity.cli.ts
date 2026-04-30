import { defineCliConfig } from 'sanity/cli'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'PLACEHOLDER'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  studioHost: process.env.SANITY_STUDIO_STUDIO_HOST || '',
  deployment: {
    appId: 'dbshxl32gziv4o2kq7kgj2l0',
    autoUpdates: true,
  },
  /**
   * TypeGen: genereert TypeScript types vanuit de schema's.
   * Scant GROQ queries in zowel studio als astro-app bestanden.
   * Output gaat naar astro-app zodat de frontend type-safe queries kan schrijven.
   *
   * Run: `cd studio && npm run typegen`
   */
  typegen: {
    path: '../astro-app/src/**/*.{ts,tsx,astro}',
    generates: '../astro-app/src/types/sanity.ts',
    overloadClientMethods: true,
  },
})
