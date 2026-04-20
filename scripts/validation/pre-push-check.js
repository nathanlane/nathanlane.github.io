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

const { spawnSync } = require("node:child_process");

const command = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

console.log("Running repository validation...");

const result = spawnSync(command, ["run", "check:all"], {
	stdio: "inherit",
});

process.exit(result.status ?? 1);
