import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/app/lib/seo';
import { getBlogPosts } from '@/app/lib/content/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  // Exclude non-canonical / (which points to /home) 
  // and thin conversion routes (/partner, /training)
  const routes = [
    '/home',
    '/kissan-veer',
    '/about',
    '/contact',
    '/grow-with-us',
    '/ideas-lab',
    '/media-events',
    '/what-we-do',
    '/podcasts',
    '/privacy',
    '/terms',
    '/cookies'
  ];

  const posts = await getBlogPosts();

  const pages: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '/home' ? 1 : 0.8,
  }));

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/media-events/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...pages, ...postPages];
}
