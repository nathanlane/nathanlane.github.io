import { getCollection } from "astro:content";
import { getAllPosts } from "@/data/post";
import { siteConfig } from "@/site.config";
import { isPublishedEntry } from "@/utils/content";
import { escapeXml } from "@/utils/xml";
import rss from "@astrojs/rss";

export const GET = async () => {
	const posts = await getAllPosts();
	const research = await getCollection("research");
	const writing = (await getCollection("writing")).filter(isPublishedEntry);

	// Combine all content and sort by date
	const allContent = [
		...posts.map((post) => ({
			title: post.data.title,
			description: post.data.description || "",
			pubDate: post.data.publishDate,
			link: `/posts/${post.id}/`,
			content: post.body || "",
			categories: post.data.tags || [],
			customData: `<guid isPermaLink="true">${escapeXml(`${siteConfig.canonicalUrl}/posts/${post.id}/`)}</guid>`,
		})),
		...research.map((item) => ({
			title: item.data.title,
			description: item.data.description || "",
			pubDate: new Date(`${item.data.paperDate}-01-01`), // Convert year to date
			link: `/research/${item.id}/`,
			content: item.body || "",
			categories: item.data.tags || [],
			customData: `<guid isPermaLink="true">${escapeXml(`${siteConfig.canonicalUrl}/research/${item.id}/`)}</guid>`,
		})),
		...writing.map((item) => ({
			title: item.data.title,
			description: item.data.description || "",
			pubDate: item.data.publishDate,
			link: `/writing/${item.id}/`,
			content: item.body || "",
			categories: [], // Writing doesn't have tags
			customData: `<guid isPermaLink="true">${escapeXml(`${siteConfig.canonicalUrl}/writing/${item.id}/`)}</guid>`,
		})),
	].sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

	return rss({
		title: siteConfig.title,
		description: siteConfig.description,
		site: siteConfig.canonicalUrl,
		items: allContent.slice(0, 50), // Latest 50 items
		customData: `
      <language>en-us</language>
      <managingEditor>${siteConfig.email} (${siteConfig.author})</managingEditor>
      <webMaster>${siteConfig.email} (${siteConfig.author})</webMaster>
      <copyright>Copyright ${new Date().getFullYear()} ${siteConfig.author}</copyright>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <generator>Astro</generator>
    `,
		stylesheet: "/rss-styles.xsl", // Optional: we can create this for better browser viewing
	});
};
