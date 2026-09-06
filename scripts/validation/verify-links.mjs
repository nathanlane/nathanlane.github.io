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
 * Every href/src is classified as one of:
 *   - ok            reachable (2xx/3xx)
 *   - dead          the URL itself returns HTTP 404/410, GET-confirmed. That's the best
 *                   signal this tool has that a resource is gone, but it isn't proof: a
 *                   typo'd URL 404s against a real, live site just as readily as a
 *                   genuinely removed page does, so "dead" means "this exact URL is
 *                   broken," which might be fixed by editing the URL rather than by
 *                   finding a replacement for the thing it once pointed at.
 *   - unverifiable  everything else: auth/bot-blocking (401/403), rate limiting
 *                   (429), server errors, or a network failure that persisted
 *                   through retries. None of these prove the link is dead — a
 *                   403 is as likely to be a publisher blocking scripted
 *                   clients as it is a removed page — so they are reported but
 *                   do not fail the run.
 *   - malformed     not a fetchable URL at all, and not a legitimate site-relative
 *                   reference either: a schemeless value that looks like a domain
 *                   (`tabula.nerdpower.org`) or an email missing `mailto:`, a
 *                   value with two schemes stuck together (`http://http//x.org`),
 *                   or anything else a browser cannot resolve as intended. A
 *                   browser resolves a schemeless "domain" as a same-site
 *                   relative path, so these silently 404 rather than erroring
 *                   loudly — no network check is needed to know that; this is a
 *                   deterministic, offline source bug.
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
 * Exit code: 1 if any href/src is classified `dead` or `malformed`, 0 otherwise
 * (including when URLs are `unverifiable` — network flakiness must never fail
 * this job). `malformed` fails the run alongside `dead` because it is just as
 * definite and, unlike reachability, needs no network at all to prove.
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

// Statuses that mean "this exact URL is broken" — not necessarily that the destination
// itself is gone; the URL could just be wrong. GET-confirmed before being trusted.
const DEAD_STATUSES = new Set([404, 410]);
// Worth retrying: transient server trouble or rate limiting, not proof of anything.
const RETRYABLE_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504]);

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isHttpUrl(value) {
	return typeof value === "string" && /^https?:\/\//i.test(value.trim());
}

// Extensions that make a schemeless "authority.tld"-shaped string a relative filename
// (`photo.jpg`, `app.js`) rather than a domain someone forgot to put a scheme in front
// of. This is a personal/academic blog, so a bare relative filename is just as likely to
// be a data or manuscript file (`data.dta`, `paper.tex`, `deck.pptx`) as a web asset —
// the list covers common document, data, and code file extensions, not just web ones.
const WEB_ASSET_EXTENSIONS = new Set([
	// Web
	"html",
	"htm",
	"css",
	"js",
	"mjs",
	"json",
	"xml",
	"txt",
	"csv",
	"tsv",
	"jpg",
	"jpeg",
	"png",
	"gif",
	"svg",
	"webp",
	"avif",
	"ico",
	"pdf",
	"zip",
	"tar",
	"gz",
	"mp4",
	"mp3",
	"woff",
	"woff2",
	"ttf",
	"eot",
	// Documents
	"doc",
	"docx",
	"xls",
	"xlsx",
	"ppt",
	"pptx",
	"rtf",
	"epub",
	"pages",
	"key",
	"numbers",
	// Manuscript / notes
	"tex",
	"bib",
	"md",
	"markdown",
	"rmd",
	// Data
	"dta",
	"sav",
	"sas7bdat",
	"rds",
	"rdata",
	"parquet",
	"dat",
	// Code / config
	"py",
	"ipynb",
	"r",
	"do",
	"sql",
	"yaml",
	"yml",
	"toml",
	"log",
]);

function hasWebAssetExtension(authority) {
	const ext = authority.split(".").pop()?.toLowerCase();
	return Boolean(ext) && WEB_ASSET_EXTENSIONS.has(ext);
}

/** A hostname a real absolute URL could plausibly have — not proof it exists, just that its shape isn't a typo. */
function isPlausibleHostname(host) {
	if (!host) return false;
	if (host.toLowerCase() === "localhost") return true;
	if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return true; // IPv4
	if (host.includes(":")) return true; // IPv6 literal
	return /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i.test(host);
}

function isEmailLike(value) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Classifies a raw href/src attribute value with no network I/O: is this a fetchable
 * http(s) URL, a source bug that will never resolve as intended ("malformed"), or
 * something outside this tool's remit (a site-relative path, a mailto:/tel: link) that
 * should be silently ignored?
 *
 * "Malformed" exists because a browser doesn't error loudly on a schemeless href like
 * `tabula.nerdpower.org` — it resolves it as a path relative to the current page, so the
 * link silently 404s on this site instead of on the domain the author meant. That's a
 * deterministic, offline-provable defect, unlike third-party reachability.
 */
export function classifyHref(rawValue) {
	if (typeof rawValue !== "string") return { kind: "ignore", value: rawValue };
	const value = rawValue.trim();
	if (!value) return { kind: "ignore", value };

	// A leading /, #, ?, or . is a legitimate site-relative reference regardless of what
	// else is in it — a path segment like "/files/my paper.pdf" is valid HTML, and must be
	// recognised before the whitespace check below would otherwise flag it as malformed.
	if (/^[/#?.]/.test(value)) return { kind: "ignore", value };

	if (/\s/.test(value)) {
		return { kind: "malformed", value, reason: "contains whitespace; not a valid URL or path" };
	}

	const schemeMatch = /^([a-z][a-z0-9+.-]*):/i.exec(value);
	if (schemeMatch) {
		if (!/^https?$/i.test(schemeMatch[1])) {
			// mailto:, tel:, javascript:, data:, etc. — an intentional non-web scheme.
			return { kind: "ignore", value };
		}
		let hostname;
		try {
			hostname = new URL(value).hostname;
		} catch {
			return { kind: "malformed", value, reason: "not a parseable URL" };
		}
		if (!isPlausibleHostname(hostname)) {
			// Catches e.g. "http://http//openrefine.org/" — a doubled scheme parses fine as
			// a URL with hostname "http", which no real link is ever actually pointing at.
			return { kind: "malformed", value, reason: `host "${hostname}" is not a plausible hostname` };
		}
		return { kind: "http", value };
	}

	// No scheme, and not a leading-marker relative path (checked above).
	if (isEmailLike(value)) {
		return {
			kind: "malformed",
			value,
			reason: "looks like an email address missing its mailto: scheme",
		};
	}

	const authority = value.split(/[/?#]/)[0];
	if (isPlausibleHostname(authority) && !hasWebAssetExtension(authority)) {
		return {
			kind: "malformed",
			value,
			reason: `no scheme; "${authority}" looks like an external domain and will resolve as a same-site relative path`,
		};
	}
	return { kind: "ignore", value };
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

// Frontmatter keys documented above as holding a URL (research.link/.download,
// media.link, pages.contactLinks[].href). The fuller malformed check is scoped to
// exactly these: `pages.contactLinks[].text` is a display label that legitimately holds
// a bare domain-looking string ("industrialpolicygroup.com") backed by a real `href` —
// it was never a link itself, and flagging it would be a false positive, not a catch.
const URL_FIELD_NAMES = new Set(["link", "download", "href"]);

/**
 * Recursively collects every URL-shaped string in a frontmatter value, tagged by key
 * path. A well-formed absolute http(s) URL in any field is always collected (`kind:
 * "http"`); the malformed check additionally runs, but only on `link`/`download`/`href`
 * fields specifically, since that check assumes the value is meant to be a URL at all.
 */
export function collectFrontmatterUrls(data, keyPath = []) {
	const found = [];
	if (typeof data === "string") {
		const value = data.trim();
		const lastKey = keyPath[keyPath.length - 1];
		if (value && URL_FIELD_NAMES.has(lastKey) && !/\s/.test(value)) {
			const classified = classifyHref(value);
			if (classified.kind !== "ignore") {
				found.push({
					url: classified.value,
					location: `frontmatter:${keyPath.join(".")}`,
					kind: classified.kind,
					reason: classified.reason,
				});
			}
		} else if (isHttpUrl(value)) {
			found.push({ url: value, location: `frontmatter:${keyPath.join(".")}`, kind: "http" });
		}
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

/**
 * Collects every link/image reference from rendered body HTML that is either a fetchable
 * http(s) URL or a malformed one — site-relative paths and other schemes (mailto:, tel:)
 * are classified `ignore` by `classifyHref` and dropped here.
 */
export function collectBodyUrls(html) {
	const dom = new JSDOM(html);
	const found = [];
	const collect = (rawValue, location) => {
		const classified = classifyHref(rawValue);
		if (classified.kind === "ignore") return;
		found.push({
			url: classified.value,
			location,
			kind: classified.kind,
			reason: classified.reason,
		});
	};
	for (const anchor of dom.window.document.querySelectorAll("a[href]")) {
		collect(anchor.getAttribute("href"), "body:a");
	}
	for (const img of dom.window.document.querySelectorAll("img[src]")) {
		collect(img.getAttribute("src"), "body:img");
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
			occurrences.push({ url, file: relFile, location, kind: "http" });
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
		for (const { url, location, kind, reason } of collectBodyUrls(rendered)) {
			occurrences.push({ url, file: relFile, location, kind, reason });
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
export async function checkUrl(url) {
	// HEAD first to avoid downloading bodies (some of these are multi-MB PDFs). Fall back
	// to GET whenever HEAD didn't give a trustworthy answer: a network error, a
	// method-not-allowed response, or a 404/410. That last one matters most — a server
	// that mishandles HEAD by 404ing it while GET serves the real page is a known
	// link-checker pitfall, and a false "dead" is the one verdict this tool must never
	// produce, since it sends someone off to fix a citation that was never broken.
	let result = await attemptFetch(url, "HEAD");
	if (
		!result.ok ||
		result.status === 405 ||
		result.status === 501 ||
		DEAD_STATUSES.has(result.status)
	) {
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

async function writeJobSummary({ byClass, malformed, occurrences, contentMismatches }) {
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
		`| malformed | ${malformed.length} |`,
		"",
	];

	if (byClass.dead.length > 0) {
		lines.push(
			"### Dead links",
			"",
			"HTTP 404/410 — the destination may be gone, or the URL may be wrong.",
			"",
			"| URL | Detail | Found in |",
			"| --- | --- | --- |",
		);
		for (const { url, detail } of byClass.dead) {
			lines.push(`| ${url} | ${detail} | ${formatOccurrences(url, occurrences)} |`);
		}
		lines.push("");
	}

	if (malformed.length > 0) {
		lines.push("### Malformed hrefs", "", "| Value | Reason | Found in |", "| --- | --- | --- |");
		for (const { url, reason } of malformed) {
			lines.push(`| ${url} | ${reason} | ${formatOccurrences(url, occurrences)} |`);
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

/** Dedupes malformed occurrences by URL, keeping the first reason seen for each. */
function collectMalformed(occurrences) {
	const byUrl = new Map();
	for (const o of occurrences) {
		if (o.kind === "malformed" && !byUrl.has(o.url)) {
			byUrl.set(o.url, o.reason);
		}
	}
	return [...byUrl.entries()].map(([url, reason]) => ({ url, reason }));
}

async function main() {
	console.log("Extracting URLs from src/content/ ...");
	const { occurrences, researchEntries, fileCount } = await extractAll();
	const httpUrls = [...new Set(occurrences.filter((o) => o.kind === "http").map((o) => o.url))];
	const malformed = collectMalformed(occurrences);
	console.log(
		`Found ${occurrences.length} reference(s) (${httpUrls.length} unique checkable URL(s), ` +
			`${malformed.length} malformed) across ${fileCount} file(s).\n`,
	);

	console.log(`Checking ${httpUrls.length} unique URL(s) ...`);
	const resultsByUrl = new Map();
	await mapWithConcurrency(httpUrls, CONCURRENCY, async (url) => {
		resultsByUrl.set(url, await checkUrl(url));
	});

	const byClass = { ok: [], dead: [], unverifiable: [] };
	for (const url of httpUrls) {
		const result = resultsByUrl.get(url);
		byClass[result.class].push({ url, ...result });
	}

	console.log("\nChecking research entry content against live pages ...");
	const contentMismatches = await checkResearchContent(researchEntries, resultsByUrl);

	console.log("\n--- Results ---");
	console.log(`ok:            ${byClass.ok.length}`);
	console.log(`dead:          ${byClass.dead.length}`);
	console.log(`unverifiable:  ${byClass.unverifiable.length}`);
	console.log(`malformed:     ${malformed.length}`);

	if (byClass.dead.length > 0) {
		console.log(
			"\nDead links (HTTP 404/410 — the destination may be gone, or the URL may be wrong):",
		);
		for (const { url, detail } of byClass.dead) {
			console.log(`  ✗ ${url} — ${detail}`);
			console.log(`      in: ${formatOccurrences(url, occurrences)}`);
		}
	}

	if (malformed.length > 0) {
		console.log(
			"\nMalformed hrefs (source bugs, not reachability — fixable without a network call):",
		);
		for (const { url, reason } of malformed) {
			console.log(`  ✗ ${url} — ${reason}`);
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

	await writeJobSummary({ byClass, malformed, occurrences, contentMismatches });

	console.log("");
	if (byClass.dead.length > 0 || malformed.length > 0) {
		console.error(
			`verify:links FAILED: ${byClass.dead.length} link(s) returning 404/410, ` +
				`${malformed.length} malformed href(s).`,
		);
		process.exitCode = 1;
	} else {
		console.log("verify:links passed: no 404/410 links or malformed hrefs.");
	}
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	main();
}
