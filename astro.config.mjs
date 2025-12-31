import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.SITE_URL || 'https://example.com',
  output: 'static', // static output is ideal for Cloudflare Pages
  integrations: []
});