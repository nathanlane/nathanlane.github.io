/**
 * Typography Component Types
 *
 * Type definitions for advanced typography components in the Astro project.
 * These interfaces ensure type safety and provide IntelliSense support.
 */

/**
 * Drop Cap Component Props
 */
export interface DropCapProps {
	/** Visual style variant */
	variant?: "classic" | "modern" | "outline";
	/** Number of lines the drop cap should span */
	lines?: 2 | 3 | 4;
	/** Optional specific letter to use as drop cap (defaults to first letter of content) */
	letter?: string;
	/** Additional CSS classes */
	class?: string;
}

/**
 * Pull Quote Component Props
 */
export interface PullQuoteProps {
	/** Horizontal alignment of the pull quote */
	align?: "left" | "center" | "right";
	/** Visual style variant */
	variant?: "default" | "accent" | "large";
	/** Attribution for the quote */
	attribution?: string;
	/** Optional citation URL */
	cite?: string;
	/** Additional CSS classes */
	class?: string;
}

/**
 * Sidenote Component Props
 */
export interface SidenoteProps {
	/** Optional reference number for the sidenote */
	number?: number;
	/** Whether the sidenote should only appear on hover (desktop only) */
	hover?: boolean;
	/** Additional CSS classes */
	class?: string;
}

/**
 * Common typography configuration
 */
export interface TypographyConfig {
	/** Base font size step from the design system */
	baseFontSize: string;
	/** Line height for optimal readability */
	baseLineHeight: number;
	/** Maximum content width for readability */
	contentWidth: string;
	/** Spacing scale from the design system */
	spacingScale: {
		"3xs": string;
		"2xs": string;
		xs: string;
		s: string;
		m: string;
		l: string;
		xl: string;
		"2xl": string;
		"3xl": string;
	};
}

/**
 * Default typography configuration values
 */
export const defaultTypographyConfig: TypographyConfig = {
	baseFontSize: "var(--step-0)",
	baseLineHeight: 1.6,
	contentWidth: "var(--measure-base)",
	spacingScale: {
		"3xs": "var(--space-3xs)",
		"2xs": "var(--space-2xs)",
		xs: "var(--space-xs)",
		s: "var(--space-s)",
		m: "var(--space-m)",
		l: "var(--space-l)",
		xl: "var(--space-xl)",
		"2xl": "var(--space-2xl)",
		"3xl": "var(--space-3xl)",
	},
};
