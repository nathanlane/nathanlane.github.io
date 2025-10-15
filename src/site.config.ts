import type { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
	// Used as both a meta property (src/components/BaseHead.astro L:31 + L:49) & the generated satori png (src/pages/og-image/[slug].png.ts)
	author: "Nathan Lane",
	// Date.prototype.toLocaleDateString() parameters, found in src/utils/date.ts.
	date: {
		locale: "en-GB",
		options: {
			day: "numeric",
			month: "short",
			year: "numeric",
		},
	},
	// Used as the default description meta property and webmanifest description
	description: "Nathan Lane, PhD, Economist and Data Scientist",
	// HTML lang property, found in src/layouts/Base.astro L:18 & astro.config.ts L:48
	lang: "en-GB",
	// Meta property, found in src/components/BaseHead.astro L:42
	ogLocale: "en_GB",
	// Used to construct the meta title property found in src/components/BaseHead.astro L:11, and webmanifest name found in astro.config.ts L:42
	title: "Nathan Lane, PhD",
	// Control visibility of the logo icon in header - set to false to hide
	showLogo: false,
	// Control visibility of the site title text in header - set to false to hide
	showTitle: false,
	// Resume PDF link - update filename as needed
	resumeUrl: "/cv.pdf",
	// Primary email address
	email: "n.lane@lse.ac.uk",
	// Footer branding text - customize or set to empty string to hide
	footerText: "🚀 Astro Theme by Nathan Lane",
	// SEO and structured data fields
	jobTitle: "Assistant Professor",
	organization: "London School of Economics",
	profileImage: "/headshot.jpg",
	twitterHandle: "@straightedge",
	orcid: "0000-0003-0884-8418",
	socialProfiles: [
		"https://twitter.com/straightedge",
		"https://www.linkedin.com/in/drnathanlane/",
		"https://github.com/nathanlane",
		"https://orcid.org/0000-0003-0884-8418",
	],
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
		path: "/about/",
		title: "About",
	},
	{
		path: "/projects/",
		title: "Projects",
	},
];
