import { MetadataRoute } from 'next';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin'],
      },
    ],
    sitemap: 'https://su-sell.vercel.app/sitemap.xml',
  };
}
