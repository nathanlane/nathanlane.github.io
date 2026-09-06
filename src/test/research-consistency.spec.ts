import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { describe, expect, it } from "vitest";

/**
 * Cross-checks facts a research entry states about itself in more than one place.
 *
 * A paper's identity is duplicated across `paperDate`, the `download` filename, and the
 * links in the body. Nothing tied them together, so an edit to one could silently
 * contradict the others -- which is how `paperDate` came to claim a year that every other
 * artefact in its own entry disagreed with. These checks are deliberately narrow: they
 * only compare the entry against itself, need no network, and run with the normal suite.
 */

const RESEARCH_DIR = path.resolve("src/content/research");

/**
 * Entries whose filename year legitimately differs from `paperDate` -- a preprint year
 * against a journal year, say. Every entry needs a stated reason, and the list should be
 * empty whenever possible: an addition here is a deliberate assertion that the mismatch
 * is correct, not a way to silence the check.
 */
const YEAR_MISMATCH_ALLOWLIST: Record<string, string> = {};

/**
 * Entries whose frontmatter `link` and body citations legitimately name different
 * documents. Same rules as the year allowlist: a reason is required, and empty is the goal.
 */
const LINK_CONFLICT_ALLOWLIST: Record<string, string> = {};

type Entry = { file: string; data: Record<string, unknown>; body: string };

const entries: Entry[] = fs
	.readdirSync(RESEARCH_DIR)
	.filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
	.map((file) => {
		const parsed = matter(fs.readFileSync(path.join(RESEARCH_DIR, file), "utf-8"));
		return { file, data: parsed.data, body: parsed.content };
	});

/** Years appearing as their own token in a PDF filename, e.g. `Lane_QJE_2025_Title.pdf`. */
function yearsInDownloadFilename(download: string): string[] {
	const basename = decodeURIComponent(download.split("/").pop() ?? "");
	return [...basename.matchAll(/(?:^|[^0-9])((?:19|20)\d{2})(?:[^0-9]|$)/g)]
		.map((m) => m[1])
		.filter((year): year is string => year !== undefined);
}

describe("research entry self-consistency", () => {
	it("has entries to check", () => {
		expect(entries.length).toBeGreaterThan(0);
	});

	it("agrees with itself about the year", () => {
		const mismatches: string[] = [];

		for (const { file, data } of entries) {
			const download = typeof data.download === "string" ? data.download : "";
			const paperDate = String(data.paperDate ?? "");
			if (!download || !paperDate) continue;

			const years = yearsInDownloadFilename(download);
			if (years.length === 0 || years.includes(paperDate)) continue;
			if (file in YEAR_MISMATCH_ALLOWLIST) continue;

			mismatches.push(
				`${file}: paperDate "${paperDate}" but the PDF filename says ${years.join(", ")}. ` +
					`Fix the data, or add an entry to YEAR_MISMATCH_ALLOWLIST stating why they differ.`,
			);
		}

		expect(mismatches).toEqual([]);
	});

	it("keeps every allowlist entry earning its place", () => {
		// A stale allowlist is worse than none: it asserts a mismatch that no longer exists.
		const stale: string[] = [];

		for (const file of Object.keys(YEAR_MISMATCH_ALLOWLIST)) {
			const entry = entries.find((e) => e.file === file);
			if (!entry) {
				stale.push(`${file}: allowlisted but no such entry exists`);
				continue;
			}
			const download = typeof entry.data.download === "string" ? entry.data.download : "";
			const years = download ? yearsInDownloadFilename(download) : [];
			if (years.length === 0 || years.includes(String(entry.data.paperDate ?? ""))) {
				stale.push(`${file}: allowlisted but the years now agree -- remove the entry`);
			}
		}

		expect(stale).toEqual([]);
	});

	it("points `link` and the body's own resource links at the same document", () => {
		// The wrong-paper failure: `link` and the Resources list can drift to different
		// identifiers. Compares only identifiers the entry already states, so it needs no
		// network and cannot be fooled by a well-formed URL to the wrong paper -- that one
		// needs `pnpm run verify:research-links`.
		const conflicts: string[] = [];
		const idPattern = /(?:papers\/(w\d+)|doi\.org\/([^\s)"']+)|10\.\d{4,}\/[^\s)"']+)/gi;

		for (const { file, data, body } of entries) {
			const link = typeof data.link === "string" ? data.link : "";
			if (!link) continue;

			const linkIds = [...link.matchAll(idPattern)].map((m) => m[0].toLowerCase());
			if (linkIds.length === 0) continue;

			const bodyNberIds = [...body.matchAll(/nber\.org\/papers\/(w\d+)/gi)]
				.map((m) => m[1])
				.filter((id): id is string => id !== undefined)
				.map((id) => id.toLowerCase());
			const linkNberId = /papers\/(w\d+)/i.exec(link)?.[1]?.toLowerCase();
			if (!linkNberId || bodyNberIds.length === 0) continue;

			const disagreeing = [...new Set(bodyNberIds)].filter((id) => id !== linkNberId);
			if (disagreeing.length > 0 && !(file in LINK_CONFLICT_ALLOWLIST)) {
				conflicts.push(
					`${file}: frontmatter link is ${linkNberId} but the body cites ${disagreeing.join(", ")}`,
				);
			}
		}

		expect(conflicts).toEqual([]);
	});
});
