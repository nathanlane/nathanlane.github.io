#!/usr/bin/env node

/**
 * Fix Blog Images
 * ===============
 *
 * Purpose: Find and fix broken images in blog posts
 *
 * Usage: node scripts/migration/fix-blog-images.js [--check-only] [--download]
 *
 * Options:
 *   --check-only   Only report broken images, don't fix
 *   --download     Attempt to download external images
 *
 * What it does:
 * - Scans all blog posts for image references
 * - Checks if local images exist
 * - Reports broken image paths
 * - Optionally downloads external images
 * - Updates paths to working images
 *
 * Author: Claude Assistant
 * Date: January 2025
 */

const fs = require("node:fs");
const path = require("node:path");
const https = require("node:https");
const http = require("node:http");
const matter = require("gray-matter");

// Parse arguments
const args = process.argv.slice(2);
const checkOnly = args.includes("--check-only");
const downloadExternal = args.includes("--download");

// Image storage paths
const imagesDirs = [
	"public/images",
	"public/images/blog",
	"public/images/uploads",
	"src/assets/images",
];

// Statistics
const stats = {
	totalImages: 0,
	brokenImages: 0,
	fixedImages: 0,
	externalImages: 0,
	downloadedImages: 0,
};

/**
 * Extract all image references from content
 */
function findImages(content) {
	const images = [];

	// Markdown images: ![alt](src)
	const mdImageRegex = /!\[[^\]]*\]\(([^)]+)\)/g;
	let match = mdImageRegex.exec(content);
	while (match !== null) {
		images.push({ type: "markdown", src: match[1], full: match[0] });
		match = mdImageRegex.exec(content);
	}

	// HTML images: <img src="...">
	const htmlImageRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
	match = htmlImageRegex.exec(content);
	while (match !== null) {
		images.push({ type: "html", src: match[1], full: match[0] });
		match = htmlImageRegex.exec(content);
	}

	return images;
}

/**
 * Check if an image path exists locally
 */
function checkLocalImage(imagePath) {
	// Remove any query strings or fragments
	const cleanPath = imagePath.split("?")[0].split("#")[0];

	// Try different base paths
	const possiblePaths = [
		path.join(process.cwd(), "public", cleanPath),
		path.join(process.cwd(), cleanPath),
		path.join(process.cwd(), "src/assets", cleanPath),
	];

	// If path doesn't start with /, try relative to different directories
	if (!cleanPath.startsWith("/")) {
		imagesDirs.forEach((dir) => {
			possiblePaths.push(path.join(process.cwd(), dir, cleanPath));
		});
	}

	for (const p of possiblePaths) {
		if (fs.existsSync(p)) {
			return { exists: true, path: p };
		}
	}

	return { exists: false, tried: possiblePaths };
}

/**
 * Suggest a fix for a broken image path
 */
function suggestImageFix(brokenPath) {
	const basename = path.basename(brokenPath);

	// Search for the file in all image directories
	for (const dir of imagesDirs) {
		const fullDir = path.join(process.cwd(), dir);
		if (fs.existsSync(fullDir)) {
			const files = fs.readdirSync(fullDir, { recursive: true });
			const found = files.find((f) => path.basename(f) === basename);
			if (found) {
				const relativePath = path.join(dir.replace("public", ""), found);
				return relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
			}
		}
	}

	return null;
}

/**
 * Download an external image
 */
async function downloadImage(url, targetPath) {
	return new Promise((resolve, reject) => {
		const protocol = url.startsWith("https") ? https : http;

		protocol
			.get(url, (response) => {
				if (response.statusCode !== 200) {
					reject(new Error(`Failed to download: ${response.statusCode}`));
					return;
				}

				const dir = path.dirname(targetPath);
				if (!fs.existsSync(dir)) {
					fs.mkdirSync(dir, { recursive: true });
				}

				const file = fs.createWriteStream(targetPath);
				response.pipe(file);

				file.on("finish", () => {
					file.close();
					resolve();
				});

				file.on("error", (err) => {
					fs.unlink(targetPath, () => {}); // Delete incomplete file
					reject(err);
				});
			})
			.on("error", reject);
	});
}

/**
 * Process a single blog post
 */
async function processPost(filePath) {
	const fileContent = fs.readFileSync(filePath, "utf-8");
	const parsed = matter(fileContent);
	const { content, data } = parsed;

	const images = findImages(content);
	const filename = path.basename(filePath);
	let hasIssues = false;
	let modifiedContent = content;

	for (const img of images) {
		stats.totalImages++;

		// Skip data URLs and external images (unless downloading)
		if (img.src.startsWith("data:")) continue;

		if (img.src.startsWith("http://") || img.src.startsWith("https://")) {
			stats.externalImages++;

			if (downloadExternal && !checkOnly) {
				try {
					// Generate local path for external image
					const url = new URL(img.src);
					const imgName = path.basename(url.pathname) || "image.jpg";
					const localPath = `/images/blog/${imgName}`;
					const targetPath = path.join(process.cwd(), "public", localPath);

					console.log(`  ⬇️  Downloading: ${img.src}`);
					await downloadImage(img.src, targetPath);

					// Update content with local path
					modifiedContent = modifiedContent.replace(
						img.full,
						img.type === "markdown"
							? `![Image](${localPath})`
							: `<img src="${localPath}" alt="Image">`,
					);

					stats.downloadedImages++;
					console.log(`  ✓ Downloaded to: ${localPath}`);
				} catch (error) {
					console.log(`  ✗ Download failed: ${error.message}`);
				}
			}
			continue;
		}

		// Check local image
		const check = checkLocalImage(img.src);

		if (!check.exists) {
			if (!hasIssues) {
				console.log(`\n📄 ${filename}`);
				hasIssues = true;
			}

			stats.brokenImages++;
			console.log(`  ✗ Broken: ${img.src}`);

			// Try to find and suggest a fix
			const suggestion = suggestImageFix(img.src);
			if (suggestion) {
				console.log(`    → Suggested: ${suggestion}`);

				if (!checkOnly) {
					// Apply the fix
					modifiedContent = modifiedContent.replace(
						img.full,
						img.type === "markdown"
							? img.full.replace(img.src, suggestion)
							: img.full.replace(`"${img.src}"`, `"${suggestion}"`),
					);
					stats.fixedImages++;
				}
			}
		}
	}

	// Save changes if needed
	if (!checkOnly && modifiedContent !== content) {
		const newContent = matter.stringify(modifiedContent, data);
		fs.writeFileSync(filePath, newContent);
		console.log(`  💾 Saved changes to ${filename}`);
	}
}

/**
 * Main execution
 */
async function main() {
	console.log("Blog Image Fix Tool");
	console.log("==================\n");

	if (checkOnly) {
		console.log("🔍 CHECK ONLY MODE - No changes will be made\n");
	}

	if (downloadExternal) {
		console.log("⬇️  DOWNLOAD MODE - External images will be downloaded\n");
	}

	const postsDir = path.join(process.cwd(), "src/content/post");
	const files = fs
		.readdirSync(postsDir)
		.filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
		.map((file) => path.join(postsDir, file));

	console.log(`Checking ${files.length} posts for images...\n`);

	// Process all posts
	for (const file of files) {
		await processPost(file);
	}

	// Print summary
	console.log("\n\nSummary");
	console.log("=======");
	console.log(`Total images found: ${stats.totalImages}`);
	console.log(`Broken images: ${stats.brokenImages}`);
	console.log(`External images: ${stats.externalImages}`);

	if (!checkOnly) {
		console.log(`Images fixed: ${stats.fixedImages}`);
		if (downloadExternal) {
			console.log(`Images downloaded: ${stats.downloadedImages}`);
		}
	}

	if (stats.brokenImages > 0 && checkOnly) {
		console.log("\n💡 Run without --check-only to fix broken paths");
	}

	// Create image directories if they don't exist
	if (!checkOnly) {
		imagesDirs.forEach((dir) => {
			const fullPath = path.join(process.cwd(), dir);
			if (!fs.existsSync(fullPath)) {
				fs.mkdirSync(fullPath, { recursive: true });
				console.log(`\n📁 Created directory: ${dir}`);
			}
		});
	}
}

// Check dependencies
try {
	require.resolve("gray-matter");
} catch (e) {
	console.error("Missing dependency. Please install:");
	console.error("npm install gray-matter");
	process.exit(1);
}

// Run
main().catch(console.error);
