#!/usr/bin/env node
/**
 * Lockfile regression check
 * =========================
 *
 * Fails if any package present in both the base and branch pnpm-lock.yaml
 * resolves to a lower max version on the branch — catching silent Dependabot
 * downgrades that CI would otherwise miss.
 *
 * Usage:
 *   node scripts/validation/lockfile-regression-check.mjs <base-lockfile> <branch-lockfile>
 *
 * Exit 0 if clean, 1 on any downgrade detected.
 */

import { readFileSync, realpathSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Key lines in the `packages:` section of a pnpm-lock.yaml v9 file, quoted
// ('@biomejs/biome@2.5.8':) or not (satteri@0.10.5:).
const PACKAGE_KEY_RE = /^ {2}(['"]?)(.+)\1:$/;

/**
 * Split a package key into its name and version.
 *
 * Splitting on the LAST `@` rather than the first is what makes npm aliases
 * work: `string-width@npm:string-width-cjs@4.2.3` has to yield the version
 * `4.2.3`, not the protocol `npm`. Reading `npm` as the version would compare
 * equal on both sides of every alias and hide any downgrade inside one.
 */
function splitPackageKey(key) {
	// Peer-dependency suffixes carry their own `@` signs; drop them first.
	const spec = key.split("(")[0];
	const at = spec.lastIndexOf("@");
	// `at === 0` is a bare scope with no version, which is not a package key.
	if (at <= 0) return null;
	return [spec.slice(0, at), spec.slice(at + 1)];
}

/**
 * Parse a pnpm-lock.yaml v9 text into a map of package name → max resolved version.
 * Only reads the `packages:` section; snapshots are ignored.
 */
export function parseLockfile(text) {
	const map = new Map();
	let inPackages = false;
	for (const line of text.split("\n")) {
		if (line === "packages:") {
			inPackages = true;
			continue;
		}
		if (!inPackages) continue;
		// Top-level key with no indentation ends the packages section.
		if (line.length > 0 && line[0] !== " ") {
			inPackages = false;
			continue;
		}
		// Package keys have exactly 2 spaces of indentation; properties have 4+.
		if (!line.startsWith("  ") || line.startsWith("   ")) continue;
		const m = PACKAGE_KEY_RE.exec(line);
		if (!m) continue;
		const split = splitPackageKey(m[2]);
		if (!split) continue;
		const [name, version] = split;
		const current = map.get(name);
		if (current === undefined || compareVersions(version, current) > 0) {
			map.set(name, version);
		}
	}
	return map;
}

/** Split a version into its numeric core and its prerelease identifiers. */
function splitVersion(version) {
	// Build metadata carries no precedence, so drop it before anything else.
	const core = version.split("+")[0];
	const dash = core.indexOf("-");
	const numeric = (dash === -1 ? core : core.slice(0, dash))
		.split(".")
		.map((part) => Number.parseInt(part, 10) || 0);
	return [numeric, dash === -1 ? [] : core.slice(dash + 1).split(".")];
}

/** Compare prerelease identifier lists under semver precedence rules. */
function comparePrerelease(a, b) {
	const len = Math.max(a.length, b.length);
	for (let i = 0; i < len; i++) {
		// When everything before is equal, more identifiers outrank fewer.
		if (a[i] === undefined) return -1;
		if (b[i] === undefined) return 1;
		const aNumeric = /^\d+$/.test(a[i]);
		const bNumeric = /^\d+$/.test(b[i]);
		if (aNumeric && bNumeric) {
			const diff = Number(a[i]) - Number(b[i]);
			if (diff !== 0) return diff;
		} else if (aNumeric !== bNumeric) {
			// Numeric identifiers always rank below alphanumeric ones.
			return aNumeric ? -1 : 1;
		} else if (a[i] !== b[i]) {
			return a[i] < b[i] ? -1 : 1;
		}
	}
	return 0;
}

/**
 * Compare two version strings under semver precedence.
 * Returns >0 if a > b, <0 if a < b, 0 if equal.
 *
 * Prereleases have to sort below their own release: this lockfile currently
 * resolves `get-tsconfig@5.0.0-beta.4`, so treating `5.0.0` as lower than
 * `5.0.0-beta.4` would report a routine beta-to-stable bump as a downgrade
 * and block the pull request that ships it.
 */
export function compareVersions(a, b) {
	const [coreA, preA] = splitVersion(a);
	const [coreB, preB] = splitVersion(b);
	const len = Math.max(coreA.length, coreB.length);
	for (let i = 0; i < len; i++) {
		const diff = (coreA[i] ?? 0) - (coreB[i] ?? 0);
		if (diff !== 0) return diff;
	}
	if (preA.length === 0 && preB.length === 0) return 0;
	// An unqualified release outranks any prerelease of the same core version.
	if (preA.length === 0) return 1;
	if (preB.length === 0) return -1;
	return comparePrerelease(preA, preB);
}

/**
 * Return packages present in both maps where the branch version is lower than base.
 *
 * Comparison is on each package's highest resolved version. A branch that
 * deliberately drops a duplicate higher resolution therefore reads as a
 * downgrade; that is the intended conservative direction, and the
 * `allow-downgrade` label is the way through it.
 */
export function findDowngrades(base, branch) {
	const downgrades = [];
	for (const [name, baseVer] of base) {
		const branchVer = branch.get(name);
		if (branchVer !== undefined && compareVersions(branchVer, baseVer) < 0) {
			downgrades.push({ name, base: baseVer, branch: branchVer });
		}
	}
	return downgrades;
}

/**
 * True when this module is the process entry point rather than a test import.
 *
 * Both sides are resolved and realpath'd. Comparing raw `process.argv[1]`
 * against an absolute path would make a relative invocation — which is exactly
 * how CI calls this — or a symlinked checkout skip the whole block, and a
 * skipped block exits 0 and reports a green check. For a guard whose failure
 * mode is silence, that is the one bug worth spending lines to prevent.
 */
function isEntryPoint() {
	if (!process.argv[1]) return false;
	return realpathSync(resolve(process.argv[1])) === realpathSync(fileURLToPath(import.meta.url));
}

const isCli = isEntryPoint();
if (isCli) {
	const [basePath, branchPath] = process.argv.slice(2);
	if (!basePath || !branchPath) {
		console.error("Usage: lockfile-regression-check.mjs <base-lockfile> <branch-lockfile>");
		process.exit(1);
	}
	const base = parseLockfile(readFileSync(basePath, "utf8"));
	const branch = parseLockfile(readFileSync(branchPath, "utf8"));
	// Parsing nothing means the lockfile format moved, not that the branch is
	// clean. This guard exists to catch silent problems, so it must not become
	// one by reporting success over a lockfile it could not read.
	if (base.size === 0 || branch.size === 0) {
		console.error(
			`Lockfile regression check could not read a packages section (base: ${base.size}, branch: ${branch.size}). Has the pnpm lockfile format changed?`,
		);
		process.exit(1);
	}
	const downgrades = findDowngrades(base, branch);
	if (downgrades.length === 0) {
		console.log("No lockfile regressions detected.");
		process.exit(0);
	}
	console.error(`Lockfile regression: ${downgrades.length} package(s) downgraded on this branch:`);
	for (const { name, base: bv, branch: rv } of downgrades) {
		console.error(`  ${name}: ${bv} → ${rv}`);
	}
	process.exit(1);
}
