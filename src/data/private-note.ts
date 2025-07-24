import type { CollectionEntry } from "astro:content";

/**
 * Private notes are for personal documentation only and are NEVER web-accessible
 * This utility exists only for potential CLI tools or build scripts
 */

/** Get private notes - NEVER used for web rendering */
export async function getPrivateNotes(): Promise<CollectionEntry<"privateNote">[]> {
	// Private notes are NEVER web-accessible in any environment
	return [];
}

/**
 * Note: These functions are provided for potential CLI tools or build scripts
 * but private notes should never be rendered on the website
 */

/** Groups private notes by year (for CLI tools only) */
export function groupPrivateNotesByYear(notes: CollectionEntry<"privateNote">[]) {
	return notes.reduce<Record<string, CollectionEntry<"privateNote">[]>>((acc, note) => {
		const year = note.data.publishDate.getFullYear();
		if (!acc[year]) {
			acc[year] = [];
		}
		acc[year]?.push(note);
		return acc;
	}, {});
}

/** Returns all tags from private notes (for CLI tools only) */
export function getAllPrivateNoteTags(notes: CollectionEntry<"privateNote">[]) {
	return notes.flatMap((note) => [...note.data.tags]);
}

/** Returns unique tags from private notes (for CLI tools only) */
export function getUniquePrivateNoteTags(notes: CollectionEntry<"privateNote">[]) {
	return [...new Set(getAllPrivateNoteTags(notes))];
}
