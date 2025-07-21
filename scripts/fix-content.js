#!/usr/bin/env node

/**
 * Auto-fix Content Issues
 * Automatically fixes common content validation errors
 */

const fs = require("node:fs");
const path = require("node:path");
const matter = require("gray-matter");

const CONTENT_DIR = path.join(__dirname, "src/content/post");
const MAX_TITLE_LENGTH = 60;
const MIN_DESC_LENGTH = 20;
const MAX_DESC_LENGTH = 300;

console.log("🔧 Auto-fixing content issues...\n");

const files = fs
	.readdirSync(CONTENT_DIR)
	.filter((file) => file.endsWith(".md") || file.endsWith(".mdx"));

const fixed = {
	titles: 0,
	descriptions: 0,
	htmlCleaned: 0,
	dates: 0,
};

files.forEach((file) => {
	const filePath = path.join(CONTENT_DIR, file);
	let modified = false;

	try {
		const fileContent = fs.readFileSync(filePath, "utf-8");
		const { data: frontmatter, content } = matter(fileContent);

		// Fix title length
		if (frontmatter.title && frontmatter.title.length > MAX_TITLE_LENGTH) {
			const originalTitle = frontmatter.title;

			// Truncate intelligently
			let truncated = originalTitle.substring(0, MAX_TITLE_LENGTH - 3);
			const lastSpace = truncated.lastIndexOf(" ");
			if (lastSpace > 40) {
				truncated = truncated.substring(0, lastSpace);
			}
			truncated += "...";

			// If no description or short description, use original title
			if (!frontmatter.description || frontmatter.description.length < 100) {
				frontmatter.description = originalTitle;
			}

			frontmatter.title = truncated;
			modified = true;
			fixed.titles++;

			console.log(`📝 Fixed title: ${file}`);
			console.log(`   From: "${originalTitle}"`);
			console.log(`   To:   "${truncated}"`);
		}

		// Fix description
		if (frontmatter.description) {
			let desc = frontmatter.description;

			// Remove HTML
			if (desc.includes("<") || desc.includes(">")) {
				desc = desc.replace(/<[^>]*>/g, "").trim();
				desc = desc.replace(/&[^;]+;/g, " ").trim();
				desc = desc.replace(/\s+/g, " ");
				fixed.htmlCleaned++;
			}

			// Fix length
			if (desc.length < MIN_DESC_LENGTH) {
				// Try to extract from content
				const plainContent = content
					.replace(/^#+\s.+$/gm, "") // Remove headers
					.replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
					.replace(/\[([^\]]+)\]\(.*?\)/g, "$1") // Remove links
					.replace(/[*_`]/g, "") // Remove formatting
					.trim();

				const firstPara = plainContent.split("\n\n")[0];
				if (firstPara && firstPara.length >= MIN_DESC_LENGTH) {
					desc = firstPara.substring(0, MAX_DESC_LENGTH);
					if (desc.length === MAX_DESC_LENGTH) {
						desc = `${desc.substring(0, desc.lastIndexOf(" "))}...`;
					}
				} else {
					// Fallback: use title + generic text
					desc = `${frontmatter.title}. Read more about this topic in this blog post.`;
				}
				fixed.descriptions++;
			}

			// Truncate if too long
			if (desc.length > MAX_DESC_LENGTH) {
				desc = desc.substring(0, MAX_DESC_LENGTH - 3);
				desc = `${desc.substring(0, desc.lastIndexOf(" "))}...`;
				fixed.descriptions++;
			}

			if (desc !== frontmatter.description) {
				frontmatter.description = desc;
				modified = true;
			}
		} else {
			// Generate description from content
			const plainContent = content
				.replace(/^#+\s.+$/gm, "")
				.replace(/!\[.*?\]\(.*?\)/g, "")
				.replace(/\[([^\]]+)\]\(.*?\)/g, "$1")
				.replace(/[*_`]/g, "")
				.trim();

			const firstPara = plainContent.split("\n\n")[0];
			if (firstPara) {
				let desc = firstPara.substring(0, MAX_DESC_LENGTH);
				if (desc.length === MAX_DESC_LENGTH) {
					desc = `${desc.substring(0, desc.lastIndexOf(" "))}...`;
				}
				if (desc.length >= MIN_DESC_LENGTH) {
					frontmatter.description = desc;
					modified = true;
					fixed.descriptions++;
				}
			}
		}

		// Fix date format
		if (!frontmatter.publishDate && frontmatter.date) {
			frontmatter.publishDate = frontmatter.date;
			frontmatter.date = undefined;
			modified = true;
			fixed.dates++;
		}

		// Ensure tags is an array
		if (frontmatter.tags && !Array.isArray(frontmatter.tags)) {
			if (typeof frontmatter.tags === "string") {
				frontmatter.tags = [frontmatter.tags];
			} else {
				frontmatter.tags = [];
			}
			modified = true;
		}

		// Save if modified
		if (modified) {
			const newContent = matter.stringify(content, frontmatter);
			fs.writeFileSync(filePath, newContent);
		}
	} catch (error) {
		console.error(`❌ Error processing ${file}: ${error.message}`);
	}
});

console.log("\n✨ Auto-fix complete!");
console.log(`   Fixed titles: ${fixed.titles}`);
console.log(`   Fixed descriptions: ${fixed.descriptions}`);
console.log(`   Cleaned HTML: ${fixed.htmlCleaned}`);
console.log(`   Fixed dates: ${fixed.dates}`);

console.log('\n💡 Run "node validate-content.js" to check remaining issues.');
