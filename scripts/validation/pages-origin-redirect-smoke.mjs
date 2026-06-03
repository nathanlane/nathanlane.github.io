#!/usr/bin/env node

import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Pages origin redirect smoke test
 * ================================
 *
 * Confirms that representative GitHub Pages origin URLs redirect to their
 * canonical `nathanlane.info` equivalents without losing the path.
 *
 * Usage:
 *   node scripts/validation/pages-origin-redirect-smoke.mjs
 *
 * Exit code: 0 if every redirect policy check passes, 1 if any fail.
 */

export const PAGES_ORIGIN = "https://nathanlane.github.io";
export const CANONICAL_ORIGIN = "https://nathanlane.info";
export const EXPECTED_REDIRECT_STATUS = 301;

export function buildExpectedLocation(path) {
	return `${CANONICAL_ORIGIN}${path}`;
}

export const REDIRECT_CHECKS = [
	{ path: "/", location: buildExpectedLocation("/") },
	{ path: "/about/", location: buildExpectedLocation("/about/") },
	{ path: "/rss.xml", location: buildExpectedLocation("/rss.xml") },
	{ path: "/og-image/deepseek.png", location: buildExpectedLocation("/og-image/deepseek.png") },
	{
		path: "/this-route-should-not-exist-xyz",
		location: buildExpectedLocation("/this-route-should-not-exist-xyz"),
	},
];

export async function checkRedirects(fetchImpl = fetch) {
	const results = [];
	for (const check of REDIRECT_CHECKS) {
		const url = `${PAGES_ORIGIN}${check.path}`;
		const problems = [];
		let status = null;
		let location = "";

		try {
			const res = await fetchImpl(url, { redirect: "manual" });
			status = res.status;
			location = res.headers.get("location") || "";
		} catch (error) {
			problems.push(`request failed: ${error.message}`);
			results.push({
				path: check.path,
				status,
				location,
				expectedLocation: check.location,
				problems,
			});
			continue;
		}

		if (status !== EXPECTED_REDIRECT_STATUS) {
			problems.push(`status ${status} (expected ${EXPECTED_REDIRECT_STATUS})`);
		}

		if (location !== check.location) {
			problems.push(`location "${location}" (expected "${check.location}")`);
		}

		results.push({
			path: check.path,
			status,
			location,
			expectedLocation: check.location,
			problems,
		});
	}

	return {
		results,
		failures: results.filter((result) => result.problems.length > 0),
	};
}

export async function run() {
	console.log(`Checking Pages origin redirects from ${PAGES_ORIGIN}\n`);
	const { failures, results } = await checkRedirects();

	for (const result of results) {
		if (result.problems.length > 0) {
			console.log(`  FAIL ${result.path}: ${result.problems.join("; ")}`);
		} else {
			console.log(`  OK ${result.path}`);
		}
	}

	console.log("");
	if (failures.length > 0) {
		console.error(
			`Pages-origin redirect smoke FAILED: ${failures.length}/${REDIRECT_CHECKS.length} checks failed.`,
		);
		process.exit(1);
	}

	console.log(
		`Pages-origin redirect smoke passed: ${REDIRECT_CHECKS.length}/${REDIRECT_CHECKS.length} checks OK.`,
	);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	run();
}
