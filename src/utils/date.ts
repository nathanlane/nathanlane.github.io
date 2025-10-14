import type { CollectionEntry } from "astro:content";
import { siteConfig } from "@/site.config";

export function getFormattedDate(
	date: Date | undefined,
	options?: Intl.DateTimeFormatOptions,
): string {
	if (date === undefined) {
		return "Invalid Date";
	}

	return new Intl.DateTimeFormat(siteConfig.date.locale, {
		...(siteConfig.date.options as Intl.DateTimeFormatOptions),
		...options,
	}).format(date);
}

export function collectionDateSort(a: CollectionEntry<"post">, b: CollectionEntry<"post">) {
	return b.data.publishDate.getTime() - a.data.publishDate.getTime();
}

// Helper functions for writing page
export function formatDate(date: Date): string {
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

export function formatMonthYear(date: Date): string {
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "2-digit",
	});
}

/**
 * Normalize status strings for display
 * Converts hyphenated status strings to uppercase with spaces
 * @param status - Status string (e.g., "work-in-progress")
 * @returns Normalized status (e.g., "WORK IN PROGRESS")
 */
export function normalizeStatus(status: string): string {
	return status.toUpperCase().replace(/-/g, " ");
}
