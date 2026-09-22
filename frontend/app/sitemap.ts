import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/app/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();

  // Exclude non-canonical / (which points to /home) 
  // and thin conversion routes (/partner, /training)
  const routes = [
    '/home',
    '/about',
    '/contact',
    '/grow-with-us',
    '/ideas-lab',
    '/insights',
    '/what-we-do',
    '/podcasts',
    '/privacy',
    '/terms',
    '/cookies'
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '/home' ? 1 : 0.8,
  }));
}
