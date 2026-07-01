// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

import tailwindcss from '@tailwindcss/vite';

const SITE = 'https://www.opendata.dev';

// The docs live on a separate Mintlify deployment proxied under /docs (see
// vercel.json), so Astro never sees those routes and can't add them to the
// sitemap on its own. List the canonical docs URLs here so crawlers and agents
// can discover the full documentation surface from a single sitemap.
const DOCS_PAGES = [
  'docs',
  'docs/llms.txt',
  'docs/llms-full.txt',
  'docs/overview/architecture',
  'docs/overview/writing-data',
  'docs/overview/reading-data',
  'docs/overview/storage',
  'docs/overview/deployment',
  'docs/timeseries',
  'docs/timeseries/quickstart',
  'docs/timeseries/storage-design',
  'docs/timeseries/configuration',
  'docs/timeseries/ingest',
  'docs/timeseries/production',
  'docs/timeseries/benchmarks',
  'docs/log',
  'docs/log/quickstart',
  'docs/log/storage-design',
  'docs/log/production',
  'docs/log/benchmarks',
  'docs/vector',
  'docs/vector/quickstart',
  'docs/vector/data-model',
  'docs/vector/configuration',
  'docs/vector/storage-design',
  'docs/vector/production',
  'docs/vector/benchmarks',
  'docs/buffer',
  'docs/buffer/architecture',
  'docs/buffer/configuration',
  'docs/buffer/integrations',
  'docs/buffer/benchmarks',
  // OpenAPI 3.1 specs (served as raw YAML by the docs deploy). Listed so the
  // machine-readable API surface is discoverable straight from the sitemap
  // rather than only from inside the JS-rendered docs.
  'docs/openapi/timeseries.yaml',
  'docs/openapi/log.yaml',
  'docs/openapi/vector.yaml',
].map((p) => `${SITE}/${p}`);

const AGENT_PAGES = [
  'llms.txt',
  'agents.md',
  'install.sh',
].map((p) => `${SITE}/${p}`);

// https://astro.build/config
export default defineConfig({
  site: SITE,
  integrations: [mdx(), sitemap({ customPages: [...DOCS_PAGES, ...AGENT_PAGES] })],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'prepend',
          properties: { className: ['heading-anchor'], ariaLabel: 'Link to this section' },
          content: {
            type: 'element',
            tagName: 'svg',
            properties: {
              xmlns: 'http://www.w3.org/2000/svg',
              viewBox: '0 0 24 24',
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: '2',
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              ariaHidden: 'true',
            },
            children: [
              {
                type: 'element',
                tagName: 'path',
                properties: {
                  d: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71',
                },
                children: [],
              },
              {
                type: 'element',
                tagName: 'path',
                properties: {
                  d: 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
                },
                children: [],
              },
            ],
          },
        },
      ],
    ],
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
