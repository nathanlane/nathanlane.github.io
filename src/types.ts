/**
 * Main site configuration object.
 * Used throughout the site for metadata, navigation, and SEO.
 * This is the single source of truth for all identity and contact data.
 */
export interface SiteConfig {
	/** Canonical public site URL used for metadata, feeds, and SEO */
	canonicalUrl: string;

	/** Additional supported origins that should continue serving the same static site */
	supportedOrigins: string[];

	/** Default OG/social card asset path */
	defaultSocialCardPath: string;

	/** GitHub repository used for local CMS configuration */
	cmsRepo: string;

	/** Default branch used for local CMS configuration */
	cmsBranch: string;

	// === IDENTITY ===

	/** Site author name - short form (e.g., 'Nathan Lane') */
	author: string;

	/** Full formal name with credentials (e.g., 'Nathan Lane, PhD') */
	fullName?: string;

	/** Job title for display and structured data (e.g., 'Assistant Professor') */
	jobTitle?: string;

	/** Full organization name (e.g., 'London School of Economics') */
	organization?: string;

	/** Short organization name (e.g., 'LSE') */
	organizationShort?: string;

	// === CONTACT ===

	/** Primary email address for contact and structured data */
	email?: string;

	// === RESOURCES ===

	/** URL path to CV/resume PDF (e.g., '/cv.pdf') */
	resumeUrl?: string;

	/** Path to standard profile image (e.g., '/headshot.jpg') */

	/** Path to full-size profile image (e.g., '/headshot-full.JPG') */
	profileImageFull?: string;

	/** URL to department/institution page (e.g., 'https://www.lse.ac.uk/international-development') */
	departmentPage?: string;

	/** URL to personal professional page (e.g., 'https://www.lse.ac.uk/people/nathan-lane') */
	professionalPage?: string;

	// === PROFESSIONAL PROFILES ===

	/** ORCID identifier for academic profiles (e.g., '0000-0003-0884-8418') */
	orcid?: string;

	/** Twitter handle for social media cards (e.g., '@straightedge') */
	twitterHandle?: string;

	/** Array of social media profile URLs for structured data */
	socialProfiles?: string[];

	// === SITE METADATA ===

	/** Date formatting configuration for blog posts and metadata */
	date: {
		/** Locale string (e.g., 'en-GB', 'en-US') for date formatting */
		locale: string | string[] | undefined;
		/** Intl.DateTimeFormat options for date display */
		options: Intl.DateTimeFormatOptions;
	};

	/** Default meta description for SEO - shown in search results */
	description: string;

	/** HTML lang attribute (e.g., 'en-GB') for accessibility and SEO */
	lang: string;

	/** OpenGraph locale (e.g., 'en_GB') for social media sharing */
	ogLocale: string;

	/** Site title - used in <title> tags, meta properties, and header */
	title: string;

	// === DISPLAY OPTIONS ===

	/** Whether to show the logo icon in the header */
	showLogo?: boolean;

	/** Whether to show the site title text in the header */
	showTitle?: boolean;

	/** Footer branding text - customize or set to empty string to hide */
	footerText?: string;
}

// Collection item base type matching Astro's collection structure
export interface CollectionItemBase {
	id: string;
	collection: string;
	data: {
		title: string;
		description?: string;
		publishDate?: Date;
		updatedDate?: Date | undefined;
		draft?: boolean;
		featured?: boolean;
		tags?: string[];
		type?: string;
		// Additional fields that may exist on different collection types
		status?: string;
		genre?: string | undefined;
		wordCount?: number | undefined;
		[key: string]: unknown;
	};
}

// Structured data types
export interface StructuredDataProps {
	type: "website" | "article" | "person" | "breadcrumb";
	data?: StructuredDataContent | BreadcrumbData;
}

export interface StructuredDataContent {
	// For articles
	title?: string | undefined;
	description?: string | undefined;
	url?: string | undefined;
	publishDate?: string | undefined;
	updatedDate?: string | undefined;
	tags?: string[] | undefined;
	ogImage?: string | undefined;
	// For breadcrumbs
	items?: BreadcrumbItem[] | undefined;
	// Allow for additional schema properties
	[key: string]: unknown;
}

export interface BreadcrumbItem {
	name: string;
	url: string;
}

// Base layout structured data type
export interface LayoutStructuredData {
	type: "article" | "breadcrumb";
	data: StructuredDataContent | BreadcrumbData;
}

// Specific data type for breadcrumbs
export interface BreadcrumbData {
	items: BreadcrumbItem[];
}

export interface PaginationLink {
	srLabel?: string;
	text?: string;
	url: string;
}

// Astro pagination type for paginate() function result
export interface Page<T = unknown> {
	data: T[];
	start: number;
	end: number;
	size: number;
	total: number;
	currentPage: number;
	lastPage: number;
	url: {
		current: string;
		next?: string;
		prev?: string;
	};
}

export interface SiteMeta {
	articleDate?: string | undefined;
	description?: string;
	ogImage?: string | undefined;
	title: string;
	/** True when the page renders LaTeX math; loads the self-hosted KaTeX stylesheet. */
	hasMath?: boolean | undefined;
}

/** Webmentions */
export interface WebmentionsFeed {
	children: WebmentionsChildren[];
	name: string;
	type: string;
}

export interface WebmentionsCache {
	children: WebmentionsChildren[];
	lastFetched: null | string;
}

export interface WebmentionsChildren {
	author: Author | null;
	content?: Content | null;
	"mention-of": string;
	name?: null | string;
	photo?: null | string[];
	published?: null | string;
	rels?: Rels | null;
	summary?: Summary | null;
	syndication?: null | string[];
	type: string;
	url: string;
	"wm-id": number;
	"wm-private": boolean;
	"wm-property": string;
	"wm-protocol": string;
	"wm-received": string;
	"wm-source": string;
	"wm-target": string;
}

export interface Author {
	name: string;
	photo: string;
	type: string;
	url: string;
}

export interface Content {
	"content-type": string;
	html: string;
	text: string;
	value: string;
}

export interface Rels {
	canonical: string;
}

export interface Summary {
	"content-type": string;
	value: string;
}

export type AdmonitionType = "tip" | "note" | "important" | "caution" | "warning";

export interface Badge {
	variant?:
		| "default"
		| "accent"
		| "accent-base"
		| "accent-one"
		| "accent-two"
		| "muted"
		| "outline";
	showHash?: boolean;
	title: string;
}
