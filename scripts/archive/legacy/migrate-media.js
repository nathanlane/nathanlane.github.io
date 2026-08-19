#!/usr/bin/env node

/**
 * Migration script: Convert src/data/media.ts into individual markdown files
 * under src/content/media/.
 *
 * This script can be re-run safely; existing files will be overwritten.
 */

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const yaml = require("js-yaml");

(async () => {
	const { slug: slugify } = await import("github-slugger");

	const inputPath = path.resolve("src/data/media.ts");
	const outputDir = path.resolve("src/content/media");

	if (!fs.existsSync(inputPath)) {
		console.error(`Input file not found: ${inputPath}`);
		process.exit(1);
	}

	fs.mkdirSync(outputDir, { recursive: true });

	const source = fs.readFileSync(inputPath, "utf8");

	// Strip TypeScript-specific syntax so we can evaluate the object
	const cleanedSource = source
		.replace(/export interface[\s\S]*?\n}\n\n/, "")
		.replace(/export const mediaData: [^{=]+=/, "module.exports =");

	const sandbox = {
		module: { exports: {} },
		exports: {},
		require,
		console,
	};

	try {
		const script = new vm.Script(cleanedSource, { filename: "media-data.mjs" });
		script.runInNewContext(sandbox);
	} catch (error) {
		console.error("Failed to evaluate media data:", error);
		process.exit(1);
	}

	const mediaData = sandbox.module.exports;
	if (!mediaData || typeof mediaData !== "object") {
		console.error("mediaData export not found");
		process.exit(1);
	}

	const usedSlugs = new Set();

	const createUniqueSlug = (title, year) => {
		const base = `${year}-${slugify(title)}`;
		if (!usedSlugs.has(base)) {
			usedSlugs.add(base);
			return base;
		}

		let suffix = 2;
		while (usedSlugs.has(`${base}-${suffix}`)) {
			suffix += 1;
		}
		const unique = `${base}-${suffix}`;
		usedSlugs.add(unique);
		return unique;
	};

	for (const [year, items] of Object.entries(mediaData)) {
		if (!Array.isArray(items)) continue;

		items.forEach((item) => {
			const frontmatter = {
				title: item.title,
				outlet: item.outlet,
				date: item.date,
				type: item.type,
				link: item.link,
			};

			if (item.description) {
				frontmatter.description = item.description;
			}

			const slug = createUniqueSlug(item.title, year);
			const filename = path.join(outputDir, `${slug}.md`);

			const yamlContent = yaml.dump(frontmatter, {
				lineWidth: 80,
				noRefs: true,
				sortKeys: false,
			});

			const body = `---\n${yamlContent}---\n`;

			fs.writeFileSync(filename, body, "utf8");
		});
	}

	console.log("Media migration complete:", outputDir);
})();
