import { describe, expect, it, vi } from "vitest";
import {
	CANONICAL_ORIGIN,
	EXPECTED_REDIRECT_STATUS,
	PAGES_ORIGIN,
	REDIRECT_CHECKS,
	buildExpectedLocation,
	checkRedirects,
} from "../../scripts/validation/pages-origin-redirect-smoke.mjs";

describe("pages origin redirect smoke", () => {
	it("checks representative github.io paths against exact canonical targets", () => {
		expect(EXPECTED_REDIRECT_STATUS).toBe(301);
		expect(REDIRECT_CHECKS).toEqual([
			{ path: "/", location: "https://nathanlane.info/" },
			{ path: "/about/", location: "https://nathanlane.info/about/" },
			{ path: "/rss.xml", location: "https://nathanlane.info/rss.xml" },
			{ path: "/og-image/deepseek.png", location: "https://nathanlane.info/og-image/deepseek.png" },
			{
				path: "/this-route-should-not-exist-xyz",
				location: "https://nathanlane.info/this-route-should-not-exist-xyz",
			},
		]);
	});

	it("builds canonical redirect locations without losing the path", () => {
		expect(buildExpectedLocation("/")).toBe("https://nathanlane.info/");
		expect(buildExpectedLocation("/about/")).toBe("https://nathanlane.info/about/");
		expect(buildExpectedLocation("/rss.xml")).toBe("https://nathanlane.info/rss.xml");
	});

	it("passes exact 301 redirects and requests manual redirect handling", async () => {
		const fetchImpl = vi.fn(async (input: RequestInfo | URL, _init?: RequestInit) => {
			const url = String(input);
			return response(301, url.replace(PAGES_ORIGIN, CANONICAL_ORIGIN));
		});

		const { failures, results } = await checkRedirects(fetchImpl);

		expect(failures).toEqual([]);
		expect(results.every((result) => result.problems.length === 0)).toBe(true);
		expect(fetchImpl).toHaveBeenCalledTimes(REDIRECT_CHECKS.length);
		for (const call of fetchImpl.mock.calls) {
			expect(call[1]).toEqual({ redirect: "manual" });
		}
	});

	it("fails redirects with a non-301 permanent status", async () => {
		const fetchImpl = vi.fn(async (input: RequestInfo | URL) => {
			const url = String(input);
			return response(308, url.replace(PAGES_ORIGIN, CANONICAL_ORIGIN));
		});

		const { failures } = await checkRedirects(fetchImpl);

		expect(failures).toHaveLength(REDIRECT_CHECKS.length);
		expect(failures[0]?.problems).toContain("status 308 (expected 301)");
	});

	it("fails redirects that do not preserve the expected canonical location", async () => {
		const fetchImpl = vi.fn(async () => response(301, "https://nathanlane.info/"));

		const { failures } = await checkRedirects(fetchImpl);

		expect(failures.length).toBeGreaterThan(0);
		expect(failures.some((failure) => failure.path === "/about/")).toBe(true);
		expect(failures.find((failure) => failure.path === "/about/")?.problems).toContain(
			'location "https://nathanlane.info/" (expected "https://nathanlane.info/about/")',
		);
	});

	it("reports request failures without aborting the remaining checks", async () => {
		const fetchImpl = vi.fn(async (input: RequestInfo | URL) => {
			const url = String(input);
			if (url.endsWith("/about/")) {
				throw new Error("network down");
			}

			return response(301, url.replace(PAGES_ORIGIN, CANONICAL_ORIGIN));
		});

		const { failures, results } = await checkRedirects(fetchImpl);

		expect(fetchImpl).toHaveBeenCalledTimes(REDIRECT_CHECKS.length);
		expect(results).toHaveLength(REDIRECT_CHECKS.length);
		expect(failures).toHaveLength(1);
		expect(failures[0]).toMatchObject({
			path: "/about/",
			problems: ["request failed: network down"],
		});
	});
});

function response(status: number, location: string) {
	return {
		status,
		headers: {
			get(name: string) {
				return name.toLowerCase() === "location" ? location : null;
			},
		},
	} as Response;
}
