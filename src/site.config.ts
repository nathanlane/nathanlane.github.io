import type { SiteConfig } from "@/types";

/**
 * Site Configuration - Single Source of Truth
 *
 * This is the authoritative source for all identity, contact, and site metadata.
 * Other files (index.yaml, about-config.ts) reference this config.
 *
 * To update site-wide information:
 * - Identity: Change author, fullName, jobTitle, organization here
 * - Contact: Change email here
 * - Resources: Change CV, images here
 *
 * These values automatically propagate to:
 * - Homepage (index.astro merges with index.yaml content)
 * - About page (about-config.ts imports this)
 * - SEO metadata (BaseHead.astro, StructuredData.astro)
 * - Navigation (Header.astro, Footer.astro)
 */
export const siteConfig: SiteConfig = {
	// === IDENTITY ===
	author: "Nathan Lane",
	fullName: "Nathan Lane, PhD",
	jobTitle: "Assistant Professor",
	organization: "London School of Economics",
	organizationShort: "LSE",

	// === CONTACT ===
	email: "n.lane@lse.ac.uk",

	// === RESOURCES ===
	resumeUrl: "/cv.pdf",
	profileImage: "/headshot.jpg",
	profileImageFull: "/headshot-full.JPG",
	departmentPage: "https://www.lse.ac.uk/international-development",
	professionalPage: "https://www.lse.ac.uk/people/nathan-lane",

	// === PROFESSIONAL PROFILES ===
	orcid: "0000-0003-0884-8418",
	twitterHandle: "@straightedge",
	socialProfiles: [
		"https://twitter.com/straightedge",
		"https://www.linkedin.com/in/drnathanlane/",
		"https://github.com/nathanlane",
		"https://orcid.org/0000-0003-0884-8418",
	],

	// === SITE METADATA ===
	date: {
		locale: "en-GB",
		options: {
			day: "numeric",
			month: "short",
			year: "numeric",
		},
	},
	description: "Nathan Lane, PhD, Economist and Data Scientist",
	lang: "en-GB",
	ogLocale: "en_GB",
	title: "Nathan Lane, PhD",

	// === DISPLAY OPTIONS ===
	showLogo: true,
	showTitle: false,
	footerText: "🚀 Astro Theme by Nathan Lane",
};

// Social media links used across the site
export const socialLinks: {
	friendlyName: string;
	isWebmention?: boolean;
	link: string;
	name: string;
	showInHero?: boolean; // Control visibility in hero banner
	isDownload?: boolean; // Special flag for download items
}[] = [
	{
		friendlyName: "Github",
		link: "https://github.com/nathanlane",
		name: "lucide:github",
		showInHero: true,
	},
	{
		friendlyName: "Bluesky",
		link: "https://bsky.app/profile/nathanlane.bsky.social",
		name: "lucide:cloud",
		showInHero: false,
	},
	{
		friendlyName: "Twitter",
		link: "https://twitter.com/straightedge",
		name: "lucide:twitter",
		showInHero: false,
	},
	{
		friendlyName: "Hugging Face",
		link: "https://huggingface.co/nathanlane",
		name: "lucide:bot",
		showInHero: false, // Hidden from hero, shows in About page
	},
	{
		friendlyName: "Email",
		link: `mailto:${siteConfig.email}`,
		name: "lucide:mail",
		showInHero: false,
	},
	{
		friendlyName: "CV",
		link: siteConfig.resumeUrl || "/cv.pdf",
		name: "lucide:file-text",
		isDownload: true,
		showInHero: false, // CV appears in header nav, not hero
	},
	{
		friendlyName: "LinkTree",
		link: "https://linktr.ee/nathanlane",
		name: "lucide:link",
		showInHero: false,
	},
	{
		friendlyName: "LinkedIn",
		link: "https://www.linkedin.com/in/drnathanlane/",
		name: "lucide:linkedin",
		showInHero: false,
	},
];

// Used to generate links in both the Header & Footer.
export const menuLinks: { path: string; title: string }[] = [
	{
		path: "/",
		title: "Home",
	},
	{
		path: "/research/",
		title: "Research",
	},
	{
		path: "/writing/",
		title: "Writing",
	},
	{
		path: "/media/",
		title: "Media",
	},
	{
		path: "/about/",
		title: "About",
	},
];
