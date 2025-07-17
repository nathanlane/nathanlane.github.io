import { getAllPosts } from "@/data/post";

export const GET = async () => {
  const posts = await getAllPosts();
  
  // Filter out draft posts
  const publishedPosts = posts.filter(post => !post.data.draft);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${publishedPosts.map(post => `  <url>
    <loc>${import.meta.env.SITE}posts/${post.id}/</loc>
    <lastmod>${(post.data.updatedDate || post.data.publishDate).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}; 