#!/usr/bin/env node

/**
 * Clean Migrated Blog Posts
 * =========================
 *
 * Purpose: Systematically clean up blog posts migrated from Jekyll/Squarespace
 *
 * Usage: node scripts/migration/clean-migrated-posts.js [--dry-run] [--file=specific-post.md]
 *
 * Options:
 *   --dry-run    Preview changes without saving
 *   --file=path  Clean a specific file only
 *
 * What it does:
 * - Removes Jekyll template variables ({{ site.baseurl }})
 * - Converts HTML img tags to markdown
 * - Removes unnecessary <p> tags
 * - Fixes broken image paths
 * - Converts HTML tables to markdown
 * - Updates old embed codes
 * - Cleans up messy formatting
 *
 * Author: Claude Assistant
 * Date: January 2025
 */

const fs = require("node:fs");
const path = require("node:path");
const matter = require("gray-matter");
const TurndownService = require("turndown");
const turndownPluginGfm = require("turndown-plugin-gfm");

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const specificFile = args.find((arg) => arg.startsWith("--file="))?.split("=")[1];

// Initialize Turndown for HTML to Markdown conversion
const turndown = new TurndownService({
	headingStyle: "atx",
	codeBlockStyle: "fenced",
	emDelimiter: "*",
});

// Add table support
turndownPluginGfm.gfm(turndown);

// Statistics tracking
const stats = {
	filesProcessed: 0,
	jekyllVarsFixed: 0,
	htmlImagesConverted: 0,
	pTagsRemoved: 0,
	tablesConverted: 0,
	iframesUpdated: 0,
	errors: [],
};

/**
 * Clean Jekyll variables like {{ site.baseurl }}
 */
function cleanJekyllVariables(content) {
	const jekyllVarPattern = /\{\{\s*site\.baseurl\s*\}\}/g;
	const matches = content.match(jekyllVarPattern) || [];
	stats.jekyllVarsFixed += matches.length;

	// Remove Jekyll variables (they're not needed in Astro)
	return content.replace(jekyllVarPattern, "");
}

/**
 * Convert HTML img tags to markdown
 */
function convertHtmlImages(content) {
	// Match various forms of HTML images
	const imgPattern = /<img\s+[^>]*src=["']([^"']+)["'][^>]*\/?>/gi;
	const divImagePattern =
		/<div\s+class=["']media\s+image["'][^>]*>[\s\S]*?<img\s+[^>]*src=["']([^"']+)["'][^>]*\/?>[\s\S]*?<\/div>/gi;

	let newContent = content;

	// First, handle wrapped images
	newContent = newContent.replace(divImagePattern, (match, src) => {
		stats.htmlImagesConverted++;
		// Extract alt text if present
		const altMatch = match.match(/alt=["']([^"']+)["']/);
		const alt = altMatch ? altMatch[1] : "Image";
		return `![${alt}](${src})`;
	});

	// Then handle standalone images
	newContent = newContent.replace(imgPattern, (match, src) => {
		stats.htmlImagesConverted++;
		const altMatch = match.match(/alt=["']([^"']+)["']/);
		const alt = altMatch ? altMatch[1] : "Image";
		return `![${alt}](${src})`;
	});

	return newContent;
}

/**
 * Remove unnecessary <p> tags
 */
function removeUnnecessaryPTags(content) {
	// Count p tags before removal
	const pTagCount = (content.match(/<\/?p>/gi) || []).length / 2;
	stats.pTagsRemoved += pTagCount;

	// Remove p tags that wrap entire paragraphs
	let newContent = content.replace(/<p>\s*/gi, "\n");
	newContent = newContent.replace(/\s*<\/p>/gi, "\n");

	// Clean up multiple newlines
	newContent = newContent.replace(/\n{3,}/g, "\n\n");

	return newContent;
}

/**
 * Convert HTML tables to markdown
 */
function convertHtmlTables(content) {
	const tablePattern = /<table[^>]*>[\s\S]*?<\/table>/gi;
	const tables = content.match(tablePattern) || [];
	stats.tablesConverted += tables.length;

	// Use turndown to convert tables
	return content.replace(tablePattern, (match) => {
		return `\n${turndown.turndown(match)}\n`;
	});
}

/**
 * Update old iframe embeds
 */
function updateIframes(content) {
	// Update iframe attributes
	const newContent = content.replace(/<iframe([^>]+)>/gi, (match, attrs) => {
		stats.iframesUpdated++;
		// Remove deprecated attributes
		let newAttrs = attrs
			.replace(/\s*frameborder=["']?\d+["']?/gi, "")
			.replace(/\s*marginwidth=["']?\d+["']?/gi, "")
			.replace(/\s*marginheight=["']?\d+["']?/gi, "")
			.replace(/\s*scrolling=["']?\w+["']?/gi, "");

		// Update HTTP to HTTPS
		newAttrs = newAttrs.replace(/http:\/\//g, "https://");

		// Add loading="lazy" if not present
		if (!newAttrs.includes("loading=")) {
			newAttrs += ' loading="lazy"';
		}

		return `<iframe${newAttrs}>`;
	});

	return newContent;
}

/**
 * Fix broken image paths
 */
function fixImagePaths(content) {
	// Common broken patterns
	const patterns = [
		// Jekyll assets path
		{ from: /\/assets\//g, to: "/images/" },
		// WordPress style uploads
		{ from: /\/wp-content\/uploads\/\d{4}\/\d{2}\//g, to: "/images/blog/" },
		// Relative paths that might be broken
		{ from: /\.\.\//g, to: "/" },
	];

	let newContent = content;
	patterns.forEach((pattern) => {
		newContent = newContent.replace(pattern.from, pattern.to);
	});

	return newContent;
}

/**
 * Clean up formatting issues
 */
function cleanFormatting(content) {
	let newContent = content;

	// Remove center tags
	newContent = newContent.replace(/<\/?center>/gi, "");

	// Convert <b> and <strong> to markdown
	newContent = newContent.replace(/<(b|strong)>(.*?)<\/(b|strong)>/gi, "**$2**");

	// Convert <i> and <em> to markdown
	newContent = newContent.replace(/<(i|em)>(.*?)<\/(i|em)>/gi, "*$2*");

	// Convert <h1> through <h6> to markdown
	for (let i = 1; i <= 6; i++) {
		const heading = "#".repeat(i);
		newContent = newContent.replace(
			new RegExp(`<h${i}[^>]*>(.*?)</h${i}>`, "gi"),
			`\n${heading} $1\n`,
		);
	}

	// Remove <small> tags (or convert to normal text)
	newContent = newContent.replace(/<\/?small>/gi, "");

	// Clean up excessive whitespace
	newContent = newContent.replace(/\n{3,}/g, "\n\n");
	newContent = newContent.replace(/[ \t]+$/gm, ""); // Trailing spaces

	return newContent;
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
		content = cleanJekyllVariables(content);
		content = convertHtmlImages(content);
		content = removeUnnecessaryPTags(content);
		content = convertHtmlTables(content);
		content = updateIframes(content);
		content = fixImagePaths(content);
		content = cleanFormatting(content);

		// Clean frontmatter
		if (data.description?.includes("<")) {
			// Remove HTML from description
			data.description = turndown.turndown(data.description).substring(0, 160);
		}

		// Check if content changed
		if (content !== originalContent) {
			if (!dryRun) {
				// Write the cleaned content back
				const newContent = matter.stringify(content, data);
				fs.writeFileSync(filePath, newContent);
			}

			console.log(`✓ Cleaned: ${path.basename(filePath)}`);
			stats.filesProcessed++;

			if (dryRun) {
				console.log("  Preview of changes:");
				console.log(
					"  - Jekyll vars fixed:",
					(content.match(/\{\{/g) || []).length < (originalContent.match(/\{\{/g) || []).length,
				);
				console.log(
					"  - HTML images converted:",
					content.includes("<img") < originalContent.includes("<img"),
				);
				console.log(
					"  - P tags removed:",
					(content.match(/<p>/g) || []).length < (originalContent.match(/<p>/g) || []).length,
				);
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
	console.log("Blog Post Cleanup Tool");
	console.log("=====================\n");

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
	console.log(`Jekyll variables fixed: ${stats.jekyllVarsFixed}`);
	console.log(`HTML images converted: ${stats.htmlImagesConverted}`);
	console.log(`P tags removed: ${stats.pTagsRemoved}`);
	console.log(`Tables converted: ${stats.tablesConverted}`);
	console.log(`Iframes updated: ${stats.iframesUpdated}`);

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
	require.resolve("turndown");
	require.resolve("turndown-plugin-gfm");
} catch (e) {
	console.error("Missing dependencies. Please install:");
	console.error("npm install gray-matter turndown turndown-plugin-gfm");
	process.exit(1);
}

// Run the script
main();
