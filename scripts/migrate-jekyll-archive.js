#!/usr/bin/env node

/**
 * Jekyll to Astro Migration Script
 * ================================
 *
 * Purpose: Migrates Jekyll blog posts from the archived nathanlane.github.io to Astro format
 *
 * What it does:
 * - Converts Jekyll frontmatter to Astro-compatible format
 * - Updates image paths from /uploads/ and /assets/ to /images/blog/
 * - Generates descriptions from content if missing
 * - Preserves tags and categories (converts to lowercase)
 * - Copies images to the public directory
 *
 * Usage: node scripts/migration/migrate-jekyll-archive.js
 *
 * Prerequisites:
 * - Requires gray-matter: npm install gray-matter
 * - Jekyll archive must be at: /Users/nathanlane/code/nathanlane_github_io_archive
 *
 * Output:
 * - Migrated posts in: src/content/post/
 * - Images copied to: public/images/blog/
 *
 * Author: Claude Assistant
 * Date: January 2025
 */

const fs = require("node:fs");
const path = require("node:path");
const matter = require("gray-matter");

// Configuration
const JEKYLL_POSTS_DIR = "/Users/nathanlane/code/nathanlane_github_io_archive/_posts";
const JEKYLL_ASSETS_DIR = "/Users/nathanlane/code/nathanlane_github_io_archive";
const ASTRO_CONTENT_DIR = "/Users/nathanlane/code/nathanlane.github.io/src/content/post";
const ASTRO_PUBLIC_DIR = "/Users/nathanlane/code/nathanlane.github.io/public";

// Categories to import (you can modify this)
const IMPORT_CATEGORIES = ["industrial policy", "data", "Not data", "economics", "history"];

// Helper to convert Jekyll filename to Astro filename
function convertFilename(jekyllFilename) {
	// Remove date prefix and .html extension
	const match = jekyllFilename.match(/^\d{4}-\d{2}-\d{2}-(.+)$/);
	if (match) {
		return match[1].replace(".html", ".md");
	}
	return jekyllFilename;
}

// Helper to extract date from Jekyll filename
function extractDate(filename) {
	const match = filename.match(/^(\d{4}-\d{2}-\d{2})/);
	return match ? match[1] : null;
}

// Helper to clean title (remove extra spaces and quotes)
function cleanTitle(title) {
	return title
		.trim()
		.replace(/^["']|["']$/g, "")
		.trim();
}

// Helper to convert Jekyll frontmatter to Astro format
function convertFrontmatter(jekyllFrontmatter, filename) {
	const fileDate = extractDate(filename);

	const astroFrontmatter = {
		title: cleanTitle(jekyllFrontmatter.title || "Untitled"),
		description: jekyllFrontmatter.description || "",
		publishDate: jekyllFrontmatter.date
			? new Date(jekyllFrontmatter.date).toISOString().split("T")[0]
			: fileDate || new Date().toISOString().split("T")[0],
		tags: [],
		draft: jekyllFrontmatter.status === "draft" || false,
	};

	// Add tags
	if (jekyllFrontmatter.tags) {
		if (Array.isArray(jekyllFrontmatter.tags)) {
			astroFrontmatter.tags = jekyllFrontmatter.tags;
		} else if (typeof jekyllFrontmatter.tags === "string") {
			astroFrontmatter.tags = jekyllFrontmatter.tags.split(/\s+/);
		}
	}

	// Add categories as tags
	if (jekyllFrontmatter.categories) {
		const categories = Array.isArray(jekyllFrontmatter.categories)
			? jekyllFrontmatter.categories
			: [jekyllFrontmatter.categories];

		astroFrontmatter.tags = [...astroFrontmatter.tags, ...categories];
	}

	// Remove duplicates and lowercase
	astroFrontmatter.tags = [
		...new Set(astroFrontmatter.tags.map((tag) => tag.toLowerCase().replace(/\s+/g, "-"))),
	];

	// If no description, we'll generate one from content later
	return astroFrontmatter;
}

// Helper to fix image paths and copy images
function processImages(content, _filename) {
	const imagePaths = [];

	// Find all image references
	const imageMatches = content.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g);

	for (const match of imageMatches) {
		const altText = match[1];
		const imagePath = match[2];

		// Handle different image path formats
		if (imagePath.startsWith("/uploads/") || imagePath.startsWith("/assets/")) {
			imagePaths.push({
				original: imagePath,
				altText: altText || "Image",
			});
		}
	}

	// Update image paths in content
	let updatedContent = content;

	imagePaths.forEach(({ original }) => {
		// Convert to new path structure
		const newPath = original
			.replace("/uploads/", "/images/blog/uploads/")
			.replace("/assets/", "/images/blog/assets/");
		updatedContent = updatedContent.replace(original, newPath);
	});

	return { content: updatedContent, images: imagePaths };
}

// Helper to extract description from content if missing
function extractDescription(content, maxLength = 150) {
	// Remove images, links, and markdown formatting
	const plainText = content
		.replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
		.replace(/\[([^\]]+)\]\(.*?\)/g, "$1") // Remove links but keep text
		.replace(/#+\s/g, "") // Remove headers
		.replace(/[*_~`]/g, "") // Remove formatting
		.trim();

	// Get first paragraph
	const firstPara = plainText.split("\n\n")[0];

	if (firstPara.length <= maxLength) {
		return firstPara;
	}

	return `${firstPara.substring(0, maxLength).trim()}...`;
}

// Process Jekyll posts
function migratePost(filePath) {
	const filename = path.basename(filePath);
	const fileContent = fs.readFileSync(filePath, "utf-8");

	// Parse frontmatter and content
	const { data: frontmatter, content } = matter(fileContent);

	// Skip if not in selected categories (optional filter)
	if (frontmatter.categories) {
		const _categories = Array.isArray(frontmatter.categories)
			? frontmatter.categories
			: [frontmatter.categories];

		// Uncomment to filter by categories
		// const hasSelectedCategory = _categories.some(cat =>
		//   IMPORT_CATEGORIES.includes(cat)
		// );
		// if (!hasSelectedCategory) return null;
	}

	// Convert frontmatter
	const astroFrontmatter = convertFrontmatter(frontmatter, filename);

	// Process images
	const { content: processedContent, images } = processImages(content, filename);

	// Convert filename
	const astroFilename = convertFilename(filename);

	// Handle Jekyll-specific content patterns
	const astroContent = processedContent;

	// Add description if missing
	if (!astroFrontmatter.description) {
		astroFrontmatter.description = extractDescription(astroContent);
	}

	// Create new file with Astro frontmatter
	const newContent = matter.stringify(astroContent, astroFrontmatter);

	return {
		filename: astroFilename,
		content: newContent,
		originalDate: astroFrontmatter.publishDate,
		images: images,
	};
}

// Copy images to public directory
function copyImages() {
	const imagesDirs = [
		{ src: "/uploads/", dest: "/images/blog/uploads/" },
		{ src: "/assets/", dest: "/images/blog/assets/" },
	];

	imagesDirs.forEach(({ src, dest }) => {
		const srcPath = path.join(JEKYLL_ASSETS_DIR, src);
		const destPath = path.join(ASTRO_PUBLIC_DIR, dest);

		if (fs.existsSync(srcPath)) {
			// Create destination directory
			fs.mkdirSync(destPath, { recursive: true });

			console.log(`📁 Copying images from ${src} to ${dest}`);

			// Copy directory recursively
			copyDirectoryRecursive(srcPath, destPath);
		}
	});
}

// Helper to copy directory recursively
function copyDirectoryRecursive(src, dest) {
	const entries = fs.readdirSync(src, { withFileTypes: true });

	for (const entry of entries) {
		const srcPath = path.join(src, entry.name);
		const destPath = path.join(dest, entry.name);

		if (entry.isDirectory()) {
			fs.mkdirSync(destPath, { recursive: true });
			copyDirectoryRecursive(srcPath, destPath);
		} else {
			// Only copy image files
			if (/\.(jpg|jpeg|png|gif|svg|webp)$/i.test(entry.name)) {
				fs.copyFileSync(srcPath, destPath);
			}
		}
	}
}

// Main migration function
async function migrate() {
	console.log("🚀 Starting Jekyll to Astro migration...");
	console.log(`📂 Source: ${JEKYLL_POSTS_DIR}`);
	console.log(`📂 Destination: ${ASTRO_CONTENT_DIR}`);

	// Ensure gray-matter is installed
	try {
		require.resolve("gray-matter");
	} catch (e) {
		console.error("❌ Please install gray-matter first: npm install gray-matter");
		process.exit(1);
	}

	// Create destination directory
	fs.mkdirSync(ASTRO_CONTENT_DIR, { recursive: true });

	// Get all markdown and html files
	const files = fs
		.readdirSync(JEKYLL_POSTS_DIR)
		.filter((file) => file.endsWith(".md") || file.endsWith(".html") || file.endsWith(".markdown"));

	console.log(`📝 Found ${files.length} posts to migrate`);

	// Copy images first
	console.log("\n🖼️  Copying images...");
	copyImages();

	let successCount = 0;
	let errorCount = 0;
	let skippedCount = 0;

	console.log("\n📄 Migrating posts...");

	for (const file of files) {
		try {
			const filePath = path.join(JEKYLL_POSTS_DIR, file);
			const result = migratePost(filePath);

			if (!result) {
				skippedCount++;
				continue;
			}

			const { filename, content, originalDate } = result;
			const destPath = path.join(ASTRO_CONTENT_DIR, filename);

			// Check if file already exists
			if (fs.existsSync(destPath)) {
				console.log(`⚠️  Skip: ${filename} (already exists)`);
				skippedCount++;
				continue;
			}

			// Write the converted file
			fs.writeFileSync(destPath, content);
			console.log(`✅ Migrated: ${file} → ${filename} (${originalDate})`);
			successCount++;
		} catch (error) {
			console.error(`❌ Error migrating ${file}:`, error.message);
			errorCount++;
		}
	}

	console.log("\n✨ Migration complete!");
	console.log(`   Success: ${successCount} posts`);
	console.log(`   Skipped: ${skippedCount} posts`);
	console.log(`   Errors: ${errorCount} posts`);

	if (errorCount > 0) {
		console.log("\n⚠️  Please check the error messages above and manually fix any issues.");
	}

	console.log("\n💡 Next steps:");
	console.log(`   1. Review the migrated posts in ${ASTRO_CONTENT_DIR}`);
	console.log("   2. Check that images display correctly");
	console.log("   3. Update any remaining Jekyll-specific syntax");
	console.log(`   4. Test your site with 'npm run dev'`);
	console.log("   5. Consider organizing old posts into series or categories");
}

// Run migration
migrate().catch(console.error);
