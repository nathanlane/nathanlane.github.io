#!/usr/bin/env node
import { appendFile, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import matter from "gray-matter";
import { JSDOM } from "jsdom";

/**
 * verify:links
 * ============
 *
 * Extracts every external URL referenced from `src/content/` — markdown/MDX body
 * links and images, plus known frontmatter URL fields (`research.link`,
 * `research.download`, `media.link`, `pages.contactLinks[].href`) — and checks
 * whether each one is still reachable.
 *
 * URLs are extracted by actually rendering the markdown/MDX body through the
 * site's own markdown processor and reading the resulting HTML with a DOM
 * parser, rather than regexing the raw source. A prior sweep that grepped raw
 * text through a shell pipeline silently dropped 60 of 445 URLs whose markdown
 * (a title in quotes, a URL containing a space) broke the pipeline; a real
 * parser handles that syntax the same way the rendered site does.
 *
 * Every URL is classified as one of:
 *   - ok            reachable (2xx/3xx)
 *   - dead          the origin server has confirmed the resource is gone (404/410)
 *   - unverifiable  everything else: auth/bot-blocking (401/403), rate limiting
 *                   (429), server errors, or a network failure that persisted
 *                   through retries. None of these prove the link is dead — a
 *                   403 is as likely to be a publisher blocking scripted
 *                   clients as it is a removed page — so they are reported but
 *                   do not fail the run.
 *
 * For research entries whose `link` resolves `ok`, the linked page's <title>
 * is additionally checked against the frontmatter `authors` surnames (the
 * check `src/test/research-consistency.spec.ts` cannot do offline, since it
 * needs to fetch the live page). A mismatch is reported as a warning, not a
 * failure: title text is an unreliable signal on its own (paywalls, redesigns,
 * multi-paper landing pages), so this is a lead for a human to check, not a
 * verdict. `download` targets are not content-checked — most are PDFs, and
 * parsing them would need a new dependency.
 *
 * Exit code: 1 if any URL is classified `dead`, 0 otherwise (including when
 * URLs are `unverifiable` — network flakiness must never fail this job).
 *
 * Usage:
 *   node scripts/validation/verify-links.mjs
 *   pnpm run verify:links
 */

const CONTENT_ROOT = path.resolve("src/content");
const COLLECTION_DIRS = ["post", "research", "writing", "media", "series", "pages", "private-note"];

const USER_AGENT =
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
const TIMEOUT_MS = 15_000;
const MAX_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 1000;
const CONCURRENCY = 8;

// Statuses the origin server uses to say "this resource is confirmed gone".
const DEAD_STATUSES = new Set([404, 410]);
// Worth retrying: transient server trouble or rate limiting, not proof of anything.
const RETRYABLE_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504]);

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isHttpUrl(value) {
	return typeof value === "string" && /^https?:\/\//i.test(value.trim());
}

async function walk(dir) {
	const out = [];
	let entries;
	try {
		entries = await readdir(dir, { withFileTypes: true });
	} catch {
		return out;
	}
	for (const entry of entries) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			out.push(...(await walk(full)));
		} else if (/\.(md|mdx)$/.test(entry.name)) {
			out.push(full);
		}
	}
	return out;
}

/** Recursively collects every absolute http(s) string in a frontmatter value, tagged by key path. */
export function collectFrontmatterUrls(data, keyPath = []) {
	const found = [];
	if (isHttpUrl(data)) {
		found.push({ url: data.trim(), location: `frontmatter:${keyPath.join(".")}` });
		return found;
	}
	if (Array.isArray(data)) {
		for (const [i, item] of data.entries()) {
			found.push(...collectFrontmatterUrls(item, [...keyPath, String(i)]));
		}
		return found;
	}
	if (data && typeof data === "object") {
		for (const [key, value] of Object.entries(data)) {
			found.push(...collectFrontmatterUrls(value, [...keyPath, key]));
		}
	}
	return found;
}

/** Collects every absolute http(s) link/image src from rendered body HTML. */
export function collectBodyUrls(html) {
	const dom = new JSDOM(html);
	const found = [];
	for (const anchor of dom.window.document.querySelectorAll("a[href]")) {
		const href = anchor.getAttribute("href");
		if (isHttpUrl(href)) found.push({ url: href.trim(), location: "body:a" });
	}
	for (const img of dom.window.document.querySelectorAll("img[src]")) {
		const src = img.getAttribute("src");
		if (isHttpUrl(src)) found.push({ url: src.trim(), location: "body:img" });
	}
	return found;
}

/**
 * Walks every content collection, rendering each file's body through the site's real
 * markdown processor and collecting URLs from both the rendered body and frontmatter.
 */
async function extractAll() {
	const processor = await createMarkdownProcessor({ syntaxHighlight: false });
	const files = [];
	for (const dir of COLLECTION_DIRS) {
		files.push(...(await walk(path.join(CONTENT_ROOT, dir))));
	}
	files.sort();

	const occurrences = [];
	const researchEntries = [];
	const researchDir = path.join(CONTENT_ROOT, "research");

	for (const file of files) {
		const raw = await readFile(file, "utf8");
		const { data, content } = matter(raw);
		const relFile = path.relative(process.cwd(), file);

		for (const { url, location } of collectFrontmatterUrls(data)) {
			occurrences.push({ url, file: relFile, location });
		}

		if (file.startsWith(researchDir + path.sep) && typeof data.link === "string") {
			researchEntries.push({ file: relFile, link: data.link.trim(), authors: data.authors });
		}

		let rendered;
		try {
			rendered = (await processor.render(content)).code;
		} catch (error) {
			console.error(`  ! could not render ${relFile}, skipping body: ${error.message}`);
			continue;
		}
		for (const { url, location } of collectBodyUrls(rendered)) {
			occurrences.push({ url, file: relFile, location });
		}
	}

	return { occurrences, researchEntries, fileCount: files.length };
}

async function attemptFetch(url, method) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
	try {
		const res = await fetch(url, {
			method,
			redirect: "follow",
			signal: controller.signal,
			headers: { "User-Agent": USER_AGENT, Accept: "*/*" },
		});
		if (res.body) {
			try {
				await res.body.cancel();
			} catch {
				// Body already consumed or cancellation unsupported; status is all we need.
			}
		}
		return { ok: true, status: res.status };
	} catch (error) {
		return { ok: false, error };
	} finally {
		clearTimeout(timer);
	}
}

export function describeError(error) {
	if (!error) return "unknown error";
	if (error.name === "AbortError") return "timeout";
	return error.cause?.code || error.code || error.message || String(error);
}

/**
 * Classifies a resolved fetch attempt (network failure or final HTTP status) with no
 * further I/O. Pulled out of `checkUrl` so the ok/dead/unverifiable decision — the part
 * that actually encodes the issue's policy — can be unit-tested without a network call.
 */
export function classifyResult(result) {
	if (!result.ok) {
		return { class: "unverifiable", detail: `network error: ${describeError(result.error)}` };
	}
	const { status } = result;
	if (status >= 200 && status < 400) {
		return { class: "ok", detail: `HTTP ${status}` };
	}
	if (DEAD_STATUSES.has(status)) {
		return { class: "dead", detail: `HTTP ${status}` };
	}
	return { class: "unverifiable", detail: `HTTP ${status}` };
}

/** Checks one URL, retrying network failures and transient server errors, and classifies it. */
async function checkUrl(url) {
	// HEAD first to avoid downloading bodies (some of these are multi-MB PDFs); a
	// method-not-allowed response means the server only understands GET.
	let result = await attemptFetch(url, "HEAD");
	if (!result.ok || result.status === 405 || result.status === 501) {
		result = await attemptFetch(url, "GET");
	}

	let attempts = 1;
	while (attempts < MAX_ATTEMPTS && (!result.ok || RETRYABLE_STATUSES.has(result.status))) {
		await sleep(RETRY_BASE_DELAY_MS * attempts);
		result = await attemptFetch(url, "GET");
		attempts += 1;
	}

	return { ...classifyResult(result), attempts };
}

async function mapWithConcurrency(items, limit, fn) {
	const results = new Array(items.length);
	let next = 0;
	async function worker() {
		while (next < items.length) {
			const current = next++;
			results[current] = await fn(items[current], current);
		}
	}
	await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
	return results;
}

/** "Nathan Lane, Réka Juhász, and Dani Rodrik" -> ["Lane", "Juhász", "Rodrik"] */
export function extractSurnames(authorsField) {
	if (typeof authorsField !== "string" || !authorsField.trim()) return [];
	return authorsField
		.split(/,| and /i)
		.map((part) => part.trim())
		.filter(Boolean)
		.map((name) => name.split(/\s+/).filter(Boolean).pop())
		.filter((surname) => Boolean(surname) && surname.length > 1);
}

/**
 * For research entries whose `link` is reachable, fetches the live page and checks
 * whether any author surname appears in its title or opening content. Needs network
 * access to the actual citation target, which is why this lives here and not in the
 * offline vitest suite.
 */
async function checkResearchContent(researchEntries, resultsByUrl) {
	const mismatches = [];
	for (const entry of researchEntries) {
		const reach = resultsByUrl.get(entry.link);
		if (reach?.class !== "ok") continue;

		const surnames = extractSurnames(entry.authors);
		if (surnames.length === 0) continue;

		let html;
		try {
			const controller = new AbortController();
			const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
			try {
				const res = await fetch(entry.link, {
					method: "GET",
					redirect: "follow",
					signal: controller.signal,
					headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
				});
				html = await res.text();
			} finally {
				clearTimeout(timer);
			}
		} catch {
			continue; // Can't fetch content right now; that's not evidence of a mismatch.
		}

		const title = new JSDOM(html).window.document.querySelector("title")?.textContent?.trim() ?? "";
		const haystack = `${title}\n${html.slice(0, 5000)}`.toLowerCase();
		const matched = surnames.some((surname) => haystack.includes(surname.toLowerCase()));
		if (!matched) {
			mismatches.push({ file: entry.file, link: entry.link, title, authors: entry.authors });
		}
	}
	return mismatches;
}

function formatOccurrences(url, occurrences) {
	const forUrl = occurrences.filter((o) => o.url === url);
	return forUrl.map((o) => `${o.file} (${o.location})`).join(", ");
}

async function writeJobSummary({ byClass, occurrences, contentMismatches }) {
	const summaryPath = process.env.GITHUB_STEP_SUMMARY;
	if (!summaryPath) return;

	const lines = [
		"## Link verification",
		"",
		`| Class | Count |`,
		`| --- | --- |`,
		`| ok | ${byClass.ok.length} |`,
		`| dead | ${byClass.dead.length} |`,
		`| unverifiable | ${byClass.unverifiable.length} |`,
		"",
	];

	if (byClass.dead.length > 0) {
		lines.push("### Dead links", "", "| URL | Detail | Found in |", "| --- | --- | --- |");
		for (const { url, detail } of byClass.dead) {
			lines.push(`| ${url} | ${detail} | ${formatOccurrences(url, occurrences)} |`);
		}
		lines.push("");
	}

	if (contentMismatches.length > 0) {
		lines.push(
			"### Possible research content mismatches",
			"",
			"| File | Link | Authors | Live page title |",
			"| --- | --- | --- | --- |",
		);
		for (const { file, link, authors, title } of contentMismatches) {
			lines.push(`| ${file} | ${link} | ${authors} | ${title || "(no title)"} |`);
		}
		lines.push("");
	}

	await appendFile(summaryPath, `${lines.join("\n")}\n`);
}

async function main() {
	console.log("Extracting URLs from src/content/ ...");
	const { occurrences, researchEntries, fileCount } = await extractAll();
	const uniqueUrls = [...new Set(occurrences.map((o) => o.url))];
	console.log(
		`Found ${occurrences.length} URL reference(s) (${uniqueUrls.length} unique) across ${fileCount} file(s).\n`,
	);

	console.log(`Checking ${uniqueUrls.length} unique URL(s) ...`);
	const resultsByUrl = new Map();
	await mapWithConcurrency(uniqueUrls, CONCURRENCY, async (url) => {
		resultsByUrl.set(url, await checkUrl(url));
	});

	const byClass = { ok: [], dead: [], unverifiable: [] };
	for (const url of uniqueUrls) {
		const result = resultsByUrl.get(url);
		byClass[result.class].push({ url, ...result });
	}

	console.log("\nChecking research entry content against live pages ...");
	const contentMismatches = await checkResearchContent(researchEntries, resultsByUrl);

	console.log("\n--- Results ---");
	console.log(`ok:            ${byClass.ok.length}`);
	console.log(`dead:          ${byClass.dead.length}`);
	console.log(`unverifiable:  ${byClass.unverifiable.length}`);

	if (byClass.dead.length > 0) {
		console.log("\nDead links (confirmed 404/410):");
		for (const { url, detail } of byClass.dead) {
			console.log(`  ✗ ${url} — ${detail}`);
			console.log(`      in: ${formatOccurrences(url, occurrences)}`);
		}
	}

	if (byClass.unverifiable.length > 0) {
		console.log("\nUnverifiable links (not treated as failures):");
		for (const { url, detail, attempts } of byClass.unverifiable) {
			console.log(`  ? ${url} — ${detail} (${attempts} attempt${attempts === 1 ? "" : "s"})`);
		}
	}

	if (contentMismatches.length > 0) {
		console.log("\nPossible research content mismatches (link is reachable, but its title");
		console.log("doesn't mention any author surname — worth a human check):");
		for (const { file, link, authors, title } of contentMismatches) {
			console.log(`  ~ ${file}`);
			console.log(`      link:    ${link}`);
			console.log(`      authors: ${authors}`);
			console.log(`      title:   ${title || "(no title found)"}`);
		}
	}

	await writeJobSummary({ byClass, occurrences, contentMismatches });

	console.log("");
	if (byClass.dead.length > 0) {
		console.error(`verify:links FAILED: ${byClass.dead.length} confirmed dead link(s).`);
		process.exitCode = 1;
	} else {
		console.log("verify:links passed: no confirmed dead links.");
	}
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	main();
}
