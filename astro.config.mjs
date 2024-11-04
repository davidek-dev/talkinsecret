import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwind from '@astrojs/tailwind';

import alpinejs from '@astrojs/alpinejs';

import netlify from '@astrojs/netlify';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  publicDir: 'public/',
  outDir: 'dist/',
  site: 'https://talkinsecret.netlify.app/',
  redirects:{

  },
  build:{
    format:'file',
  },


  integrations: [react(), tailwind(), alpinejs(), mdx()],
  output: 'static',
  adapter: netlify()
});