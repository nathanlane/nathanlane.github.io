#!/usr/bin/env node

/**
 * Fix Writing Content Validation Issues
 * =====================================
 *
 * Purpose: Fix validation errors in writing collection content
 *
 * Usage: node scripts/content/fix-writing-content.js
 *
 * Prerequisites:
 * - Node.js
 * - Gray-matter npm package
 *
 * Output:
 * - Updated content files with valid frontmatter
 *
 * Author: Claude Assistant
 * Date: January 2025
 */

const fs = require("node:fs");
const path = require("node:path");
const matter = require("gray-matter");

const CONTENT_DIR = path.join(__dirname, "../../src/content/writing");

// Helper to truncate text
function truncate(str, maxLength) {
	if (str.length <= maxLength) return str;

	// Try to cut at a sentence boundary
	const cutoff = str.substring(0, maxLength - 3);
	const lastPeriod = cutoff.lastIndexOf(".");
	const lastComma = cutoff.lastIndexOf(",");
	const lastSpace = cutoff.lastIndexOf(" ");

	// Prefer period, then comma, then space
	if (lastPeriod > maxLength - 50) {
		return cutoff.substring(0, lastPeriod + 1);
	}
	if (lastComma > maxLength - 50) {
		return `${cutoff.substring(0, lastComma)}...`;
	}
	if (lastSpace > maxLength - 20) {
		return `${cutoff.substring(0, lastSpace)}...`;
	}

	return `${cutoff}...`;
}

// Process each file
const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

let fixedCount = 0;

files.forEach((file) => {
	const filePath = path.join(CONTENT_DIR, file);
	const content = fs.readFileSync(filePath, "utf-8");
	const { data, content: body } = matter(content);

	let modified = false;
	const issues = [];

	// Fix title length (max 60 chars)
	if (data.title && data.title.length > 60) {
		const oldTitle = data.title;
		// Remove parenthetical info first
		data.title = data.title.replace(/\s*\([^)]+\)$/, "");
		if (data.title.length > 60) {
			data.title = truncate(data.title, 60);
		}
		issues.push(`Title: "${oldTitle}" → "${data.title}"`);
		modified = true;
	}

	// Fix description length (max 300 chars)
	if (data.description && data.description.length > 300) {
		const oldDesc = data.description;
		data.description = truncate(data.description, 300);
		issues.push(`Description: ${oldDesc.length} → ${data.description.length} chars`);
		modified = true;
	}

	// Fix date field to publishDate
	if (data.date && !data.publishDate) {
		data.publishDate = data.date;
		data.date = undefined;
		issues.push('Changed "date" to "publishDate"');
		modified = true;
	}

	// Ensure required fields exist
	if (!data.publishDate) {
		// Try to extract from filename or use current date
		const dateMatch = file.match(/(\d{4}-\d{2}-\d{2})/);
		if (dateMatch) {
			data.publishDate = new Date(dateMatch[1]);
		} else {
			data.publishDate = new Date();
		}
		issues.push("Added missing publishDate");
		modified = true;
	}

	if (!data.title) {
		// Extract from first heading or filename
		const headingMatch = body.match(/^#\s+(.+)$/m);
		if (headingMatch) {
			data.title = truncate(headingMatch[1], 60);
		} else {
			data.title = file.replace(/\.mdx?$/, "").replace(/-/g, " ");
		}
		issues.push("Added missing title");
		modified = true;
	}

	if (!data.description) {
		// Extract from first paragraph
		const paragraphMatch = body.match(/^(?!#)(?!\*).+$/m);
		if (paragraphMatch) {
			data.description = truncate(paragraphMatch[0], 300);
		} else {
			data.description = "Content from the writing collection.";
		}
		issues.push("Added missing description");
		modified = true;
	}

	if (modified) {
		// Write back the file
		const newContent = matter.stringify(body, data);
		fs.writeFileSync(filePath, newContent);
		fixedCount++;
		console.log(`\n✅ Fixed ${file}:`);
		issues.forEach((issue) => console.log(`   - ${issue}`));
	}
});

console.log(`\n🎉 Fixed ${fixedCount} files in writing collection.`);
