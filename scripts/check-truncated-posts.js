#!/usr/bin/env node

/**
 * Check for Truncated Posts
 * Compares migrated posts with originals to find truncation issues
 */

const fs = require("node:fs");
const path = require("node:path");
const matter = require("gray-matter");

const JEKYLL_POSTS_DIR = "/Users/nathanlane/code/nathanlane_github_io_archive/_posts";
const ASTRO_CONTENT_DIR = "/Users/nathanlane/code/nathanlane.github.io/src/content/post";

console.log("🔍 Checking for truncated posts...\n");

// Helper to convert Jekyll filename to Astro filename
function getAstroFilename(jekyllFilename) {
	const match = jekyllFilename.match(/^\d{4}-\d{2}-\d{2}-(.+)$/);
	if (match) {
		return match[1].replace(".html", ".md");
	}
	return jekyllFilename;
}

// Get all Jekyll posts
const jekyllFiles = fs
	.readdirSync(JEKYLL_POSTS_DIR)
	.filter((file) => file.endsWith(".md") || file.endsWith(".html") || file.endsWith(".markdown"));

const truncatedPosts = [];
const missingPosts = [];
let checkedCount = 0;

jekyllFiles.forEach((jekyllFile) => {
	const jekyllPath = path.join(JEKYLL_POSTS_DIR, jekyllFile);
	const astroFilename = getAstroFilename(jekyllFile);
	const astroPath = path.join(ASTRO_CONTENT_DIR, astroFilename);

	try {
		if (!fs.existsSync(astroPath)) {
			missingPosts.push(jekyllFile);
			return;
		}

		// Read both files
		const jekyllContent = fs.readFileSync(jekyllPath, "utf-8");
		const astroContent = fs.readFileSync(astroPath, "utf-8");

		// Parse content
		const { content: jekyllBody } = matter(jekyllContent);
		const { content: astroBody } = matter(astroContent);

		// Compare content length (rough check)
		const jekyllLength = jekyllBody.trim().length;
		const astroLength = astroBody.trim().length;

		// If Astro version is significantly shorter, it might be truncated
		if (astroLength < jekyllLength * 0.8) {
			const percentageRetained = Math.round((astroLength / jekyllLength) * 100);
			truncatedPosts.push({
				jekyllFile,
				astroFile: astroFilename,
				jekyllLength,
				astroLength,
				percentageRetained,
				difference: jekyllLength - astroLength,
			});
		}

		checkedCount++;
	} catch (error) {
		console.error(`Error checking ${jekyllFile}: ${error.message}`);
	}
});

// Report results
console.log("=".repeat(60));
console.log("📊 TRUNCATION CHECK RESULTS");
console.log("=".repeat(60));
console.log(`✅ Checked: ${checkedCount} posts`);
console.log(`⚠️  Possibly truncated: ${truncatedPosts.length} posts`);
console.log(`❌ Missing from migration: ${missingPosts.length} posts`);
console.log("=".repeat(60));

if (truncatedPosts.length > 0) {
	console.log("\n⚠️  POSSIBLY TRUNCATED POSTS:\n");
	truncatedPosts
		.sort((a, b) => a.percentageRetained - b.percentageRetained)
		.forEach(({ jekyllFile, astroFile, jekyllLength, astroLength, percentageRetained }) => {
			console.log(`📄 ${astroFile}`);
			console.log(`   Original: ${jekyllFile}`);
			console.log(
				`   Content retained: ${percentageRetained}% (${astroLength}/${jekyllLength} chars)`,
			);
			console.log("");
		});
}

if (missingPosts.length > 0) {
	console.log("\n❌ POSTS NOT MIGRATED:\n");
	missingPosts.forEach((file) => {
		console.log(`   • ${file}`);
	});
}

// Save report
const report = {
	checked: checkedCount,
	truncated: truncatedPosts,
	missing: missingPosts,
	timestamp: new Date().toISOString(),
};

fs.writeFileSync("truncation-report.json", JSON.stringify(report, null, 2));
console.log("\n💾 Detailed report saved to truncation-report.json");

if (truncatedPosts.length > 0) {
	console.log("\n💡 To fix truncated posts, run:");
	console.log("   node fix-truncated-posts.js");
}
