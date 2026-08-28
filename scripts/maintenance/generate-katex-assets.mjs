#!/usr/bin/env node
//
// generate-katex-assets.mjs — vendor KaTeX's CSS + fonts into public/katex/.
//
// KaTeX math is rendered to static HTML at build time (rehype-katex), but its
// stylesheet + fonts were loaded from a CDN on every page. We self-host them so
// the CSS is same-origin and loaded only on pages that actually have math.
//
// The assets are copied verbatim from the installed `katex` package, so they
// always match the renderer version. `--check` fails if public/katex has
// drifted from the installed package (e.g. after a `katex` bump without
// re-running this) — wired into `check:generated` / CI.
//
// Run `pnpm run generate:katex` after bumping the katex dependency.

import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const katexPackage = require.resolve("katex/package.json");
const katexDist = path.join(path.dirname(katexPackage), "dist");
const srcCss = path.join(katexDist, "katex.min.css");
const srcFonts = path.join(katexDist, "fonts");

const rehypeKatexRequire = createRequire(require.resolve("rehype-katex"));
const rendererKatexPackage = rehypeKatexRequire.resolve("katex/package.json");
const rendererCss = path.join(path.dirname(rendererKatexPackage), "dist", "katex.min.css");

const outDir = path.resolve("public/katex");
const outCss = path.join(outDir, "katex.min.css");
const outFonts = path.join(outDir, "fonts");

const listDir = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir).sort() : []);
const filesEqual = (a, b) =>
	fs.existsSync(a) &&
	fs.existsSync(b) &&
	Buffer.compare(fs.readFileSync(a), fs.readFileSync(b)) === 0;

const assertRendererCssMatches = () => {
	if (!filesEqual(srcCss, rendererCss)) {
		throw new Error("Top-level KaTeX CSS differs from the KaTeX CSS resolved from rehype-katex.");
	}
};

export function syncKatexAssets({ check = false } = {}) {
	assertRendererCssMatches();
	const srcFontFiles = listDir(srcFonts);

	if (check) {
		const errors = [];
		if (!filesEqual(srcCss, outCss)) {
			errors.push("public/katex/katex.min.css differs from the installed katex");
		}
		const outFontFiles = listDir(outFonts);
		if (srcFontFiles.join(",") !== outFontFiles.join(",")) {
			errors.push(
				`font set differs (installed ${srcFontFiles.length}, vendored ${outFontFiles.length})`,
			);
		} else {
			const drifted = srcFontFiles.find(
				(f) => !filesEqual(path.join(srcFonts, f), path.join(outFonts, f)),
			);
			if (drifted) errors.push(`font differs: ${drifted}`);
		}
		if (errors.length) {
			throw new Error(
				`KaTeX assets are out of date. Run \`pnpm run generate:katex\`:\n  - ${errors.join("\n  - ")}`,
			);
		}
		return;
	}

	fs.rmSync(outDir, { recursive: true, force: true });
	fs.mkdirSync(outFonts, { recursive: true });
	fs.copyFileSync(srcCss, outCss);
	for (const f of srcFontFiles) {
		fs.copyFileSync(path.join(srcFonts, f), path.join(outFonts, f));
	}
}

const check = process.argv.includes("--check");
try {
	syncKatexAssets({ check });
	console.log(
		check
			? "✓ KaTeX assets up to date."
			: `✓ Vendored KaTeX into public/katex (${listDir(srcFonts).length} font files).`,
	);
} catch (err) {
	console.error(err.message);
	process.exit(1);
}
