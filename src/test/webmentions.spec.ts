import { describe, expect, it } from "vitest";
import type { Content, WebmentionsCache, WebmentionsChildren, WebmentionsFeed } from "../types";
import { filterWebmentions, mergeWebmentions } from "../utils/webmentions";
import {
	getSupportedWebmentionHostNames,
	getSupportedWebmentionOrigins,
	normalizeWebmentionTarget,
} from "../utils/webmentionTargets";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeContent(text: string): Content {
	return { "content-type": "text/plain", html: "", text, value: text };
}

function makeWebmention(id: number, property: string, content?: Content): WebmentionsChildren {
	return {
		"wm-id": id,
		"wm-property": property,
		"wm-target": "https://nathanlane.info/posts/test/",
		"wm-source": "https://example.com/",
		"wm-received": "2026-01-01T00:00:00Z",
		"wm-private": false,
		"wm-protocol": "webmention",
		"mention-of": "https://nathanlane.info/posts/test/",
		type: "entry",
		url: "https://example.com/",
		author: null,
		...(content !== undefined ? { content } : {}),
	};
}

function makeCache(children: WebmentionsChildren[]): WebmentionsCache {
	return { lastFetched: null, children };
}

function makeFeed(children: WebmentionsChildren[]): WebmentionsFeed {
	return { name: "webmentions", type: "feed", children };
}

// ---------------------------------------------------------------------------
// Existing origin / target tests
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// filterWebmentions
// ---------------------------------------------------------------------------

describe("filterWebmentions", () => {
	it("keeps like-of webmentions regardless of content", () => {
		const entry = makeWebmention(1, "like-of");
		expect(filterWebmentions([entry])).toHaveLength(1);
	});

	it("rejects webmentions with an unrecognised wm-property", () => {
		const entry = makeWebmention(2, "bookmark-of");
		expect(filterWebmentions([entry])).toHaveLength(0);
	});

	it("keeps mention-of when it carries non-empty text content", () => {
		const entry = makeWebmention(3, "mention-of", makeContent("interesting mention"));
		expect(filterWebmentions([entry])).toHaveLength(1);
	});

	it("rejects mention-of when it has no content at all", () => {
		const entry = makeWebmention(4, "mention-of");
		expect(filterWebmentions([entry])).toHaveLength(0);
	});

	it("rejects mention-of when its text content is empty", () => {
		const entry = makeWebmention(5, "mention-of", makeContent(""));
		expect(filterWebmentions([entry])).toHaveLength(0);
	});

	it("keeps in-reply-to when it carries non-empty text content", () => {
		const entry = makeWebmention(6, "in-reply-to", makeContent("a thoughtful reply"));
		expect(filterWebmentions([entry])).toHaveLength(1);
	});

	it("rejects in-reply-to when it has no content", () => {
		const entry = makeWebmention(7, "in-reply-to");
		expect(filterWebmentions([entry])).toHaveLength(0);
	});
});

// ---------------------------------------------------------------------------
// mergeWebmentions
// ---------------------------------------------------------------------------

describe("mergeWebmentions", () => {
	it("combines non-overlapping cached and fresh entries", () => {
		const cache = makeCache([makeWebmention(1, "like-of")]);
		const feed = makeFeed([makeWebmention(2, "mention-of", makeContent("hello"))]);
		const result = mergeWebmentions(cache, feed);
		expect(result).toHaveLength(2);
		expect(result.map((w) => w["wm-id"]).sort()).toEqual([1, 2]);
	});

	it("deduplicates by wm-id, keeping the feed entry over the cached one", () => {
		const cached = makeWebmention(1, "like-of");
		// Mutate url so we can tell which entry survived.
		const fresh = { ...makeWebmention(1, "like-of"), url: "https://example.com/fresh" };
		const cache = makeCache([cached]);
		const feed = makeFeed([fresh]);
		const result = mergeWebmentions(cache, feed);
		expect(result).toHaveLength(1);
		expect(result[0]?.url).toBe("https://example.com/fresh");
	});
});
