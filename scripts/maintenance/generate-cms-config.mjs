#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dump } from "js-yaml";
import prettier from "prettier";
import { cmsConfigDefinition } from "../../src/content.contract.mjs";

const outputPath = path.resolve("public/admin/config.yml");

export async function buildCmsConfigYaml() {
	const rawYaml = [
		"# This file is generated from src/content.contract.mjs.",
		"# Run `pnpm run generate:cms` after editing the shared CMS contract.",
		dump(cmsConfigDefinition, {
			lineWidth: -1,
			noCompatMode: true,
			noRefs: true,
		}).trimEnd(),
		"",
	].join("\n");

	return prettier.format(rawYaml, { parser: "yaml" });
}

export async function syncCmsConfig({ check = false } = {}) {
	const expected = await buildCmsConfigYaml();
	const existing = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8") : null;

	if (check) {
		if (existing !== expected) {
			throw new Error("CMS config is out of date. Run `pnpm run generate:cms`.");
		}

		return;
	}

	fs.mkdirSync(path.dirname(outputPath), { recursive: true });
	fs.writeFileSync(outputPath, expected);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	try {
		await syncCmsConfig({ check: process.argv.includes("--check") });
	} catch (error) {
		console.error(error instanceof Error ? error.message : error);
		process.exit(1);
	}
}
