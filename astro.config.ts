import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import robotsTxt from "astro-robots-txt";
import webmanifest from "astro-webmanifest";
import { defineConfig, envField } from "astro/config";
import { siteConfig } from "./src/site.config";

// Remark plugins
import remarkDirective from "remark-directive"; /* handle ::: directives as nodes */
import remarkMath from "remark-math"; /* handle LaTeX math syntax */
import { remarkAdmonitions } from "./src/plugins/remark-admonitions"; /* add admonitions */
import { remarkMathDetect } from "./src/plugins/remark-math-detect"; /* flag pages that use math */
import { remarkReadingTime } from "./src/plugins/remark-reading-time";

// Rehype plugins
import rehypeExternalLinks from "rehype-external-links";
import rehypeKatex from "rehype-katex"; /* render LaTeX math with KaTeX */
import rehypeUnwrapImages from "rehype-unwrap-images";

import { transformerMetaHighlight, transformerNotationDiff } from "@shikijs/transformers";
import rehypePrettyCode from "rehype-pretty-code";

process.env.BROWSERSLIST_IGNORE_OLD_DATA ??= "1";

// https://astro.build/config
export default defineConfig({
	/**
	 * Tags were previously used verbatim as URL segments, so tags containing a space or a
	 * slash produced live URLs like /tags/best%20practices/ and a nested /tags/ci/cd/.
	 * Those tags are now slugs; these redirects keep the published URLs working.
	 */
	redirects: {
		"/tags/best practices": "/tags/best-practices",
		"/tags/color theory": "/tags/color-theory",
		"/tags/ibm plex": "/tags/ibm-plex",
		"/tags/static sites": "/tags/static-sites",
		"/tags/web development": "/tags/web-development",
		"/tags/web performance": "/tags/web-performance",
		"/tags/ci/cd": "/tags/ci-cd",
		// merged into static-sites
		"/tags/static-site": "/tags/static-sites",
	},
	image: {
		domains: ["webmention.io"],
	},
	integrations: [
		icon({
			iconDir: "src/icons",
			svgoOptions: {
				plugins: [
					{
						name: "preset-default",
						params: {
							overrides: {
								removeViewBox: false,
							},
						},
					},
				],
			},
		}),
		sitemap({
			filter: (page) => !page.includes("/admin") && !page.includes("/og-image/"),
		}),
		mdx(),
		robotsTxt({
			policy: [
				{
					userAgent: "*",
					allow: "/",
					disallow: ["/admin", "/admin/"],
				},
			],
		}),
		webmanifest({
			// See: https://github.com/alextim/astro-lib/blob/main/packages/astro-webmanifest/README.md
			/**
			 * required
			 **/
			name: siteConfig.title,
			/**
			 * optional
			 **/
			// short_name: "Lane_Site",
			description: siteConfig.description,
			lang: siteConfig.lang,
			icon: "public/icon.svg", // the source for generating favicon & icons
			icons: [
				{
					src: "icons/apple-touch-icon.png", // used in src/components/BaseHead.astro L:26
					sizes: "180x180",
					type: "image/png",
				},
				{
					src: "icons/icon-192.png",
					sizes: "192x192",
					type: "image/png",
				},
				{
					src: "icons/icon-512.png",
					sizes: "512x512",
					type: "image/png",
				},
			],
			start_url: "/",
			background_color: "#1d1f21",
			theme_color: "#2bbc8a",
			display: "standalone",
			config: {
				insertFaviconLinks: false,
				insertThemeColorMeta: false,
				insertManifestLink: false,
			},
		}),
	],
	markdown: {
		syntaxHighlight: false,
		// Enable smartypants for better typography (Tim Brown principle)
		smartypants: true,

		remarkPlugins: [
			remarkReadingTime,
			remarkDirective,
			remarkMath,
			remarkMathDetect,
			remarkAdmonitions,
		],
		remarkRehype: {
			footnoteLabelProperties: {
				className: [""],
			},
			footnoteBackContent: "⤴",
		},

		rehypePlugins: [
			[
				rehypeExternalLinks,
				{
					rel: ["nofollow", "noreferrer"],
					target: "_blank",
				},
			],

			[
				rehypePrettyCode,
				{
					theme: {
						light: "rose-pine-dawn", // after changing the theme, the server needs to be restarted
						dark: "rose-pine", // after changing the theme, the server needs to be restarted
					},

					transformers: [transformerNotationDiff(), transformerMetaHighlight()],
				},
			],
			rehypeKatex, // Render LaTeX math with KaTeX
			rehypeUnwrapImages,
		],
	},
	// https://docs.astro.build/en/guides/prefetch/
	prefetch: true,
	site: siteConfig.canonicalUrl,
	vite: {
		build: {
			sourcemap: false, // Disabled for production security
			rollupOptions: {
				onwarn(warning, defaultHandler) {
					if (
						warning.code === "UNUSED_EXTERNAL_IMPORT" &&
						typeof warning.message === "string" &&
						warning.message.includes("@astrojs/internal-helpers/remote")
					) {
						return;
					}

					defaultHandler(warning);
				},
			},
		},
		optimizeDeps: {
			exclude: ["@resvg/resvg-js"],
		},
	},
	env: {
		schema: {
			WEBMENTION_API_KEY: envField.string({
				context: "server",
				access: "secret",
				optional: true,
			}),
			WEBMENTION_URL: envField.string({
				context: "client",
				access: "public",
				optional: true,
			}),
			WEBMENTION_PINGBACK: envField.string({
				context: "client",
				access: "public",
				optional: true,
			}),
		},
	},
	server: {
		// port: 1234,
		host: true,
	},
});
