import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = process.cwd();
const srcDir = path.join(repoRoot, "src");

/**
 * Custom properties supplied at render time rather than declared in our stylesheets.
 * Shiki injects its own per-token variables into highlighted code blocks.
 */
const RUNTIME_PROVIDED = /^--shiki-/;

/**
 * Only styles are scanned. Markdown content contains CSS examples that are prose, not
 * stylesheets, and must not be treated as live declarations.
 */
const STYLE_EXTENSIONS = new Set([".astro", ".css", ".ts"]);

function collectFiles(dir: string, found: string[] = []): string[] {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			collectFiles(full, found);
		} else if (STYLE_EXTENSIONS.has(path.extname(entry.name))) {
			found.push(full);
		}
	}
	return found;
}

// The test tree is excluded: it discusses var(--x) in prose rather than shipping styles.
const files = collectFiles(srcDir).filter(
	(file) => !file.startsWith(path.join(srcDir, "test") + path.sep),
);
const sources = new Map(files.map((file) => [file, fs.readFileSync(file, "utf8")]));

const declared = new Set<string>();
for (const source of sources.values()) {
	for (const match of source.matchAll(/(--[a-zA-Z0-9_-]+)\s*:/g)) {
		if (match[1]) declared.add(match[1]);
	}
}
// The Tailwind config also declares tokens consumed by hand-written CSS.
for (const match of fs
	.readFileSync(path.join(repoRoot, "tailwind.config.ts"), "utf8")
	.matchAll(/(--[a-zA-Z0-9_-]+)\s*:/g)) {
	if (match[1]) declared.add(match[1]);
}

describe("css custom properties", () => {
	it("resolves every variable used without a fallback", () => {
		const undefinedUses: string[] = [];

		for (const [file, source] of sources) {
			source.split("\n").forEach((line, index) => {
				// The `,` capture distinguishes var(--x) from var(--x, fallback): the
				// fallback form degrades gracefully and is intentionally allowed.
				for (const match of line.matchAll(/var\(\s*(--[a-zA-Z0-9_-]+)\s*(,)?/g)) {
					const name = match[1];
					const hasFallback = match[2];
					if (!name || hasFallback || RUNTIME_PROVIDED.test(name) || declared.has(name)) {
						continue;
					}
					undefinedUses.push(`${path.relative(repoRoot, file)}:${index + 1} ${name}`);
				}
			});
		}

		expect(undefinedUses).toEqual([]);
	});
});
