#!/usr/bin/env node

/**
 * Fix Long Titles in Migrated Posts
 * Truncates titles longer than 60 characters
 */

const fs = require("node:fs");
const path = require("node:path");
const matter = require("gray-matter");

const CONTENT_DIR =
  "/Users/nathanlane/code/nathanlane.github.io/src/content/post";
const MAX_TITLE_LENGTH = 60;

console.log("🔧 Fixing long titles in migrated posts...\n");

// Get all markdown files
const files = fs
  .readdirSync(CONTENT_DIR)
  .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"));

let fixedCount = 0;
const issues = [];

files.forEach((file) => {
  const filePath = path.join(CONTENT_DIR, file);

  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data: frontmatter, content } = matter(fileContent);

    if (frontmatter.title && frontmatter.title.length > MAX_TITLE_LENGTH) {
      const originalTitle = frontmatter.title;

      // Truncate intelligently at word boundary
      let truncated = originalTitle.substring(0, MAX_TITLE_LENGTH - 3);
      const lastSpace = truncated.lastIndexOf(" ");
      if (lastSpace > 40) {
        truncated = truncated.substring(0, lastSpace);
      }
      truncated += "...";

      // Store original title in description if description is short
      if (!frontmatter.description || frontmatter.description.length < 50) {
        frontmatter.description = originalTitle;
      }

      frontmatter.title = truncated;

      // Write back
      const newContent = matter.stringify(content, frontmatter);
      fs.writeFileSync(filePath, newContent);

      console.log(`✅ Fixed: ${file}`);
      console.log(`   Original: "${originalTitle}"`);
      console.log(`   New:      "${truncated}"`);
      console.log("");

      fixedCount++;
    }
  } catch (error) {
    issues.push({ file, error: error.message });
  }
});

// Also check for other common issues
console.log("\n🔍 Checking for other issues...\n");

files.forEach((file) => {
  const filePath = path.join(CONTENT_DIR, file);

  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data: frontmatter } = matter(fileContent);

    // Check description length
    if (frontmatter.description) {
      if (frontmatter.description.length < 20) {
        console.log(
          `⚠️  ${file}: Description too short (${frontmatter.description.length} chars)`,
        );
      } else if (frontmatter.description.length > 300) {
        console.log(
          `⚠️  ${file}: Description too long (${frontmatter.description.length} chars)`,
        );
      }
    } else {
      console.log(`⚠️  ${file}: Missing description`);
    }

    // Check for required fields
    if (!frontmatter.publishDate && !frontmatter.date) {
      console.log(`⚠️  ${file}: Missing publishDate`);
    }
  } catch (error) {
    // Skip
  }
});

console.log("\n✨ Done!");
console.log(`   Fixed titles: ${fixedCount}`);
if (issues.length > 0) {
  console.log(`   Issues: ${issues.length}`);
  issues.forEach(({ file, error }) => {
    console.log(`     - ${file}: ${error}`);
  });
}
