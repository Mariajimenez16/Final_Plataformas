// // astro.config.mjs
// import { defineConfig } from 'astro/config';
// import cloudflare from '@astrojs/cloudflare';

// export default defineConfig({
//   output: 'hybrid',       // <-- clave: SSR + SSG mezclados
//   adapter: cloudflare({
//     platformProxy: { enabled: true }
//   }),
// });

// astro.config.mjs
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'static',
  adapter: cloudflare({
    platformProxy: { enabled: true }
  }),
});