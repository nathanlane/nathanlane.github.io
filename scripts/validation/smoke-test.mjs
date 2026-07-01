#!/usr/bin/env node

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
	{ path: "/tags/", marker: "Nathan Lane" },
	{ path: "/rss.xml", marker: "<rss" },
	{ path: "/research/rss.xml", marker: "<rss" },
	{ path: "/sitemap-index.xml", marker: "<sitemapindex" },
	// satori + resvg rendered OG image
	{ path: "/og-image/deepseek.png", contentType: "image/png" },
	// unknown route must serve a 404
	{ path: "/this-route-should-not-exist-xyz", status: 404 },
];

async function run() {
	console.log(`Smoke testing ${baseUrl}\n`);
	const failures = [];

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
		if (check.marker) {
			const body = await res.text();
			if (!body.includes(check.marker)) {
				problems.push(`body missing marker "${check.marker}"`);
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

run();
