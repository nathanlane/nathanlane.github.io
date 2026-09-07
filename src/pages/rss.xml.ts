import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import { getAllPosts } from "@/data/post";
import { siteConfig } from "@/site.config";
import { isPublishedEntry } from "@/utils/content";
import { feedContent } from "@/utils/markdown";
import { toAbsoluteUrl } from "@/utils/url";
import { escapeXml } from "@/utils/xml";

export const GET = async () => {
	const posts = await getAllPosts();
	const research = await getCollection("research");
	const writing = (await getCollection("writing")).filter(isPublishedEntry);

	// Combine all content and sort by date
	const allContent = await Promise.all([
		...posts.map(async (post) => {
			const link = `/posts/${post.id}/`;
			return {
				title: post.data.title,
				description: post.data.description || "",
				pubDate: post.data.publishDate,
				link,
				content: await feedContent(
					post.body,
					post.filePath,
					post.data.description || "",
					toAbsoluteUrl(link, siteConfig.canonicalUrl) ?? link,
				),
				categories: post.data.tags || [],
			};
		}),
		...research.map(async (item) => {
			const link = `/research/${item.id}/`;
			return {
				title: item.data.title,
				description: item.data.description || "",
				pubDate: new Date(`${item.data.paperDate}-01-01`), // Convert year to date
				link,
				content: await feedContent(
					item.body,
					item.filePath,
					item.data.description || "",
					toAbsoluteUrl(link, siteConfig.canonicalUrl) ?? link,
				),
				categories: item.data.tags || [],
			};
		}),
		...writing.map(async (item) => {
			const link = `/writing/${item.id}/`;
			return {
				title: item.data.title,
				description: item.data.description || "",
				pubDate: item.data.publishDate,
				link,
				content: await feedContent(
					item.body,
					item.filePath,
					item.data.description || "",
					toAbsoluteUrl(link, siteConfig.canonicalUrl) ?? link,
				),
				categories: [], // Writing doesn't have tags
			};
		}),
	]);

	const sorted = allContent.sort(
		(a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
	);

	// The newest item's date, not the build time. lastBuildDate means "when the
	// channel last changed", so deriving it from the content keeps rebuilds of an
	// unchanged site byte-identical.
	const lastBuildDate = new Date(sorted[0]?.pubDate ?? 0).toUTCString();

	return rss({
		title: siteConfig.title,
		description: siteConfig.description,
		site: siteConfig.canonicalUrl,
		items: sorted.slice(0, 50), // Latest 50 items
		customData: `
      <language>${siteConfig.lang}</language>
      <managingEditor>${escapeXml(siteConfig.email ?? "")} (${escapeXml(siteConfig.author)})</managingEditor>
      <webMaster>${escapeXml(siteConfig.email ?? "")} (${escapeXml(siteConfig.author)})</webMaster>
      <copyright>Copyright ${new Date().getFullYear()} ${escapeXml(siteConfig.author)}</copyright>
      <lastBuildDate>${lastBuildDate}</lastBuildDate>
      <generator>Astro</generator>
    `,
		stylesheet: "/rss-styles.xsl",
	});
};
