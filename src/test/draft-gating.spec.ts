import { getCollection as _getCollection } from "astro:content";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getAllPosts } from "../data/post";

// The resolve.alias in vitest.config.ts routes astro:content to the vi.fn() stub at
// runtime, but TypeScript resolves types from the module declaration. Cast once here.
// biome-ignore lint/suspicious/noExplicitAny: bridging Vitest mock type and Astro declaration
const getCollection = _getCollection as unknown as any;

type Entry = { id: string; data: { draft?: boolean } };

const POSTS: Entry[] = [
	{ id: "published", data: { draft: false } },
	{ id: "draft-post", data: { draft: true } },
];

function wireFilter() {
	// Replicate what Astro's getCollection does: apply the caller's filter predicate.
	getCollection.mockImplementation(async (_col: string, filter?: (e: Entry) => boolean) =>
		filter ? POSTS.filter(filter) : [...POSTS],
	);
}

describe("getAllPosts draft gating", () => {
	beforeEach(wireFilter);

	afterEach(() => {
		vi.clearAllMocks();
		// Restore to the test-mode default so later test files are unaffected.
		Object.assign(import.meta.env, { PROD: false });
	});

	it("includes draft posts in development (PROD=false)", async () => {
		Object.assign(import.meta.env, { PROD: false });
		const result = await getAllPosts();
		const ids = result.map((p) => p.id);
		expect(ids).toContain("published");
		expect(ids).toContain("draft-post");
	});

	it("excludes draft posts in production (PROD=true)", async () => {
		Object.assign(import.meta.env, { PROD: true });
		const result = await getAllPosts();
		const ids = result.map((p) => p.id);
		expect(ids).toContain("published");
		expect(ids).not.toContain("draft-post");
	});
});
