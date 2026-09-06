type DraftableEntry = {
	data: {
		draft?: boolean;
	};
};

export function isPublishedEntry<T extends DraftableEntry>(entry: T): boolean {
	return entry.data.draft !== true;
}

type ResearchOrderable = {
	data: {
		paperDate: string;
		order?: number | undefined;
	};
};

/**
 * Orders research by publication year, newest first.
 *
 * `order` breaks ties within a year: papers that set it come first, lowest number first,
 * and papers that leave it unset keep their existing relative order behind them. Without
 * a tiebreaker an equal-year comparison returned 0 and the sort fell through to the order
 * files came off disk, so which paper led the page was decided by its filename.
 */
export function compareResearch<T extends ResearchOrderable>(a: T, b: T): number {
	const byYear = Number(b.data.paperDate) - Number(a.data.paperDate);
	if (byYear !== 0) return byYear;

	const aOrder = a.data.order;
	const bOrder = b.data.order;
	if (aOrder === undefined && bOrder === undefined) return 0;
	if (aOrder === undefined) return 1;
	if (bOrder === undefined) return -1;
	return aOrder - bOrder;
}
