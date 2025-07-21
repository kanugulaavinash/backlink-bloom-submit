
import { useEffect } from 'react';
import { getAllPosts } from '@/data/blogPosts';

interface SitemapUrl {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

const generateSitemap = async (): Promise<string> => {
  const baseUrl = 'https://backlinkbloom.com';
  const urls: SitemapUrl[] = [];

  // Static pages
  const staticPages = [
    { url: '/', priority: 1.0, changefreq: 'daily' as const },
    { url: '/blog', priority: 0.9, changefreq: 'daily' as const },
    { url: '/signin', priority: 0.3, changefreq: 'monthly' as const },
    { url: '/signup', priority: 0.3, changefreq: 'monthly' as const },
  ];

  urls.push(...staticPages);

  try {
    // Dynamic blog posts
    const posts = await getAllPosts();
    posts.forEach(post => {
      urls.push({
        url: `/blog/post/${post.id}`,
        lastmod: post.publishedAt,
        changefreq: 'weekly',
        priority: 0.8
      });
    });

    // Categories
    const categories = Array.from(new Set(posts.map(post => post.category)));
    categories.forEach(category => {
      urls.push({
        url: `/blog/category/${encodeURIComponent(category)}`,
        changefreq: 'weekly',
        priority: 0.7
      });
    });

  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ url, lastmod, changefreq, priority }) => `  <url>
    <loc>${baseUrl}${url}</loc>
    ${lastmod ? `<lastmod>${new Date(lastmod).toISOString().split('T')[0]}</lastmod>` : ''}
    ${changefreq ? `<changefreq>${changefreq}</changefreq>` : ''}
    ${priority ? `<priority>${priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};

const SitemapGenerator = () => {
  useEffect(() => {
    const generateAndDownload = async () => {
      try {
        const sitemapXML = await generateSitemap();
        
        // Create a blob and download link for development
        const blob = new Blob([sitemapXML], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        
        // Log the sitemap content for debugging
        console.log('Generated sitemap:', sitemapXML);
        
        // In a real application, you would send this to your server
        // to write it to public/sitemap.xml
        
      } catch (error) {
        console.error('Error generating sitemap:', error);
      }
    };

    // Generate sitemap on component mount (for development)
    generateAndDownload();
  }, []);

  return null;
};

export default SitemapGenerator;
