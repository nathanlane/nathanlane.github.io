const postBodyField = { label: "Body", name: "body", widget: "markdown" };

const postFields = [
	{ label: "Title", name: "title", widget: "string" },
	{ label: "Description", name: "description", widget: "text" },
	{ label: "Publish Date", name: "publishDate", widget: "datetime" },
	{ label: "Updated Date", name: "updatedDate", widget: "datetime", required: false },
	{ label: "Slug", name: "slug", widget: "string", required: false },
	{ label: "Tags", name: "tags", widget: "list", default: [] },
	{ label: "Draft", name: "draft", widget: "boolean", default: false },
	{ label: "Series ID", name: "seriesId", widget: "string", required: false },
	{
		label: "Order In Series",
		name: "orderInSeries",
		widget: "number",
		required: false,
		value_type: "int",
	},
	{ label: "OG Image", name: "ogImage", widget: "string", required: false },
	postBodyField,
];

const standardPageFields = [
	{ label: "Title", name: "title", widget: "string" },
	{ label: "Description", name: "description", widget: "text" },
	{
		label: "Header Description",
		name: "headerDescription",
		widget: "text",
		required: false,
	},
	{
		label: "Header Additional Info",
		name: "headerAdditionalInfo",
		widget: "text",
		required: false,
	},
	{ label: "Show Photo", name: "showPhoto", widget: "boolean", default: false },
	{
		label: "Sections",
		name: "sections",
		widget: "list",
		required: false,
		fields: [
			{ label: "Title", name: "title", widget: "string" },
			{ label: "ID", name: "id", widget: "string", required: false },
		],
	},
	postBodyField,
];

export const researchStatusOptions = ["work-in-progress", "working-paper", "published", "archived"];

export const researchTypeOptions = ["paper", "report", "chapter"];

export const mediaTypeOptions = [
	"interview",
	"podcast",
	"video",
	"article",
	"press",
	"talk",
	"panel",
];

export const sharedBooleanDefaults = {
	draft: false,
	featured: false,
	showPhoto: false,
};

export const cmsConfigDefinition = {
	backend: {
		name: "github",
		repo: "nathanlane/nathanlane.github.io",
		branch: "main",
	},
	local_backend: true,
	media_folder: "public/images/uploads",
	public_folder: "/images/uploads",
	collections: [
		{
			name: "posts",
			label: "Blog Posts",
			folder: "src/content/post",
			create: true,
			slug: "{{slug}}",
			extension: "md",
			format: "frontmatter",
			fields: postFields,
		},
		{
			name: "posts_mdx",
			label: "Blog Posts (MDX)",
			folder: "src/content/post",
			create: false,
			slug: "{{slug}}",
			extension: "mdx",
			format: "frontmatter",
			fields: postFields,
		},
		{
			name: "research",
			label: "Research",
			folder: "src/content/research",
			create: true,
			slug: "{{slug}}",
			extension: "md",
			format: "frontmatter",
			fields: [
				{ label: "Title", name: "title", widget: "string" },
				{ label: "Description", name: "description", widget: "text" },
				{ label: "Slug", name: "slug", widget: "string", required: false },
				{ label: "Paper Year", name: "paperDate", widget: "string", hint: "YYYY" },
				{ label: "Authors", name: "authors", widget: "string" },
				{ label: "Publication", name: "publication", widget: "string", required: false },
				{
					label: "Status",
					name: "status",
					widget: "select",
					options: researchStatusOptions,
					default: researchStatusOptions[1],
				},
				{
					label: "Type",
					name: "type",
					widget: "select",
					options: researchTypeOptions,
					default: researchTypeOptions[0],
				},
				{ label: "Download URL", name: "download", widget: "string", required: false },
				{ label: "External Link", name: "link", widget: "string", required: false },
				{ label: "OG Image", name: "ogImage", widget: "string", required: false },
				{ label: "Canonical URL", name: "canonical", widget: "string", required: false },
				{ label: "Featured", name: "featured", widget: "boolean", default: false },
				{ label: "Tags", name: "tags", widget: "list", default: [] },
				postBodyField,
			],
		},
		{
			name: "writing",
			label: "Writing",
			folder: "src/content/writing",
			create: true,
			slug: "{{slug}}",
			extension: "md",
			format: "frontmatter",
			fields: [
				{ label: "Title", name: "title", widget: "string" },
				{ label: "Description", name: "description", widget: "text" },
				{ label: "Publish Date", name: "publishDate", widget: "datetime" },
				{ label: "Slug", name: "slug", widget: "string", required: false },
				{ label: "Draft", name: "draft", widget: "boolean", default: false },
				{ label: "Featured", name: "featured", widget: "boolean", default: false },
				{ label: "Genre", name: "genre", widget: "string", required: false },
				{ label: "Word Count", name: "wordCount", widget: "number", required: false },
				{ label: "OG Image", name: "ogImage", widget: "string", required: false },
				postBodyField,
			],
		},
		{
			name: "media",
			label: "Media",
			folder: "src/content/media",
			create: true,
			slug: "{{slug}}",
			extension: "md",
			format: "frontmatter",
			fields: [
				{ label: "Title", name: "title", widget: "string" },
				{ label: "Outlet", name: "outlet", widget: "string" },
				{ label: "Date", name: "date", widget: "datetime" },
				{
					label: "Type",
					name: "type",
					widget: "select",
					options: mediaTypeOptions,
					default: mediaTypeOptions[0],
				},
				{ label: "Link", name: "link", widget: "string" },
				{ label: "Description", name: "description", widget: "text", required: false },
				postBodyField,
			],
		},
		{
			name: "pages",
			label: "Pages",
			files: [
				{
					label: "About",
					name: "about",
					file: "src/content/pages/about.mdx",
					format: "frontmatter",
					fields: standardPageFields,
				},
				{
					label: "Posts",
					name: "posts",
					file: "src/content/pages/posts.mdx",
					format: "frontmatter",
					fields: standardPageFields,
				},
				{
					label: "Research",
					name: "research",
					file: "src/content/pages/research.mdx",
					format: "frontmatter",
					fields: standardPageFields,
				},
				{
					label: "Writing",
					name: "writing",
					file: "src/content/pages/writing.mdx",
					format: "frontmatter",
					fields: standardPageFields,
				},
				{
					label: "Writing Archive",
					name: "writingArchive",
					file: "src/content/pages/writing-archive.mdx",
					format: "frontmatter",
					fields: standardPageFields,
				},
				{
					label: "Media",
					name: "media",
					file: "src/content/pages/media.mdx",
					format: "frontmatter",
					fields: standardPageFields,
				},
			],
		},
		{
			name: "homepage",
			label: "Homepage",
			files: [
				{
					label: "Homepage",
					name: "homepage",
					file: "src/content/pages/homepage.mdx",
					format: "frontmatter",
					fields: [
						{ label: "Title", name: "title", widget: "string" },
						{ label: "Description", name: "description", widget: "text" },
						{
							label: "Secondary Affiliation",
							name: "secondaryAffiliation",
							widget: "object",
							required: false,
							fields: [
								{ label: "Title", name: "title", widget: "string" },
								{ label: "Role", name: "role", widget: "string" },
							],
						},
						{
							label: "Contact Links",
							name: "contactLinks",
							widget: "list",
							required: false,
							fields: [
								{ label: "Label", name: "label", widget: "string" },
								{ label: "URL", name: "href", widget: "string" },
								{ label: "Display Text", name: "text", widget: "string" },
							],
						},
						postBodyField,
					],
				},
			],
		},
	],
};
