type UrlInput = string | URL | undefined;

function toUrlInstance(base?: UrlInput): URL | undefined {
	if (!base) {
		return undefined;
	}

	if (base instanceof URL) {
		return base;
	}

	try {
		return new URL(base);
	} catch {
		return undefined;
	}
}

export function toAbsoluteUrl(value?: string, base?: UrlInput): string | undefined {
	if (!value) {
		return undefined;
	}

	try {
		const baseUrl = toUrlInstance(base);
		return baseUrl ? new URL(value, baseUrl).href : new URL(value).href;
	} catch {
		return value;
	}
}

export function stripTrailingSlash(url: string): string {
	return url.replace(/\/$/, "");
}
