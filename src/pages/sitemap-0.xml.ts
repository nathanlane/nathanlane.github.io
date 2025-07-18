export const GET = async () => {
  // Static pages that should be included in sitemap
  const staticPages = [
    {
      url: "",
      lastmod: new Date().toISOString(),
      changefreq: "monthly",
      priority: "1.0",
    },
    {
      url: "about/",
      lastmod: new Date().toISOString(),
      changefreq: "monthly",
      priority: "0.9",
    },
    {
      url: "research/",
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority: "0.9",
    },
    {
      url: "writing/",
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority: "0.8",
    },
    {
      url: "posts/",
      lastmod: new Date().toISOString(),
      changefreq: "daily",
      priority: "0.8",
    },
    {
      url: "projects/",
      lastmod: new Date().toISOString(),
      changefreq: "monthly",
      priority: "0.7",
    },
    {
      url: "notes/",
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority: "0.6",
    },
    {
      url: "media/",
      lastmod: new Date().toISOString(),
      changefreq: "monthly",
      priority: "0.7",
    },
    {
      url: "tags/",
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority: "0.5",
    },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (page) => `  <url>
    <loc>${import.meta.env.SITE}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
};
