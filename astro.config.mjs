import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://blog.mbimagari.autos',
  output: 'static',
  markdown: {
    shikiConfig: {
      theme: 'github-dark'
    }
  }
});
