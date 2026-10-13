import { MetadataRoute } from 'next';
import { getAllWallpapers, CATEGORIES } from '@/lib/wallpapers';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const wallpapers = getAllWallpapers();

  const wallpaperUrls: MetadataRoute.Sitemap = wallpapers.map((item) => ({
    url: `${baseUrl}/wallpaper/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const categoryUrls: MetadataRoute.Sitemap = CATEGORIES.filter((c) => c.slug).map((c) => ({
    url: `${baseUrl}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...categoryUrls,
    ...wallpaperUrls,
  ];
}
