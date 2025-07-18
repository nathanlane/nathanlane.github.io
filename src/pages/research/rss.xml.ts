import { getCollection } from "astro:content";
import { siteConfig } from "@/site.config";
import rss from "@astrojs/rss";

export const GET = async () => {
  const research = await getCollection("research");

  // Sort by paper date (most recent first)
  const sortedResearch = research.sort(
    (a, b) =>
      Number.parseInt(b.data.paperDate) - Number.parseInt(a.data.paperDate),
  );

  return rss({
    title: `${siteConfig.title} - Research Papers`,
    description:
      "Academic research papers, working papers, and reports on economic development, state formation, and computational methods.",
    site: import.meta.env.SITE,
    items: sortedResearch.map((item) => ({
      title: item.data.title,
      description: item.data.description,
      pubDate: new Date(`${item.data.paperDate}-01-01`),
      link: `/research/${item.id}/`,
      content: item.body || "",
      categories: item.data.tags || [],
      customData: `
        <guid isPermaLink="true">${import.meta.env.SITE}/research/${item.id}/</guid>
        <dc:creator xmlns:dc="http://purl.org/dc/elements/1.1/">${item.data.authors}</dc:creator>
        <status>${item.data.status}</status>
        <type>${item.data.type}</type>
        ${item.data.publication ? `<publication>${item.data.publication}</publication>` : ""}
      `,
    })),
    customData: `
      <language>en-us</language>
      <managingEditor>${siteConfig.email} (${siteConfig.author})</managingEditor>
      <webMaster>${siteConfig.email} (${siteConfig.author})</webMaster>
      <copyright>Copyright ${new Date().getFullYear()} ${siteConfig.author}</copyright>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <generator>Astro</generator>
      <category>Academic Research</category>
    `,
    stylesheet: "/rss-styles.xsl",
  });
};
