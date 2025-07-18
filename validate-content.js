#!/usr/bin/env node

/**
 * Content Validation Script
 * ========================
 *
 * Purpose: Pre-flight validation of all content against Astro schema requirements
 *
 * What it does:
 * - Validates title length (max 60 characters)
 * - Checks description length (20-300 characters)
 * - Ensures all required fields exist (title, description, publishDate)
 * - Validates tags format (must be array)
 * - Reports all issues before build fails
 *
 * Usage:
 * - npm run validate
 * - node scripts/content/validate-content.js
 *
 * Exit codes:
 * - 0: All content valid
 * - 1: Validation errors found
 *
 * Author: Claude Assistant
 * Date: January 2025
 */

const fs = require("node:fs");
const path = require("node:path");
const matter = require("gray-matter");

const CONTENT_DIR = path.join(__dirname, "src/content/post");
const MAX_TITLE_LENGTH = 60;
const MIN_DESC_LENGTH = 20;
const MAX_DESC_LENGTH = 300;

console.log("🔍 Validating content against schema requirements...\n");

const files = fs
  .readdirSync(CONTENT_DIR)
  .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"));

const errors = [];
const warnings = [];
let passed = 0;

files.forEach((file) => {
  const filePath = path.join(CONTENT_DIR, file);
  const fileErrors = [];
  const fileWarnings = [];

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(content);

    // Check title
    if (!data.title) {
      fileErrors.push("Missing title");
    } else if (data.title.length > MAX_TITLE_LENGTH) {
      fileErrors.push(
        `Title too long (${data.title.length}/${MAX_TITLE_LENGTH} chars): "${data.title}"`,
      );
    }

    // Check description
    if (!data.description) {
      fileErrors.push("Missing description");
    } else {
      if (data.description.length < MIN_DESC_LENGTH) {
        fileErrors.push(
          `Description too short (${data.description.length}/${MIN_DESC_LENGTH} chars)`,
        );
      }
      if (data.description.length > MAX_DESC_LENGTH) {
        fileErrors.push(
          `Description too long (${data.description.length}/${MAX_DESC_LENGTH} chars)`,
        );
      }
      if (data.description.includes("<") || data.description.includes(">")) {
        fileWarnings.push("Description contains HTML - consider removing");
      }
    }

    // Check publishDate
    if (!data.publishDate && !data.date) {
      fileErrors.push("Missing publishDate");
    }

    // Check tags
    if (data.tags && !Array.isArray(data.tags)) {
      fileErrors.push("Tags must be an array");
    }

    // Report for this file
    if (fileErrors.length > 0) {
      errors.push({ file, errors: fileErrors });
    }
    if (fileWarnings.length > 0) {
      warnings.push({ file, warnings: fileWarnings });
    }
    if (fileErrors.length === 0 && fileWarnings.length === 0) {
      passed++;
    }
  } catch (error) {
    errors.push({ file, errors: [`Failed to parse: ${error.message}`] });
  }
});

// Display results
console.log("=".repeat(60));
console.log("📊 VALIDATION RESULTS");
console.log("=".repeat(60));
console.log(`✅ Passed: ${passed}/${files.length} files`);
console.log(`❌ Errors: ${errors.length} files`);
console.log(`⚠️  Warnings: ${warnings.length} files`);
console.log("=".repeat(60));

// Show errors (these will break the build)
if (errors.length > 0) {
  console.log("\n❌ ERRORS (must fix before running dev):\n");
  errors.forEach(({ file, errors }) => {
    console.log(`📄 ${file}`);
    errors.forEach((err) => console.log(`   • ${err}`));
    console.log("");
  });
}

// Show warnings (these won't break the build)
if (warnings.length > 0) {
  console.log("\n⚠️  WARNINGS (consider fixing):\n");
  warnings.forEach(({ file, warnings }) => {
    console.log(`📄 ${file}`);
    warnings.forEach((warn) => console.log(`   • ${warn}`));
    console.log("");
  });
}

// Exit with error code if validation failed
if (errors.length > 0) {
  console.log(
    "\n🚫 Validation failed! Fix the errors above before running dev.\n",
  );
  process.exit(1);
} else {
  console.log("\n✨ All content validated successfully! Safe to run dev.\n");
  process.exit(0);
}
