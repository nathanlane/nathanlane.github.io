#!/usr/bin/env node

/**
 * Squarespace Deep URL Scanner
 * ============================
 *
 * Purpose: Scan for additional Squarespace pages beyond sitemap.xml
 *
 * Usage: node scripts/migration/squarespace-deep-scan.js
 *
 * This will check common Squarespace URL patterns to find hidden pages
 *
 * Author: Claude Assistant
 * Date: January 2025
 */

const https = require("node:https");
const fs = require("node:fs");

const domain = "https://www.nathanlane.info";

// Common Squarespace URL patterns to check
const urlsToCheck = [
  "/",
  "/sitemap.xml",
  "/sitemap-index.xml",
  "/blog",
  "/blog/archive",
  "/portfolio",
  "/work",
  "/projects",
  "/contact",
  "/about",
  "/services",
  "/shop",
  "/products",
  "/gallery",
  "/events",
  "/press",
  "/news",
  "/feed",
  "/rss",
  "/blog?format=rss",
  // Additional pages found in your sitemap
  "/home",
  "/bio",
  // Common Squarespace system pages
  "/search",
  "/cart",
  "/account/login",
];

// Check if URL exists (returns 200 or 301/302)
function checkUrl(url) {
  return new Promise((resolve) => {
    const fullUrl = `${domain}${url}`;

    https
      .get(fullUrl, (res) => {
        const result = {
          url: url,
          status: res.statusCode,
          redirect: res.headers.location || null,
        };

        // If it's a valid page or redirect
        if (
          res.statusCode === 200 ||
          res.statusCode === 301 ||
          res.statusCode === 302
        ) {
          result.exists = true;
        } else {
          result.exists = false;
        }

        resolve(result);
      })
      .on("error", (err) => {
        resolve({
          url: url,
          status: "error",
          exists: false,
          error: err.message,
        });
      });
  });
}

async function scanSquarespace() {
  console.log("Squarespace Deep URL Scanner");
  console.log("===========================\n");
  console.log(`Scanning: ${domain}\n`);

  const results = {
    found: [],
    redirects: [],
    notFound: [],
    errors: [],
  };

  // Check each URL
  for (const url of urlsToCheck) {
    process.stdout.write(`Checking ${url}...`);
    const result = await checkUrl(url);

    if (result.status === 200) {
      console.log(" ✓ Found");
      results.found.push(url);
    } else if (result.status === 301 || result.status === 302) {
      console.log(` → Redirects to ${result.redirect}`);
      results.redirects.push({ from: url, to: result.redirect });
    } else if (result.status === 404) {
      console.log(" ✗ Not found");
      results.notFound.push(url);
    } else if (result.status === "error") {
      console.log(` ! Error: ${result.error}`);
      results.errors.push({ url, error: result.error });
    } else {
      console.log(` ? Status: ${result.status}`);
      results.notFound.push(url);
    }

    // Be nice to the server
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // Generate report
  console.log("\n\nScan Results Summary");
  console.log("===================\n");

  console.log(`Active Pages (${results.found.length}):`);
  results.found.forEach((url) => console.log(`  ✓ ${url}`));

  if (results.redirects.length > 0) {
    console.log(`\nRedirects (${results.redirects.length}):`);
    results.redirects.forEach((r) => console.log(`  → ${r.from} → ${r.to}`));
  }

  console.log(`\nNot Found (${results.notFound.length}):`);
  console.log(`  ${results.notFound.join(", ")}`);

  // Save results
  const outputPath = "squarespace-scan-results.json";
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n\nDetailed results saved to: ${outputPath}`);

  // Recommendations
  console.log("\n\nRecommendations:");
  console.log("================\n");

  if (results.found.length <= 3) {
    console.log("⚠️  Very few pages found. Consider:");
    console.log("   - Checking if site requires authentication");
    console.log("   - Looking in Squarespace dashboard for hidden pages");
    console.log("   - Verifying the domain is correct");
  }

  if (results.redirects.length > 0) {
    console.log("\n📍 Found redirects that need to be preserved in migration");
  }

  console.log("\n✅ Next steps:");
  console.log("   1. Log into Squarespace and check Pages panel");
  console.log(
    "   2. Export any blog content from Settings > Advanced > Import/Export",
  );
  console.log(
    "   3. Download images from Design > Custom CSS or Asset Library",
  );
}

// Run the scanner
scanSquarespace().catch(console.error);
