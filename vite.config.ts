import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

function normalizeSiteUrl(value?: string) {
  if (!value) return ''
  const withProtocol = /^https?:\/\//.test(value) ? value : `https://${value}`
  return withProtocol.replace(/\/$/, '')
}

function seoFiles(siteUrl: string): Plugin {
  return {
    name: 'portfolio-seo-files',
    generateBundle() {
      const sitemapLine = siteUrl ? `\nSitemap: ${siteUrl}/sitemap.xml` : ''
      this.emitFile({
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /${sitemapLine}\n`,
        type: 'asset',
      })

      if (!siteUrl) return

      this.emitFile({
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${siteUrl}/es</loc></url>
  <url><loc>${siteUrl}/en</loc></url>
</urlset>
`,
        type: 'asset',
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = normalizeSiteUrl(
    env.VITE_SITE_URL ||
      process.env.VITE_SITE_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      process.env.VERCEL_URL,
  )

  return {
    define: {
      'import.meta.env.VITE_SITE_URL': JSON.stringify(siteUrl),
    },
    plugins: [react(), tailwindcss(), seoFiles(siteUrl)],
  }
})
