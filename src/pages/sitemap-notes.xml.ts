import { getCollection } from "astro:content";

export const GET = async () => {
  const notes = await getCollection("note");

  // Filter out draft notes
  const publishedNotes = notes.filter((note) => !note.data.draft);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${publishedNotes
  .map(
    (note) => `  <url>
    <loc>${import.meta.env.SITE}notes/${note.id}/</loc>
    <lastmod>${note.data.publishDate.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
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
