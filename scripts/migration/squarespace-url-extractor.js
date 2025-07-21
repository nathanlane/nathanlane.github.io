#!/usr/bin/env node

/**
 * Squarespace URL Extractor
 * ========================
 *
 * Purpose: Extract and analyze URLs from Squarespace sitemap.xml
 *
 * Usage:
 * 1. Download your sitemap.xml from https://yourdomain.com/sitemap.xml
 * 2. Run: node scripts/migration/squarespace-url-extractor.js path/to/sitemap.xml
 *
 * Output:
 * - List of all URLs grouped by pattern
 * - URL redirect mapping suggestions
 * - Count statistics
 *
 * Author: Claude Assistant
 * Date: January 2025
 */

const fs = require("node:fs");
const path = require("node:path");
const xml2js = require("xml2js");

async function extractURLs(sitemapPath) {
  try {
    // Read sitemap file
    const xmlContent = fs.readFileSync(sitemapPath, "utf-8");

    // Parse XML
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xmlContent);

    // Extract URLs
    const urls = [];
    if (result.urlset?.url) {
      result.urlset.url.forEach((entry) => {
        if (entry.loc?.[0]) {
          const url = new URL(entry.loc[0]);
          urls.push({
            full: entry.loc[0],
            path: url.pathname,
            lastmod: entry.lastmod ? entry.lastmod[0] : null,
            priority: entry.priority ? entry.priority[0] : null,
          });
        }
      });
    }

    // Analyze URL patterns
    const patterns = {
      blog: [],
      pages: [],
      portfolio: [],
      products: [],
      other: [],
    };

    urls.forEach((url) => {
      if (url.path.includes("/blog/")) {
        patterns.blog.push(url);
      } else if (
        url.path.includes("/portfolio/") ||
        url.path.includes("/work/")
      ) {
        patterns.portfolio.push(url);
      } else if (
        url.path.includes("/products/") ||
        url.path.includes("/shop/")
      ) {
        patterns.products.push(url);
      } else if (url.path === "/" || url.path.match(/^\/[^\/]+\/?$/)) {
        patterns.pages.push(url);
      } else {
        patterns.other.push(url);
      }
    });

    // Generate report
    console.log("Squarespace URL Analysis Report");
    console.log("==============================\n");

    console.log(`Total URLs found: ${urls.length}\n`);

    Object.entries(patterns).forEach(([category, items]) => {
      if (items.length > 0) {
        console.log(`\n${category.toUpperCase()} (${items.length} URLs):`);
        console.log("-".repeat(40));
        items.forEach((item) => {
          console.log(`  ${item.path}`);
        });
      }
    });

    // Generate redirect mapping
    console.log("\n\nSuggested Redirect Mappings:");
    console.log("============================\n");

    patterns.blog.forEach((item) => {
      const newPath = item.path.replace("/blog/", "/posts/");
      console.log(`${item.path} -> ${newPath}`);
    });

    // Save URLs to JSON for further processing
    const outputPath = path.join(
      path.dirname(sitemapPath),
      "squarespace-urls.json",
    );
    fs.writeFileSync(outputPath, JSON.stringify(urls, null, 2));
    console.log(`\n\nURLs saved to: ${outputPath}`);
  } catch (error) {
    console.error("Error processing sitemap:", error.message);
    process.exit(1);
  }
}

// Check command line arguments
if (process.argv.length < 3) {
  console.log("Usage: node squarespace-url-extractor.js <path-to-sitemap.xml>");
  process.exit(1);
}

const sitemapPath = process.argv[2];
if (!fs.existsSync(sitemapPath)) {
  console.error(`Error: File not found: ${sitemapPath}`);
  process.exit(1);
}

extractURLs(sitemapPath);
