import { siteConfig } from "../site.config";
import { stripTrailingSlash } from "./url";

export function getSupportedWebmentionOrigins(origins = siteConfig.supportedOrigins): string[] {
	return Array.from(
		new Set(
			[siteConfig.canonicalUrl, ...origins]
				.map((origin) => {
					try {
						return stripTrailingSlash(new URL(origin).origin);
					} catch {
						return null;
					}
				})
				.filter((origin): origin is string => origin !== null),
		),
	);
}

export function getSupportedWebmentionHostNames(origins = siteConfig.supportedOrigins): string[] {
	return getSupportedWebmentionOrigins(origins).map((origin) => new URL(origin).hostname);
}

function normalizeSupportedPathname(pathname: string): string {
	if (pathname === "/") {
		return pathname;
	}

	const normalized = pathname.replace(/\/+$/, "");
	return normalized || "/";
}

export function normalizeWebmentionTarget(
	url: string,
	supportedOrigins = getSupportedWebmentionOrigins(),
): string {
	try {
		const parsed = new URL(url);
		const normalizedOrigin = stripTrailingSlash(parsed.origin);
		const normalizedPath = normalizeSupportedPathname(parsed.pathname);
		const suffix = `${normalizedPath}${parsed.search}`;

		if (supportedOrigins.includes(normalizedOrigin)) {
			return suffix;
		}

		return `${normalizedOrigin}${suffix}`;
	} catch {
		return url;
	}
}
