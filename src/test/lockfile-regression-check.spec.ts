import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative as relativePath } from "node:path";
import { describe, expect, it } from "vitest";
import {
	compareVersions,
	findDowngrades,
	parseLockfile,
} from "../../scripts/validation/lockfile-regression-check.mjs";

// Minimal lockfile fixture with the packages section only.
function lockfile(...pkgs: string[]): string {
	return ["packages:", "", ...pkgs.map((p) => `  ${p}:\n    resolution: {}`), ""].join("\n");
}

describe("parseLockfile", () => {
	it("parses unquoted package keys", () => {
		const map = parseLockfile(lockfile("satteri@0.10.5"));
		expect(map.get("satteri")).toBe("0.10.5");
	});

	it("parses quoted scoped package keys", () => {
		const map = parseLockfile(lockfile("'@biomejs/biome@2.5.8'"));
		expect(map.get("@biomejs/biome")).toBe("2.5.8");
	});

	it("parses keys with peer-dep suffixes", () => {
		const map = parseLockfile(lockfile("vite@8.2.2(@types/node@26.2.0)(yaml@2.9.0)"));
		expect(map.get("vite")).toBe("8.2.2");
	});

	it("keeps the max version when multiple entries exist for one package", () => {
		const map = parseLockfile(lockfile("vite@6.4.3", "vite@8.2.2"));
		expect(map.get("vite")).toBe("8.2.2");
	});

	// pnpm writes npm aliases as name@npm:target@version. Splitting on the first
	// @ would read the version as "npm" on both sides of every comparison and
	// hide any downgrade inside an aliased dependency.
	it("parses npm alias keys to the aliased version", () => {
		const map = parseLockfile(lockfile("'string-width@npm:string-width-cjs@4.2.3'"));
		expect(map.get("string-width@npm:string-width-cjs")).toBe("4.2.3");
	});

	it("ignores entries outside the packages section", () => {
		const text = [
			"importers:",
			"  .:",
			"    dependencies:",
			"      vite@8.2.2:",
			"",
			"packages:",
			"",
			"  satteri@0.10.5:",
			"    resolution: {}",
			"",
			"snapshots:",
			"",
			"  satteri@0.10.5: {}",
			"",
		].join("\n");
		const map = parseLockfile(text);
		expect(map.get("satteri")).toBe("0.10.5");
		// vite should not appear — it was in importers, not packages
		expect(map.has("vite")).toBe(false);
	});
});

describe("compareVersions", () => {
	it("returns 0 for equal versions", () => {
		expect(compareVersions("1.2.3", "1.2.3")).toBe(0);
	});

	it("returns positive when a is greater", () => {
		expect(compareVersions("0.10.5", "0.10.3")).toBeGreaterThan(0);
		expect(compareVersions("8.2.2", "8.2.1")).toBeGreaterThan(0);
	});

	it("returns negative when a is less", () => {
		expect(compareVersions("0.10.3", "0.10.5")).toBeLessThan(0);
		expect(compareVersions("8.2.1", "8.2.2")).toBeLessThan(0);
	});

	it("handles major version differences correctly", () => {
		expect(compareVersions("8.0.0", "6.4.3")).toBeGreaterThan(0);
	});

	// Both of these are resolved in the repo lockfile today, so the prerelease
	// rules below are live behaviour rather than a hypothetical.
	it("ranks a prerelease below its own release", () => {
		expect(compareVersions("5.0.0-beta.4", "5.0.0")).toBeLessThan(0);
		expect(compareVersions("5.0.0", "5.0.0-beta.4")).toBeGreaterThan(0);
		expect(compareVersions("1.4.0-beta.0", "1.4.0")).toBeLessThan(0);
	});

	it("orders numeric prerelease identifiers numerically, not lexically", () => {
		expect(compareVersions("5.0.0-beta.10", "5.0.0-beta.9")).toBeGreaterThan(0);
	});

	it("ranks a numeric prerelease identifier below an alphanumeric one", () => {
		expect(compareVersions("1.0.0-1", "1.0.0-alpha")).toBeLessThan(0);
	});

	it("ranks more prerelease identifiers above fewer", () => {
		expect(compareVersions("1.0.0-alpha.1", "1.0.0-alpha")).toBeGreaterThan(0);
	});

	it("ignores build metadata", () => {
		expect(compareVersions("1.0.0+build.9", "1.0.0+build.1")).toBe(0);
	});
});

describe("findDowngrades", () => {
	it("returns empty array when no packages are shared", () => {
		const base = new Map([["only-in-base", "1.0.0"]]);
		const branch = new Map([["only-in-branch", "2.0.0"]]);
		expect(findDowngrades(base, branch)).toEqual([]);
	});

	it("returns empty array for same version (no regression)", () => {
		const base = new Map([["pkg", "1.0.0"]]);
		const branch = new Map([["pkg", "1.0.0"]]);
		expect(findDowngrades(base, branch)).toEqual([]);
	});

	it("returns empty array when branch upgrades a package", () => {
		const base = new Map([["pkg", "1.0.0"]]);
		const branch = new Map([["pkg", "2.0.0"]]);
		expect(findDowngrades(base, branch)).toEqual([]);
	});

	it("flags a downgrade", () => {
		const base = new Map([["satteri", "0.10.5"]]);
		const branch = new Map([["satteri", "0.10.3"]]);
		expect(findDowngrades(base, branch)).toEqual([
			{ name: "satteri", base: "0.10.5", branch: "0.10.3" },
		]);
	});

	it("flags multiple simultaneous downgrades", () => {
		const base = new Map([
			["vite", "8.2.2"],
			["satteri", "0.10.5"],
		]);
		const branch = new Map([
			["vite", "8.2.1"],
			["satteri", "0.10.3"],
		]);
		const result = findDowngrades(base, branch);
		expect(result).toHaveLength(2);
		expect(result.map((d) => d.name).sort()).toEqual(["satteri", "vite"]);
	});

	it("ignores packages only in base (removed on branch)", () => {
		const base = new Map([
			["pkg-a", "1.0.0"],
			["pkg-b", "2.0.0"],
		]);
		const branch = new Map([["pkg-a", "1.0.0"]]);
		expect(findDowngrades(base, branch)).toEqual([]);
	});

	it("correctly uses max base version when base has multiple entries", () => {
		// base has both vite 6.4.3 and vite 8.2.2; branch only has vite 8.2.1
		const base = new Map([["vite", "8.2.2"]]); // parseLockfile already gives max
		const branch = new Map([["vite", "8.2.1"]]);
		expect(findDowngrades(base, branch)).toEqual([
			{ name: "vite", base: "8.2.2", branch: "8.2.1" },
		]);
	});
});

describe("cli", () => {
	// Vitest runs from the repo root; import.meta.url is not a file URL here.
	const script = join(process.cwd(), "scripts/validation/lockfile-regression-check.mjs");

	/**
	 * Run the guard over two fixture lockfiles.
	 * `entry` overrides how the script itself is addressed, which is what the
	 * entry-point tests below vary.
	 */
	function run(
		baseText: string,
		branchText: string,
		entry?: (dir: string) => { path: string; cwd?: string },
	): { status: number; stdout: string } {
		const dir = mkdtempSync(join(tmpdir(), "lockfile-guard-"));
		const basePath = join(dir, "base.yaml");
		const branchPath = join(dir, "branch.yaml");
		writeFileSync(basePath, baseText);
		writeFileSync(branchPath, branchText);
		const target = entry ? entry(dir) : { path: script };
		const result = spawnSync(process.execPath, [target.path, basePath, branchPath], {
			cwd: target.cwd,
			encoding: "utf8",
		});
		rmSync(dir, { recursive: true, force: true });
		return { status: result.status ?? 1, stdout: result.stdout };
	}

	it("exits 0 when nothing moved backward", () => {
		expect(run(lockfile("vite@8.2.1"), lockfile("vite@8.2.2")).status).toBe(0);
	});

	it("exits 1 on a downgrade", () => {
		expect(run(lockfile("vite@8.2.2"), lockfile("vite@8.2.1")).status).toBe(1);
	});

	// The guard's whole purpose is catching silent problems, so a lockfile it
	// cannot parse has to fail loudly instead of reporting a clean result.
	it("exits 1 rather than reporting clean when a lockfile parses to nothing", () => {
		expect(run(lockfile("vite@8.2.2"), "lockfileVersion: '10.0'\n").status).toBe(1);
	});
	// A mis-detected entry point skips the whole check, which exits 0 and reads
	// as a green result. These pin the two ways the path can arrive differently
	// from the absolute one every other test uses.
	it("still runs when invoked through a relative path", () => {
		const relative = relativePath(process.cwd(), script);
		const result = run(lockfile("vite@8.2.2"), lockfile("vite@8.2.1"), () => ({
			path: relative,
			cwd: process.cwd(),
		}));
		expect(result.status).toBe(1);
	});

	it("still runs when invoked through a symlink", () => {
		const result = run(lockfile("vite@8.2.2"), lockfile("vite@8.2.1"), (dir) => {
			const link = join(dir, "guard-link.mjs");
			symlinkSync(script, link);
			return { path: link };
		});
		expect(result.status).toBe(1);
	});
});
