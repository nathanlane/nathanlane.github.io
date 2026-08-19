#!/usr/bin/env node

/**
 * Typography System Spacing Migration Script
 * =========================================
 *
 * Purpose: Migrates spacing classes from old numeric system to new 'b' convention
 *
 * What it does:
 * 1. Scans all .astro files for spacing classes
 * 2. Replaces numeric spacing with 'b' equivalents
 * 3. Creates a detailed migration report
 * 4. Optionally applies changes or creates patches
 *
 * Usage:
 *   node scripts/maintenance/migrate-spacing.js --dry-run  # Preview changes
 *   node scripts/maintenance/migrate-spacing.js --apply    # Apply changes
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");

// Spacing migration mapping
const SPACING_MAP = {
	// Margin/Padding single values
	"-1": "-1b",
	"-2": "-2b",
	"-3": "-3b",
	"-4": "-4b",
	"-5": "-5b",
	"-6": "-6b",
	"-8": "-8b",
	"-10": "-10b",
	"-12": "-12b",
	"-16": "-16b",
	"-24": "-24b",

	// Common fractional values that need manual review
	"-0.5": "-0.5", // Keep as is - not part of grid
	"-1.5": "-1b", // 9px -> 6px (closest)
	"-2.5": "-2b", // 15px -> 12px (closest)
	"-3.5": "-3b", // 21px -> 18px (closest)
	"-4.5": "-4b", // 27px -> 24px (closest)
	"-5.5": "-5b", // 33px -> 30px (closest)

	// Edge cases
	"-0": "-0", // Keep zero as is
	"-14": "-16b", // 84px -> 96px (closest)
	"-32": "-24b", // 192px -> 144px (closest - very large)
};

// Patterns to match spacing classes
const SPACING_PATTERNS = [
	// Margins: m, mt, mb, ml, mr, mx, my
	/\b(m|mt|mb|ml|mr|mx|my)-(0\.5|1\.5|2\.5|3\.5|4\.5|5\.5|[0-9]+)(?!b)\b/g,

	// Padding: p, pt, pb, pl, pr, px, py
	/\b(p|pt|pb|pl|pr|px|py)-(0\.5|1\.5|2\.5|3\.5|4\.5|5\.5|[0-9]+)(?!b)\b/g,

	// Gap utilities
	/\bgap-(0\.5|1\.5|2\.5|3\.5|4\.5|5\.5|[0-9]+)(?!b)\b/g,
	/\bgap-x-(0\.5|1\.5|2\.5|3\.5|4\.5|5\.5|[0-9]+)(?!b)\b/g,
	/\bgap-y-(0\.5|1\.5|2\.5|3\.5|4\.5|5\.5|[0-9]+)(?!b)\b/g,

	// Space utilities
	/\bspace-x-(0\.5|1\.5|2\.5|3\.5|4\.5|5\.5|[0-9]+)(?!b)\b/g,
	/\bspace-y-(0\.5|1\.5|2\.5|3\.5|4\.5|5\.5|[0-9]+)(?!b)\b/g,
];

// Files to exclude
const EXCLUDE_PATTERNS = [
	"**/node_modules/**",
	"**/.astro/**",
	"**/dist/**",
	"**/public/**",
	"**/*.json",
	"**/*.md",
	"**/migrate-spacing.js", // Don't process this file
];

class SpacingMigrator {
	constructor(options = {}) {
		this.dryRun = options.dryRun !== false;
		this.verbose = options.verbose || false;
		this.report = {
			filesProcessed: 0,
			totalReplacements: 0,
			replacementsByFile: {},
			fractionalValues: new Set(),
			unmappedValues: new Set(),
		};
	}

	async findFiles() {
		const files = [];

		async function walkDir(dir) {
			const entries = await fs.readdir(dir, { withFileTypes: true });

			for (const entry of entries) {
				const fullPath = path.join(dir, entry.name);

				// Skip excluded patterns
				if (
					entry.name.startsWith(".") ||
					entry.name === "node_modules" ||
					entry.name === "dist" ||
					entry.name === "public"
				) {
					continue;
				}

				if (entry.isDirectory()) {
					await walkDir(fullPath);
				} else if (entry.isFile()) {
					const ext = path.extname(entry.name);
					if ([".astro", ".tsx", ".jsx"].includes(ext)) {
						files.push(fullPath);
					}
				}
			}
		}

		const srcDir = path.join(projectRoot, "src");
		await walkDir(srcDir);

		return files;
	}

	transformSpacingClass(match, prefix, value) {
		const mappingKey = `-${value}`;

		if (SPACING_MAP[mappingKey]) {
			const newValue = SPACING_MAP[mappingKey].replace("-", "");
			return `${prefix}-${newValue}`;
		}

		// Track unmapped values
		this.report.unmappedValues.add(value);

		// For now, don't change unmapped values
		return match;
	}

	async processFile(filePath) {
		const content = await fs.readFile(filePath, "utf-8");
		let newContent = content;
		const replacements = [];

		for (const pattern of SPACING_PATTERNS) {
			newContent = newContent.replace(pattern, (match, prefix, value) => {
				const transformed = this.transformSpacingClass(match, prefix, value);

				if (transformed !== match) {
					const lineNum = this.getLineNumber(content, content.indexOf(match));
					replacements.push({
						original: match,
						replacement: transformed,
						line: lineNum,
					});
				}

				return transformed;
			});
		}

		if (replacements.length > 0) {
			this.report.filesProcessed++;
			this.report.totalReplacements += replacements.length;
			this.report.replacementsByFile[filePath] = replacements;

			if (!this.dryRun) {
				await fs.writeFile(filePath, newContent, "utf-8");
			}
		}

		return replacements;
	}

	getLineNumber(content, index) {
		if (index === -1) return -1;
		return content.substring(0, index).split("\n").length;
	}

	async run() {
		console.log("🔍 Typography Spacing Migration");
		console.log(`Mode: ${this.dryRun ? "DRY RUN" : "APPLY CHANGES"}`);
		console.log("================================\n");

		const files = await this.findFiles();
		console.log(`Found ${files.length} files to process\n`);

		for (const file of files) {
			await this.processFile(file);
		}

		this.printReport();
	}

	printReport() {
		console.log("\n📊 Migration Report");
		console.log("===================\n");

		console.log(`Files processed: ${this.report.filesProcessed}`);
		console.log(`Total replacements: ${this.report.totalReplacements}`);

		if (this.report.unmappedValues.size > 0) {
			console.log(
				`\n⚠️  Unmapped values found: ${Array.from(this.report.unmappedValues).join(", ")}`,
			);
			console.log("   These values were not changed and may need manual review.");
		}

		console.log("\n📝 Changes by file:");
		console.log("-------------------");

		for (const [file, replacements] of Object.entries(this.report.replacementsByFile)) {
			const relPath = path.relative(projectRoot, file);
			console.log(`\n${relPath}:`);

			// Group replacements by type
			const grouped = replacements.reduce((acc, r) => {
				const type = r.original.split("-")[0];
				if (!acc[type]) acc[type] = [];
				acc[type].push(r);
				return acc;
			}, {});

			for (const [type, items] of Object.entries(grouped)) {
				console.log(
					`  ${type}: ${items.map((i) => `${i.original} → ${i.replacement}`).join(", ")}`,
				);
			}
		}

		if (this.dryRun) {
			console.log("\n✅ Dry run complete. No files were modified.");
			console.log("   Run with --apply to apply changes.\n");
		} else {
			console.log("\n✅ Migration complete! Files have been updated.\n");
		}
	}
}

// CLI handling
async function main() {
	const args = process.argv.slice(2);
	const options = {
		dryRun: !args.includes("--apply"),
		verbose: args.includes("--verbose"),
	};

	const migrator = new SpacingMigrator(options);

	try {
		await migrator.run();
	} catch (error) {
		console.error("❌ Error during migration:", error);
		process.exit(1);
	}
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
	main();
}
