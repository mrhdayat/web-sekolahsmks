import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel/serverless"; // Menggunakan adapter serverless

// https://astro.build/config
export default defineConfig({
  site: 'https://smksmuhsatui.sch.id', // GANTI DENGAN URL PRODUKSI ANDA
  integrations: [tailwind(), sitemap()],
  output: 'server', // Ubah ke 'server' karena menggunakan adapter serverless
  adapter: vercel({
    webAnalytics: { enabled: true }, // Contoh: aktifkan Vercel Web Analytics
    imageService: true // Mengaktifkan Astro Image Service di Vercel
  }),
  vite: {
    ssr: {
      external: ['@supabase/supabase-js']
    }
  }
});
