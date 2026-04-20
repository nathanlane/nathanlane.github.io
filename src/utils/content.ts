type DraftableEntry = {
	data: {
		draft?: boolean;
	};
};

export function isPublishedEntry<T extends DraftableEntry>(entry: T): boolean {
	return entry.data.draft !== true;
}
