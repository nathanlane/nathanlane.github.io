#!/usr/bin/env node

// Serve the existing production build with Astro's experimental preview API.
// Use an async test process so the preview server can keep answering requests.

import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { preview } from "astro";

const PORT = Number(process.env.PLAYWRIGHT_PORT ?? "4322");

function runPlaywright(env) {
	return new Promise((resolve, reject) => {
		const child = spawn(
			process.execPath,
			[fileURLToPath(import.meta.resolve("@playwright/test/cli")), "test"],
			{ stdio: "inherit", env },
		);
		child.on("error", reject);
		child.on("exit", (code, signal) => resolve(signal ? 1 : (code ?? 1)));
	});
}

async function main() {
	console.log(`Starting production preview on port ${PORT} (in-process)...`);
	const server = await preview({ root: process.cwd(), server: { port: PORT } });
	const baseUrl = `http://localhost:${server.port}`;

	let exitCode = 1;
	try {
		console.log(`Preview ready at ${baseUrl}. Running Playwright checks...`);
		exitCode = await runPlaywright({ ...process.env, PLAYWRIGHT_BASE_URL: baseUrl });
	} finally {
		console.log("Stopping preview server...");
		// Register before stop() emits the close event.
		const closed = server.closed();
		await server.stop();
		await closed;
		console.log("Confirmed: preview server stopped.");
	}

	process.exit(exitCode);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
