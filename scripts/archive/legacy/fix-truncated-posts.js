#!/usr/bin/env node

/**
 * Fix Truncated Posts
 * Re-migrates posts that were truncated during initial migration
 */

const fs = require("node:fs");
const path = require("node:path");
const matter = require("gray-matter");

const JEKYLL_POSTS_DIR = "/Users/nathanlane/code/nathanlane_github_io_archive/_posts";
const ASTRO_CONTENT_DIR = "/Users/nathanlane/code/nathanlane.github.io/src/content/post";

console.log("🔧 Fixing truncated posts...\n");

// Helper functions from migration script
function convertFilename(jekyllFilename) {
	const match = jekyllFilename.match(/^\d{4}-\d{2}-\d{2}-(.+)$/);
	if (match) {
		return match[1].replace(".html", ".md").replace(".markdown", ".md");
	}
	return jekyllFilename;
}

// Utility functions removed - not used in this script

function processImages(content) {
	let updatedContent = content;

	// Update image paths
	updatedContent = updatedContent.replace(/\/uploads\//g, "/images/blog/uploads/");
	updatedContent = updatedContent.replace(/\/assets\//g, "/images/blog/assets/");

	return updatedContent;
}

function fixTruncatedPost(jekyllFile) {
	const jekyllPath = path.join(JEKYLL_POSTS_DIR, jekyllFile);
	const astroFilename = convertFilename(jekyllFile);
	const astroPath = path.join(ASTRO_CONTENT_DIR, astroFilename);

	try {
		// Read Jekyll post
		const jekyllContent = fs.readFileSync(jekyllPath, "utf-8");
		const { data: _jekyllFrontmatter, content: jekyllBody } = matter(jekyllContent);

		// Read existing Astro post to preserve any manual edits to frontmatter
		let astroFrontmatter = {};
		if (fs.existsSync(astroPath)) {
			const existingContent = fs.readFileSync(astroPath, "utf-8");
			const { data } = matter(existingContent);
			astroFrontmatter = data;
		}

		// Update content while preserving frontmatter edits
		const processedContent = processImages(jekyllBody);

		// Ensure we have the full content
		if (processedContent.trim().length < jekyllBody.trim().length * 0.9) {
			console.error(`❌ Content still seems truncated for ${jekyllFile}`);
			return false;
		}

		// Write the full content back
		const newContent = matter.stringify(processedContent, astroFrontmatter);
		fs.writeFileSync(astroPath, newContent);

		console.log(`✅ Fixed: ${astroFilename}`);
		console.log(`   Content length: ${processedContent.length} chars`);

		return true;
	} catch (error) {
		console.error(`❌ Error fixing ${jekyllFile}: ${error.message}`);
		return false;
	}
}

// Load truncation report if it exists
let postsToFix = [];

if (fs.existsSync("truncation-report.json")) {
	const report = JSON.parse(fs.readFileSync("truncation-report.json", "utf-8"));
	postsToFix = report.truncated.map((t) => t.jekyllFile);

	console.log(`Found ${postsToFix.length} truncated posts from report.\n`);
} else {
	console.log("No truncation report found. Checking all posts...\n");

	// Check all posts
	const jekyllFiles = fs
		.readdirSync(JEKYLL_POSTS_DIR)
		.filter((file) => file.endsWith(".md") || file.endsWith(".html") || file.endsWith(".markdown"));

	jekyllFiles.forEach((jekyllFile) => {
		const astroFilename = convertFilename(jekyllFile);
		const astroPath = path.join(ASTRO_CONTENT_DIR, astroFilename);

		if (fs.existsSync(astroPath)) {
			const jekyllContent = fs.readFileSync(path.join(JEKYLL_POSTS_DIR, jekyllFile), "utf-8");
			const astroContent = fs.readFileSync(astroPath, "utf-8");

			const { content: jekyllBody } = matter(jekyllContent);
			const { content: astroBody } = matter(astroContent);

			if (astroBody.trim().length < jekyllBody.trim().length * 0.8) {
				postsToFix.push(jekyllFile);
			}
		}
	});
}

// Fix truncated posts
let fixedCount = 0;
let failedCount = 0;

postsToFix.forEach((jekyllFile) => {
	if (fixTruncatedPost(jekyllFile)) {
		fixedCount++;
	} else {
		failedCount++;
	}
});

console.log("\n✨ Fix complete!");
console.log(`   Fixed: ${fixedCount} posts`);
console.log(`   Failed: ${failedCount} posts`);

// Clean up report file
if (fs.existsSync("truncation-report.json") && fixedCount > 0) {
	fs.unlinkSync("truncation-report.json");
	console.log("\n🧹 Cleaned up truncation report.");
}
