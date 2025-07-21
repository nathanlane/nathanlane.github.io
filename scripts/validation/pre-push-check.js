#!/usr/bin/env node

/**
 * Pre-Push Validation Check
 * =========================
 *
 * Purpose: Runs all validation checks before pushing to prevent CI failures
 *
 * Usage: node scripts/validation/pre-push-check.js
 *        or: pnpm run pre-push
 *
 * Prerequisites:
 * - Node.js installed
 * - All project dependencies installed
 *
 * Output:
 * - Success/failure status for each check
 * - Exit code 0 if all pass, 1 if any fail
 *
 * Author: Claude Assistant
 * Date: January 2025
 */

const { execSync } = require("node:child_process");
const chalk = require("chalk");

// Simple chalk fallback if not installed
const colors = {
	green: (text) => `✅ ${text}`,
	red: (text) => `❌ ${text}`,
	yellow: (text) => `⚠️  ${text}`,
	blue: (text) => `🔵 ${text}`,
	bold: (text) => `**${text}**`,
};

if (typeof chalk !== "undefined") {
	colors.green = chalk.green;
	colors.red = chalk.red;
	colors.yellow = chalk.yellow;
	colors.blue = chalk.blue;
	colors.bold = chalk.bold;
}

console.log(colors.bold("\n🚀 Running Pre-Push Validation Checks...\n"));

const checks = [
	{
		name: "Lint Check",
		command: "pnpm lint",
		description: "Checking code style with Biome...",
	},
	{
		name: "Format Check",
		command: "biome format . --check",
		description: "Checking code formatting...",
	},
	{
		name: "TypeScript Check",
		command: "pnpm check",
		description: "Running Astro type checking...",
	},
	{
		name: "Build Check",
		command: "pnpm build",
		description: "Building site to catch validation errors...",
	},
];

let allPassed = true;

for (const check of checks) {
	console.log(colors.blue(`\n${check.description}`));

	try {
		execSync(check.command, {
			stdio: "pipe",
			encoding: "utf8",
		});
		console.log(colors.green(`${check.name} passed!`));
	} catch (error) {
		console.log(colors.red(`${check.name} failed!`));

		// Extract useful error message
		if (error.stdout) {
			console.log("\nError output:");
			console.log(error.stdout);
		}
		if (error.stderr) {
			console.log(error.stderr);
		}

		allPassed = false;

		// For build errors, try to extract the specific validation error
		if (check.name === "Build Check" && error.stdout) {
			const validationMatch = error.stdout.match(
				/\[InvalidContentEntryDataError\][\s\S]*?description:.*$/m,
			);
			if (validationMatch) {
				console.log(colors.yellow("\n💡 Tip: Fix content validation errors before pushing!"));
			}
		}
	}
}

console.log(`\n${"=".repeat(50)}`);

if (allPassed) {
	console.log(colors.green(colors.bold("\n✅ All checks passed! Safe to push.\n")));
	process.exit(0);
} else {
	console.log(
		colors.red(colors.bold("\n❌ Some checks failed. Please fix errors before pushing.\n")),
	);
	console.log(colors.yellow("💡 Tip: Run individual commands to see detailed errors:"));
	console.log("   - pnpm lint");
	console.log("   - pnpm check");
	console.log("   - pnpm build\n");
	process.exit(1);
}
