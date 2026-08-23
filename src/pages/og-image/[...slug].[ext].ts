import fs from "node:fs";
import path from "node:path";
// Using fontsource fonts for OG image generation
import { getCollection } from "astro:content";
import { getAllPosts } from "@/data/post";
import { isPublishedEntry } from "@/utils/content";
import { getFormattedDate } from "@/utils/date";
import { ogMarkup } from "@/utils/og";
import { Resvg } from "@resvg/resvg-js";
import type { APIContext, InferGetStaticPropsType } from "astro";
import satori, { type SatoriOptions } from "satori";

// Load Inter fonts for OG images (using WOFF for Satori compatibility)
const interRegular = fs.readFileSync(
	path.resolve("./node_modules/@fontsource/inter/files/inter-latin-400-normal.woff"),
);
const interBold = fs.readFileSync(
	path.resolve("./node_modules/@fontsource/inter/files/inter-latin-700-normal.woff"),
);

const ogOptions: SatoriOptions = {
	// debug: true,
	fonts: [
		{
			data: interRegular,
			name: "Inter",
			style: "normal",
			weight: 400,
		},
		{
			data: interBold,
			name: "Inter",
			style: "normal",
			weight: 700,
		},
	],
	height: 630,
	width: 1200,
};

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

function formatOgDate(value: Date | string) {
	if (typeof value === "string" && /^\d{4}$/.test(value)) {
		return value;
	}

	return getFormattedDate(value instanceof Date ? value : new Date(value), {
		month: "long",
		weekday: "long",
	});
}

function createStaticImageEntries(slug: string, title: string, dateLabel: string) {
	return [
		{
			params: { slug, ext: "png" },
			props: { dateLabel, title },
		},
		{
			params: { slug, ext: "svg" },
			props: { dateLabel, title },
		},
	];
}

export async function GET(context: APIContext) {
	const { dateLabel, title } = context.props as Props;
	const svg = await satori(ogMarkup(title, dateLabel), ogOptions);

	// Check if user is requesting PNG
	if (context.url.pathname.endsWith(".png")) {
		const pngBytes = new Resvg(svg).render().asPng();
		const pngBuffer = pngBytes.buffer.slice(
			pngBytes.byteOffset,
			pngBytes.byteOffset + pngBytes.byteLength,
		) as ArrayBuffer;
		return new Response(pngBuffer, {
			headers: {
				"Cache-Control": "public, max-age=31536000, immutable",
				"Content-Type": "image/png",
			},
		});
	}

	// Check if user is requesting SVG
	if (context.url.pathname.endsWith(".svg")) {
		return new Response(svg, {
			headers: {
				"Cache-Control": "public, max-age=31536000",
				"Content-Type": "image/svg+xml; charset=utf-8",
			},
		});
	}

	// If request doesn't end with .png or .svg, return error
	return new Response("Unsupported format", { status: 400 });
}

export async function getStaticPaths() {
	const posts = await getAllPosts();
	const research = await getCollection("research");
	const writing = (await getCollection("writing")).filter(isPublishedEntry);

	return [
		...posts
			.filter(({ data }) => !data.ogImage)
			.flatMap((post) =>
				createStaticImageEntries(
					post.id,
					post.data.title,
					formatOgDate(post.data.updatedDate ?? post.data.publishDate),
				),
			),
		...research
			.filter(({ data }) => !data.ogImage)
			.flatMap((entry) =>
				createStaticImageEntries(
					`research/${entry.id}`,
					entry.data.title,
					formatOgDate(entry.data.paperDate),
				),
			),
		...writing
			.filter(({ data }) => !data.ogImage)
			.flatMap((entry) =>
				createStaticImageEntries(
					`writing/${entry.id}`,
					entry.data.title,
					formatOgDate(entry.data.publishDate),
				),
			),
	];
}
