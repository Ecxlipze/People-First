import type { MetadataRoute } from 'next';
import { getBaseUrl } from '@/app/lib/seo';
import { getBlogPosts } from '@/app/lib/content/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  // Only canonical, indexable routes: omit redirects, the CMS, and the
  // noindex conversion routes (/partner, /training).
  const routes = [
    '/',
    '/home',
    '/kissan-veer',
    '/about',
    '/contact',
    '/grow-with-us',
    '/ideas-lab',
    '/media-events',
    '/what-we-do',
    '/podcasts',
    '/gallery',
    '/privacy',
    '/terms',
    '/cookies'
  ];

  const posts = await getBlogPosts();

  const pages: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    // These pages have no reliable content timestamp. Build time, file mtime,
    // and request time do not represent their last significant content change.
    changeFrequency: 'weekly',
    priority: route === '/home' ? 1 : 0.8,
  }));

  const postPages: MetadataRoute.Sitemap = posts.map((post) => {
    const updatedAt = post.updatedAt ? new Date(post.updatedAt) : undefined;
    return {
      url: `${baseUrl}/media-events/${post.slug}`,
      // Keep the CMS timestamp; an invalid/missing value must not break XML
      // generation or be replaced with a fabricated current date.
      ...(updatedAt && Number.isFinite(updatedAt.getTime()) ? { lastModified: updatedAt } : {}),
      changeFrequency: 'monthly',
      priority: 0.6,
    };
  });

  return [...pages, ...postPages];
}
