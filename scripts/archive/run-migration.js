#!/usr/bin/env node

// Simple runner for the migration script
const { spawn } = require("node:child_process");
const path = require("node:path");

console.log("Starting Jekyll to Astro migration...");

const migrationScript = path.join(__dirname, "migrate-jekyll-archive.js");

const migration = spawn("node", [migrationScript], {
	cwd: __dirname,
	stdio: "inherit",
});

migration.on("close", (code) => {
	if (code === 0) {
		console.log("Migration completed successfully!");
	} else {
		console.error(`Migration failed with code ${code}`);
	}
});

migration.on("error", (err) => {
	console.error("Failed to start migration:", err);
});
