import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		alias: {
			// astro:content and astro:env/server are virtual modules provided by the Astro
			// build pipeline, which is not available in the plain Vitest environment.
			// The stubs below let unit tests import modules that transitively use them.
			"astro:content": fileURLToPath(
				new URL("./src/test/__mocks__/astro-content.ts", import.meta.url),
			),
			"astro:env/server": fileURLToPath(
				new URL("./src/test/__mocks__/astro-env-server.ts", import.meta.url),
			),
		},
	},
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./src/test/setup.ts",
		include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			exclude: [
				"node_modules/",
				"src/test/",
				"**/*.d.ts",
				"**/*.config.*",
				"**/.{eslint,mocha,prettier}rc.{js,cjs,yml}",
			],
		},
	},
});
