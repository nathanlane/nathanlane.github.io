#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

/**
 * Smoke test
 * ==========
 *
 * Fetches a representative set of routes and asserts each responds correctly
 * (status + a content marker). Used to confirm the rendered site actually works
 * — a green build does not prove pages render.
 *
 * Usage:
 *   node scripts/validation/smoke-test.mjs [baseUrl]
 *
 *   # local, against `pnpm preview`
 *   node scripts/validation/smoke-test.mjs http://localhost:4321
 *
 *   # production
 *   node scripts/validation/smoke-test.mjs https://nathanlane.info
 *
 * Default baseUrl: http://localhost:4321
 * Exit code: 0 if every check passes, 1 if any fail.
 */

const cliArgs = process.argv.slice(2).filter((arg) => arg !== "--");

const baseUrl = (cliArgs[0] || "http://localhost:4321").replace(/\/$/, "");

/**
 * Each check: { path, status?, marker?, contentType? }
 * - status: expected HTTP status (default 200)
 * - marker: substring that must appear in the body (HTML/XML)
 * - contentType: substring that must appear in the content-type header
 */
/**
 * Feed integrity check.
 *
 * Deliberately does NOT try to infer whether a body "looks like" markdown. This site's
 * content is partly documentation *about* markdown and HTML, so posts legitimately
 * contain literal `##`, `**`, escaped code fences and raw `<h2>` examples. Character
 * level heuristics tried here produced either a false positive on such a post or a
 * false negative on a genuine leak. The precise contract -- markdown renders to HTML,
 * MDX falls back to its description -- is pinned by unit tests on feedContent instead.
 *
 * What is asserted here is what the built feed can actually prove: it parses as XML,
 * every item carries a content element, and at least one carries real content.
 */
function feedIsWellFormed(body) {
	let doc;
	try {
		doc = new JSDOM(body, { contentType: "text/xml" }).window.document;
	} catch (error) {
		return `feed is not well-formed XML: ${error.message}`;
	}
	if (doc.querySelector("parsererror")) {
		return "feed is not well-formed XML";
	}

	const items = [...doc.querySelectorAll("item")];
	if (items.length === 0) return "feed contains no items";

	let withContent = 0;
	for (const item of items) {
		const title = item.querySelector("title")?.textContent ?? "unknown item";
		const encoded = item.getElementsByTagName("content:encoded")[0];

		// The element must exist on every item. An empty body serialises as
		// <content:encoded/>, which is legitimate; an absent element means the
		// endpoint stopped emitting content for that item.
		if (!encoded) return `feed item "${title}" has no content:encoded element`;
		if ((encoded.textContent ?? "").trim() !== "") withContent += 1;
	}

	if (withContent === 0) return `no feed item carries any content (${items.length} items)`;
	return null;
}

export function findBuildIdentityProblem(builtHtml, servedHtml) {
	const builtDocument = new JSDOM(builtHtml).window.document;
	const servedDocument = new JSDOM(servedHtml).window.document;
	const currentStylesheet = builtDocument
		.querySelector('link[rel~="stylesheet"][href]')
		?.getAttribute("href");

	if (!currentStylesheet) return "current dist/index.html has no stylesheet reference";

	const servesCurrentBuild = [
		...servedDocument.querySelectorAll('link[rel~="stylesheet"][href]'),
	].some((link) => link.getAttribute("href") === currentStylesheet);

	return servesCurrentBuild
		? null
		: `served homepage is missing current build stylesheet "${currentStylesheet}"`;
}

const CHECKS = [
	{ path: "/", marker: "Nathan Lane" },
	{ path: "/about/", marker: "Nathan Lane" },
	{ path: "/research/", marker: "Nathan Lane" },
	{ path: "/research/manufacturing-revolutions/", marker: "Nathan Lane" },
	// KaTeX renders on a page that actually contains math; its self-hosted CSS is
	// now loaded conditionally, so this must be a genuine math page (not any page).
	{ path: "/posts/uncomtrade/", marker: "katex" },
	{ path: "/writing/", marker: "Nathan Lane" },
	{ path: "/writing/a-flight-plan-that-fails-boston-review/", marker: "Nathan Lane" },
	{ path: "/posts/", marker: "Nathan Lane" },
	// page 1 of the paginated post list; regression guard for the dropped-page-1 bug
	{ path: "/posts/1/", marker: "Nathan Lane" },
	{ path: "/tags/", marker: "Nathan Lane" },
	// merged tag page, and a redirect from the old space-containing URL it replaced
	{ path: "/tags/static-sites/", marker: "Nathan Lane" },
	{ path: "/tags/best%20practices/", marker: "/tags/best-practices" },
	{ path: "/rss.xml", marker: "<rss", assert: feedIsWellFormed },
	{ path: "/research/rss.xml", marker: "<rss", assert: feedIsWellFormed },
	{ path: "/sitemap-index.xml", marker: "<sitemapindex" },
	// satori + resvg rendered OG image
	{ path: "/og-image/deepseek.png", contentType: "image/png" },
	// unknown route must serve a 404
	{ path: "/this-route-should-not-exist-xyz", status: 404 },
];

async function run() {
	console.log(`Smoke testing ${baseUrl}\n`);
	const failures = [];
	let builtHomepage = null;

	if (new URL(baseUrl).hostname === "localhost") {
		try {
			builtHomepage = await readFile("dist/index.html", "utf8");
		} catch (error) {
			console.error(`Smoke test FAILED: cannot read dist/index.html: ${error.message}`);
			process.exit(1);
		}
	}

	for (const check of CHECKS) {
		const expectedStatus = check.status ?? 200;
		const url = `${baseUrl}${check.path}`;
		let res;
		try {
			res = await fetch(url, { redirect: "manual" });
		} catch (error) {
			failures.push(`${check.path} — request failed: ${error.message}`);
			console.log(`  ✗ ${check.path} — request failed: ${error.message}`);
			continue;
		}

		const problems = [];
		if (res.status !== expectedStatus) {
			problems.push(`status ${res.status} (expected ${expectedStatus})`);
		}
		if (check.contentType) {
			const ct = res.headers.get("content-type") || "";
			if (!ct.includes(check.contentType)) {
				problems.push(`content-type "${ct}" missing "${check.contentType}"`);
			}
		}
		if (check.marker || check.assert) {
			const body = await res.text();
			if (check.marker && !body.includes(check.marker)) {
				problems.push(`body missing marker "${check.marker}"`);
			}
			if (check.assert) {
				const failure = check.assert(body);
				if (failure) problems.push(failure);
			}
			if (check.path === "/" && builtHomepage !== null) {
				const failure = findBuildIdentityProblem(builtHomepage, body);
				if (failure) problems.push(failure);
			}
		}

		if (problems.length > 0) {
			failures.push(`${check.path} — ${problems.join("; ")}`);
			console.log(`  ✗ ${check.path} — ${problems.join("; ")}`);
		} else {
			console.log(`  ✓ ${check.path}`);
		}
	}

	console.log("");
	if (failures.length > 0) {
		console.error(`Smoke test FAILED: ${failures.length}/${CHECKS.length} checks failed.`);
		process.exit(1);
	}
	console.log(`Smoke test passed: ${CHECKS.length}/${CHECKS.length} checks OK.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	run();
}
