export interface SiteConfig {
	author: string;
	date: {
		locale: string | string[] | undefined;
		options: Intl.DateTimeFormatOptions;
	};
	description: string;
	lang: string;
	ogLocale: string;
	title: string;
	showLogo?: boolean;
	showTitle?: boolean;
	footerText?: string;
	resumeUrl?: string;
	email?: string;
	// SEO and structured data fields
	jobTitle?: string;
	organization?: string;
	socialProfiles?: string[];
	profileImage?: string;
	orcid?: string;
	twitterHandle?: string;
}

// Collection item base type matching Astro's collection structure
export interface CollectionItemBase {
	id: string;
	collection: string;
	data: {
		slug: string;
		title: string;
		description?: string;
		publishDate?: Date;
		updatedDate?: Date;
		draft?: boolean;
		featured?: boolean;
		tags?: string[];
		type?: string;
		// Additional fields that may exist on different collection types
		status?: string;
		genre?: string;
		wordCount?: number;
		[key: string]: unknown;
	};
}

// Structured data types
export interface StructuredDataProps {
	type: 'website' | 'article' | 'person' | 'breadcrumb';
	data?: StructuredDataContent;
}

export interface StructuredDataContent {
	// For articles
	title?: string;
	description?: string;
	url?: string;
	publishDate?: string;
	updatedDate?: string;
	tags?: string[];
	minutesRead?: number;
	ogImage?: string;
	// For breadcrumbs
	items?: BreadcrumbItem[];
	// Allow for additional schema properties
	[key: string]: unknown;
}

export interface BreadcrumbItem {
	name: string;
	url: string;
}

// Base layout structured data type
export interface LayoutStructuredData {
	type: 'article' | 'breadcrumb';
	data: StructuredDataContent;
}

export interface PaginationLink {
	srLabel?: string;
	text?: string;
	url: string;
}

export interface SiteMeta {
	articleDate?: string | undefined;
	description?: string;
	ogImage?: string | undefined;
	title: string;
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
