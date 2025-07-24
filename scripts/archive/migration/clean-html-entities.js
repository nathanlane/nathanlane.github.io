#!/usr/bin/env node

/**
 * Clean HTML Entities and Messy Content
 * =====================================
 *
 * Purpose: Clean up HTML entities, special characters, and messy formatting
 *          from migrated blog posts
 *
 * Usage: node scripts/migration/clean-html-entities.js [--dry-run] [--file=specific-post.md]
 *
 * Options:
 *   --dry-run    Preview changes without saving
 *   --file=path  Clean a specific file only
 *
 * What it does:
 * - Converts HTML entities (&nbsp;, &gt;, &lt;, etc.) to proper characters
 * - Fixes double-encoded entities
 * - Cleans up excessive whitespace
 * - Converts smart quotes and special characters
 * - Removes zero-width spaces and other invisible characters
 * - Fixes common OCR/paste artifacts
 *
 * Author: Claude Assistant
 * Date: January 2025
 */

const fs = require("node:fs");
const path = require("node:path");
const matter = require("gray-matter");

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const specificFile = args.find((arg) => arg.startsWith("--file="))?.split("=")[1];

// Statistics tracking
const stats = {
	filesProcessed: 0,
	entitiesFixed: 0,
	whitespaceFixed: 0,
	specialCharsFixed: 0,
	errors: [],
};

/**
 * Common HTML entities to replace
 */
const htmlEntities = {
	// Common entities
	"&nbsp;": " ",
	"&amp;": "&",
	"&lt;": "<",
	"&gt;": ">",
	"&quot;": '"',
	"&apos;": "'",
	"&#39;": "'",
	"&#x27;": "'",

	// Dashes and hyphens
	"&ndash;": "–",
	"&mdash;": "—",
	"&#8211;": "–",
	"&#8212;": "—",
	"&minus;": "−",

	// Quotes
	"&ldquo;": "\u201C",
	"&rdquo;": "\u201D",
	"&lsquo;": "\u2018",
	"&rsquo;": "\u2019",
	"&#8220;": "\u201C",
	"&#8221;": "\u201D",
	"&#8216;": "\u2018",
	"&#8217;": "\u2019",

	// Special characters
	"&hellip;": "…",
	"&#8230;": "…",
	"&copy;": "©",
	"&reg;": "®",
	"&trade;": "™",
	"&euro;": "€",
	"&pound;": "£",
	"&yen;": "¥",
	"&cent;": "¢",

	// Mathematical
	"&times;": "×",
	"&divide;": "÷",
	"&plusmn;": "±",
	"&le;": "≤",
	"&ge;": "≥",
	"&ne;": "≠",
	"&asymp;": "≈",

	// Arrows
	"&larr;": "←",
	"&rarr;": "→",
	"&uarr;": "↑",
	"&darr;": "↓",
	"&harr;": "↔",

	// Fractions
	"&frac12;": "½",
	"&frac14;": "¼",
	"&frac34;": "¾",
	"&frac13;": "⅓",
	"&frac23;": "⅔",

	// Other
	"&deg;": "°",
	"&sect;": "§",
	"&para;": "¶",
	"&bull;": "•",
	"&middot;": "·",
};

/**
 * Clean HTML entities
 */
function cleanHtmlEntities(content) {
	let cleaned = content;
	let count = 0;

	// Replace known entities
	Object.entries(htmlEntities).forEach(([entity, replacement]) => {
		const regex = new RegExp(entity.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
		const matches = cleaned.match(regex);
		if (matches) {
			count += matches.length;
			cleaned = cleaned.replace(regex, replacement);
		}
	});

	// Handle numeric entities (&#123; format)
	const numericEntityRegex = /&#(\d+);/g;
	const numericMatches = cleaned.match(numericEntityRegex) || [];
	count += numericMatches.length;
	cleaned = cleaned.replace(numericEntityRegex, (match, code) => {
		return String.fromCharCode(Number.parseInt(code));
	});

	// Handle hex entities (&#x1F; format)
	const hexEntityRegex = /&#x([0-9A-Fa-f]+);/g;
	const hexMatches = cleaned.match(hexEntityRegex) || [];
	count += hexMatches.length;
	cleaned = cleaned.replace(hexEntityRegex, (match, code) => {
		return String.fromCharCode(Number.parseInt(code, 16));
	});

	stats.entitiesFixed += count;
	return cleaned;
}

/**
 * Clean up whitespace issues
 */
function cleanWhitespace(content) {
	let cleaned = content;
	let count = 0;

	// Remove zero-width spaces and other invisible characters
	const invisibleChars = [
		"\u200B", // Zero-width space
		"\u200C", // Zero-width non-joiner
		"\u200D", // Zero-width joiner
		"\uFEFF", // Zero-width no-break space
		"\u00A0", // Non-breaking space (if not caught by &nbsp;)
	];

	invisibleChars.forEach((char) => {
		const regex = new RegExp(char, "g");
		const matches = cleaned.match(regex);
		if (matches) {
			count += matches.length;
			cleaned = cleaned.replace(regex, " ");
		}
	});

	// Fix multiple spaces (but preserve intentional formatting like tables)
	const multiSpaceRegex = /([^\n]) {2,}([^\n])/g;
	const multiSpaceMatches = cleaned.match(multiSpaceRegex) || [];
	count += multiSpaceMatches.length;
	cleaned = cleaned.replace(multiSpaceRegex, "$1 $2");

	// Clean up space before punctuation
	cleaned = cleaned.replace(/ +([.,;:!?])/g, "$1");

	// Remove trailing spaces at end of lines
	cleaned = cleaned.replace(/ +$/gm, "");

	stats.whitespaceFixed += count;
	return cleaned;
}

/**
 * Fix special characters and formatting
 */
function cleanSpecialCharacters(content) {
	let cleaned = content;
	let count = 0;

	// Convert smart quotes to straight quotes (optional - comment out if you want to keep them)
	const smartQuoteReplacements = {
		"\u201C": '"',
		"\u201D": '"',
		"\u2018": "'",
		"\u2019": "'",
	};

	Object.entries(smartQuoteReplacements).forEach(([smart, straight]) => {
		const regex = new RegExp(smart, "g");
		const matches = cleaned.match(regex);
		if (matches) {
			count += matches.length;
			cleaned = cleaned.replace(regex, straight);
		}
	});

	// Fix common OCR/paste artifacts
	cleaned = cleaned.replace(/\. \. \./g, "..."); // Spaced ellipsis
	cleaned = cleaned.replace(/\s*-\s*-\s*-\s*/g, "---"); // Spaced em dash
	cleaned = cleaned.replace(/\s*-\s*-\s*/g, "--"); // Spaced en dash

	// Fix file path artifacts like "File: Save As > Image > TIFFs"
	cleaned = cleaned.replace(/File:\s*Save As\s*&gt;\s*Image\s*&gt;\s*TIFFs?/gi, "[Save as TIFF]");
	cleaned = cleaned.replace(/File:\s*Save As\s*>\s*Image\s*>\s*TIFFs?/gi, "[Save as TIFF]");

	stats.specialCharsFixed += count;
	return cleaned;
}

/**
 * Clean double-encoded entities
 */
function cleanDoubleEncoded(content) {
	let cleaned = content;

	// Fix double-encoded entities like &amp;gt; -> &gt; -> >
	cleaned = cleaned.replace(/&amp;([a-zA-Z]+);/g, "&$1;");
	cleaned = cleaned.replace(/&amp;#(\d+);/g, "&#$1;");
	cleaned = cleaned.replace(/&amp;#x([0-9A-Fa-f]+);/g, "&#x$1;");

	return cleaned;
}

/**
 * Process a single file
 */
function processFile(filePath) {
	try {
		const fileContent = fs.readFileSync(filePath, "utf-8");
		const parsed = matter(fileContent);
		let { content, data } = parsed;

		const originalContent = content;

		// Apply all cleaning functions
		content = cleanDoubleEncoded(content);
		content = cleanHtmlEntities(content);
		content = cleanWhitespace(content);
		content = cleanSpecialCharacters(content);

		// Also clean the frontmatter if needed
		if (data.title) {
			data.title = cleanHtmlEntities(data.title);
			data.title = cleanSpecialCharacters(data.title);
		}
		if (data.description) {
			data.description = cleanHtmlEntities(data.description);
			data.description = cleanSpecialCharacters(data.description);
		}

		// Check if content changed
		if (content !== originalContent || JSON.stringify(data) !== JSON.stringify(parsed.data)) {
			if (!dryRun) {
				// Write the cleaned content back
				const newContent = matter.stringify(content, data);
				fs.writeFileSync(filePath, newContent);
			}

			console.log(`✓ Cleaned: ${path.basename(filePath)}`);
			stats.filesProcessed++;

			if (dryRun) {
				console.log("  Preview of changes:");
				// Show a sample of what was found
				const entities = originalContent.match(/&[a-zA-Z]+;|&#\d+;|&#x[0-9A-Fa-f]+;/g);
				if (entities) {
					console.log(`  - Found ${entities.length} HTML entities`);
					console.log(`    Examples: ${entities.slice(0, 3).join(", ")}...`);
				}
				const nbspCount = (originalContent.match(/&nbsp;/g) || []).length;
				if (nbspCount > 0) {
					console.log(`  - Found ${nbspCount} &nbsp; entities`);
				}
			}
		} else {
			console.log(`○ No changes needed: ${path.basename(filePath)}`);
		}
	} catch (error) {
		console.error(`✗ Error processing ${filePath}:`, error.message);
		stats.errors.push({ file: filePath, error: error.message });
	}
}

/**
 * Main execution
 */
function main() {
	console.log("HTML Entity Cleanup Tool");
	console.log("=======================\n");

	if (dryRun) {
		console.log("🔍 DRY RUN MODE - No files will be modified\n");
	}

	const postsDir = path.join(process.cwd(), "src/content/post");

	if (specificFile) {
		// Process single file
		const filePath = path.isAbsolute(specificFile)
			? specificFile
			: path.join(postsDir, specificFile);

		if (fs.existsSync(filePath)) {
			processFile(filePath);
		} else {
			console.error(`File not found: ${filePath}`);
			process.exit(1);
		}
	} else {
		// Process all markdown files
		const files = fs
			.readdirSync(postsDir)
			.filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
			.map((file) => path.join(postsDir, file));

		console.log(`Found ${files.length} posts to check...\n`);

		files.forEach(processFile);
	}

	// Print summary
	console.log("\n\nSummary");
	console.log("=======");
	console.log(`Files processed: ${stats.filesProcessed}`);
	console.log(`HTML entities fixed: ${stats.entitiesFixed}`);
	console.log(`Whitespace issues fixed: ${stats.whitespaceFixed}`);
	console.log(`Special characters fixed: ${stats.specialCharsFixed}`);

	if (stats.errors.length > 0) {
		console.log(`\nErrors (${stats.errors.length}):`);
		stats.errors.forEach((err) => {
			console.log(`  - ${path.basename(err.file)}: ${err.error}`);
		});
	}

	if (dryRun) {
		console.log("\n💡 Run without --dry-run to apply changes");
	}
}

// Check if required dependencies are installed
try {
	require.resolve("gray-matter");
} catch (e) {
	console.error("Missing dependency. Please install:");
	console.error("pnpm add -D gray-matter");
	process.exit(1);
}

// Run the script
main();
