import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts
    .filter((post) => !post.data.draft)
    .map((post) => ({
      params: { slug: post.id },
      props: { post },
    }));
}

const fontsDir = path.resolve('src/og/fonts');
const [regularFont, boldFont] = await Promise.all([
  fs.readFile(path.join(fontsDir, 'JetBrainsMono-Regular.ttf')),
  fs.readFile(path.join(fontsDir, 'JetBrainsMono-Bold.ttf')),
]);

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as { post: CollectionEntry<'blog'> };
  const title = post.data.title;
  const date = post.data.date.toISOString().slice(0, 10);
  const author = post.data.author;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          backgroundColor: '#000000',
          color: '#ffffff',
          fontFamily: 'JetBrainsMono',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: '-0.01em',
              },
              children: 'opendata',
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                fontSize: title.length > 60 ? 56 : 64,
                fontWeight: 700,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                maxWidth: '100%',
              },
              children: title,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 22,
                color: '#a3a3a3',
              },
              children: [
                {
                  type: 'div',
                  props: { style: { display: 'flex' }, children: author },
                },
                {
                  type: 'div',
                  props: { style: { display: 'flex' }, children: date },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'JetBrainsMono', data: regularFont, weight: 400, style: 'normal' },
        { name: 'JetBrainsMono', data: boldFont, weight: 700, style: 'normal' },
      ],
    },
  );

  const png = new Resvg(svg).render().asPng();

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
