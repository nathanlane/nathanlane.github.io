#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const svgPath = path.resolve("public/social-card.svg");
const pngPath = path.resolve("public/social-card.png");

export function buildSocialCardPng() {
	const svgMarkup = fs.readFileSync(svgPath, "utf8");
	return Buffer.from(new Resvg(svgMarkup).render().asPng());
}

export function syncSocialCard({ check = false } = {}) {
	const expected = buildSocialCardPng();
	const existing = fs.existsSync(pngPath) ? fs.readFileSync(pngPath) : null;

	if (check) {
		if (!existing || !existing.equals(expected)) {
			throw new Error("social-card.png is out of date. Run `pnpm run generate:social-card`.");
		}

		return;
	}

	fs.writeFileSync(pngPath, expected);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	try {
		syncSocialCard({ check: process.argv.includes("--check") });
	} catch (error) {
		console.error(error instanceof Error ? error.message : error);
		process.exit(1);
	}
}
