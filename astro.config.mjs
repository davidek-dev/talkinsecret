import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwind from '@astrojs/tailwind';

import alpinejs from '@astrojs/alpinejs';

import netlify from '@astrojs/netlify';

import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({

 
  publicDir: 'public/',
  outDir: 'dist/',
  site: 'https://talkinsecret.com/',
  build:{
    format:'file',
  },
  integrations: [react(), tailwind(), alpinejs(), mdx(), sitemap()],
  output: 'hybrid',
  adapter: netlify(),
  
});