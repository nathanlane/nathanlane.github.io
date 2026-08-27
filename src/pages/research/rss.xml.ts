import { getCollection } from "astro:content";
import { siteConfig } from "@/site.config";
import { feedContent } from "@/utils/markdown";
import { escapeXml } from "@/utils/xml";
import rss from "@astrojs/rss";

export const GET = async () => {
	const research = await getCollection("research");

	// Sort by paper date (most recent first)
	const sortedResearch = research.sort(
		(a, b) => Number.parseInt(b.data.paperDate) - Number.parseInt(a.data.paperDate),
	);

	const items = await Promise.all(
		sortedResearch.map(async (item) => ({
			title: item.data.title,
			description: item.data.description,
			pubDate: new Date(`${item.data.paperDate}-01-01`),
			link: `/research/${item.id}/`,
			content: await feedContent(item.body, item.filePath, item.data.description),
			categories: item.data.tags || [],
			customData: `
        <dc:creator xmlns:dc="http://purl.org/dc/elements/1.1/">${escapeXml(item.data.authors)}</dc:creator>
        <status>${escapeXml(item.data.status)}</status>
        <type>${escapeXml(item.data.type)}</type>
        ${item.data.publication ? `<publication>${escapeXml(item.data.publication)}</publication>` : ""}
      `,
		})),
	);

	// The newest item's date, not the build time. lastBuildDate means "when the
	// channel last changed", so deriving it from the content keeps rebuilds of an
	// unchanged site byte-identical.
	const lastBuildDate = new Date(items[0]?.pubDate ?? 0).toUTCString();

	return rss({
		title: `${siteConfig.title} - Research Papers`,
		description:
			"Academic research papers, working papers, and reports on economic development, state formation, and computational methods.",
		site: siteConfig.canonicalUrl,
		items,
		customData: `
      <language>${siteConfig.lang}</language>
      <managingEditor>${escapeXml(siteConfig.email ?? "")} (${escapeXml(siteConfig.author)})</managingEditor>
      <webMaster>${escapeXml(siteConfig.email ?? "")} (${escapeXml(siteConfig.author)})</webMaster>
      <copyright>Copyright ${new Date().getFullYear()} ${escapeXml(siteConfig.author)}</copyright>
      <lastBuildDate>${lastBuildDate}</lastBuildDate>
      <generator>Astro</generator>
      <category>Academic Research</category>
    `,
		stylesheet: "/rss-styles.xsl",
	});
};
