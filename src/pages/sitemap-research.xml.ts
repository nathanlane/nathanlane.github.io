import { getCollection } from "astro:content";

export const GET = async () => {
	const research = await getCollection("research");

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${research
	.map(
		(item) => `  <url>
    <loc>${import.meta.env.SITE}research/${item.id}/</loc>
    <lastmod>${new Date(`${item.data.paperDate}-01-01`).toISOString()}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>${item.data.status === "published" ? "0.9" : "0.7"}</priority>
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
