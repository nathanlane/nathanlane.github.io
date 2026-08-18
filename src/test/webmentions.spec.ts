import { describe, expect, it } from "vitest";
import {
	getSupportedWebmentionHostNames,
	getSupportedWebmentionOrigins,
	normalizeWebmentionTarget,
} from "../utils/webmentionTargets";

describe("webmention origin support", () => {
	it("derives supported origins and host names from site configuration", () => {
		expect(getSupportedWebmentionOrigins()).toEqual([
			"https://nathanlane.info",
			"https://nathanlane.github.io",
		]);
		expect(getSupportedWebmentionHostNames()).toEqual(["nathanlane.info", "nathanlane.github.io"]);
	});

	it("treats supported origins and trailing slashes as equivalent targets", () => {
		expect(normalizeWebmentionTarget("https://nathanlane.info/posts/example/")).toBe(
			"/posts/example",
		);
		expect(normalizeWebmentionTarget("https://nathanlane.github.io/posts/example")).toBe(
			"/posts/example",
		);
		expect(normalizeWebmentionTarget("https://nathanlane.github.io/posts/example/?ref=feed")).toBe(
			"/posts/example?ref=feed",
		);
	});

	it("preserves unsupported origins in the comparison key", () => {
		expect(normalizeWebmentionTarget("https://example.com/posts/example/")).toBe(
			"https://example.com/posts/example",
		);
	});
});
