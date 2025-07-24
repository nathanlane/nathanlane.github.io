import type { Config } from "tailwindcss";
// @ts-expect-error – external plugin lacks TS typings
import fluidType from "tailwindcss-fluid-type";
import { fontFamily } from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

export default {
	content: [
		"./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}",
		"!./src/pages/og-image/[slug].png.ts",
	],
	corePlugins: {
		// disable some core plugins as they are included in the css, even when unused
		borderOpacity: false,
		fontVariantNumeric: false,
		ringOffsetColor: false,
		ringOffsetWidth: false,
		scrollSnapType: false,
		textOpacity: false,
		touchAction: false,
	},
	darkMode: ["class", '[data-theme="dark"]'],
	plugins: [
		fluidType({
			minScreen: "320px",
			maxScreen: "1280px",
			textSizes: {
				"-2": {
					minSize: "0.768rem",
					maxSize: "0.864rem",
					lineHeight: "1.3889",
				}, // -> 18px LH
				"-1": { minSize: "0.80rem", maxSize: "0.90rem", lineHeight: "1.6667" }, // -> 24px LH
				"0": {
					minSize: "0.9375rem",
					maxSize: "1.0625rem",
					lineHeight: "1.4118",
				}, // -> 24px LH
				"1": { minSize: "1.172rem", maxSize: "1.328rem", lineHeight: "1.5385" }, // -> 30px LH
				"2": { minSize: "1.465rem", maxSize: "1.66rem", lineHeight: "1.6364" }, // -> 42px LH
				"3": { minSize: "1.831rem", maxSize: "2.075rem", lineHeight: "1.3103" }, // -> 42px LH
				"4": { minSize: "2.289rem", maxSize: "2.594rem", lineHeight: "1.3125" }, // -> 54px LH
				"5": { minSize: "2.861rem", maxSize: "3.242rem", lineHeight: "1.25" }, // -> 66px LH
				"6": { minSize: "3.576rem", maxSize: "4.053rem", lineHeight: "1.1667" }, // -> 78px LH
			},
		}),
		require("@tailwindcss/typography"),
		plugin(({ addComponents, addBase, addUtilities, theme }) => {
			// Custom utilities for fine-tuned typography
			addUtilities({
				".tracking-tight-display": { letterSpacing: "-0.015em" },
				".tracking-nav": { letterSpacing: "0.05em" }, // For uppercase navigation

				// Reading measure utilities for optimal line length
				".measure-narrow": {
					maxWidth: "45ch",
				},
				".measure-base": {
					maxWidth: "65ch",
				},
				".measure-wide": {
					maxWidth: "80ch",
				},
				".measure-full": {
					maxWidth: "none",
				},

				// Mobile-optimized reading measures
				"@media (max-width: 640px)": {
					".measure-mobile": {
						maxWidth: "100%",
						paddingLeft: "1rem", // 4b
						paddingRight: "1rem", // 4b
					},
					".measure-base": {
						maxWidth: "100%", // Full width on mobile
					},
				},

				// Touch-friendly spacing for mobile
				".touch-target": {
					minHeight: "44px", // iOS minimum
					display: "flex",
					alignItems: "center",
					"@screen sm": {
						minHeight: "36px", // Can be smaller on desktop
					},
				},
				".touch-padding": {
					padding: "0.75rem", // 12px - comfortable touch padding
					"@screen sm": {
						padding: "0.5rem", // 8px on desktop
					},
				},

				// Mobile-optimized line heights
				".leading-mobile": {
					lineHeight: "1.5", // Tighter for mobile screens
					"@screen sm": {
						lineHeight: "1.6", // Normal on desktop
					},
				},

				// Dark mode specific utilities

				".dark-heading-enhanced": {
					':root[data-theme="dark"] &': {
						fontWeight: theme("fontWeight.medium"),
						letterSpacing: "0.01em",
						opacity: "0.93",
					},
				},
				".dark-contrast-high": {
					':root[data-theme="dark"] &': {
						color: "hsl(0deg 0% 98%)",
						fontWeight: "500",
					},
				},
				".dark-contrast-low": {
					':root[data-theme="dark"] &': {
						opacity: "0.75",
						color: "hsl(0deg 0% 70%)",
					},
				},
				".dark-glow-subtle": {
					':root[data-theme="dark"] &': {
						textShadow: "0 0 10px rgba(255, 255, 255, 0.1)",
					},
				},
				".dark-glow-hover": {
					':root[data-theme="dark"] &:hover': {
						textShadow: "0 0 15px currentColor",
						filter: "brightness(1.2)",
					},
				},
			});
			addComponents({
				// Body Text System - Inter optimized
				".text-body": {
					fontSize: "var(--step-0)", // 15-17px fluid
					fontWeight: theme("fontWeight.light"), // Semantic light weight
					letterSpacing: theme("letterSpacing.normal"), // Semantic normal spacing
					lineHeight: "1.6", // 24px baseline aligned
					color: theme("colors.textColor"),
					fontFamily: theme("fontFamily.sans"),
					// Dark mode optimization
					":root[data-theme='dark'] &": {
						fontWeight: "360", // Lighter in dark mode
						letterSpacing: "0.008em",
					},
					// Mobile optimization  
					"@media (max-width: 640px)": {
						fontWeight: "400", // Heavier on mobile
						letterSpacing: "0.003em",
					},
				},
				".text-body-sm": {
					fontSize: "var(--step--1)",
					fontWeight: "400",
					letterSpacing: "0.008em",
					lineHeight: "1.55",
					color: theme("colors.light"),
					fontFamily: theme("fontFamily.sans"),
				},
				".text-lead": {
					fontSize: "var(--step-1)", 
					fontWeight: "400",
					letterSpacing: "0.002em",
					lineHeight: "1.65", // More generous for lead text
					color: theme("colors.accent"),
					fontFamily: theme("fontFamily.sans"),
				},

				// Heading system with consistent spacing and baseline grid alignment
				".heading-1": {
					"@apply font-headline text-accent-base": {},
					fontSize: "var(--step-5)",
					"scroll-margin-top": "4rem", // For anchor links
					lineHeight: "1.15", // Tighter for display
					fontWeight: "350", // Light Inter for elegance
					letterSpacing: theme("letterSpacing.tight"), // Semantic tight spacing
					// Professional polish with OpenType features
					fontFeatureSettings:
						'"kern" 1, "liga" 1, "clig" 1, "calt" 1, "lnum" 1, "case" 1, "cpsp" 1',
					// Warm subtle enhancement
					textShadow: "0 0 1px rgba(0, 0, 0, 0.02)",
					"@media (max-width: 640px)": {
						fontWeight: "400", // Slightly heavier on mobile
						letterSpacing: "-0.01em",
					},
					// High-DPI displays: Can go lighter
					"@media (-webkit-min-device-pixel-ratio: 2)": {
						fontWeight: "325",
						letterSpacing: "-0.02em",
					},
					// Dark mode optimizations
					":root[data-theme='dark'] &": {
						fontWeight: "300", // Lighter in dark mode
						opacity: "0.95",
						textShadow: "0 0 2px rgba(255, 255, 255, 0.02)",
						"@media (max-width: 640px)": {
							fontWeight: "375",
						},
					},
				},
				".heading-2": {
					"@apply font-headline text-accent-two": {},
					fontSize: "var(--step-4)",
					"scroll-margin-top": "4rem",
					lineHeight: "1.25", // Tighter for sections
					fontWeight: theme("fontWeight.medium"), // Balanced Inter weight
					letterSpacing: "-0.01em", // Moderate tracking
					// Enhanced OpenType features for section headers
					fontFeatureSettings:
						'"kern" 1, "liga" 1, "clig" 1, "calt" 1, "lnum" 1, "case" 1, "cpsp" 1',
					textShadow: "0 0 1px rgba(0, 0, 0, 0.015)",
					"@media (max-width: 640px)": {
						fontWeight: "500", // Mobile optimization
					},
					// High-DPI displays: Can go lighter
					"@media (-webkit-min-device-pixel-ratio: 2)": {
						fontWeight: "425",
						letterSpacing: "-0.015em",
					},
					":root[data-theme='dark'] &": {
						fontWeight: "400", // Lighter in dark mode
						opacity: "0.93",
						textShadow: "0 0 1px rgba(255, 255, 255, 0.015)",
						"@media (max-width: 640px)": {
							fontWeight: "475",
						},
					},
				},
				".heading-3": {
					"@apply font-headline text-accent-base": {},
					fontSize: "var(--step-3)",
					"scroll-margin-top": "4rem",
					lineHeight: "1.3", // Tighter for subsections
					fontWeight: "550", // Semi-bold Inter
					letterSpacing: "-0.005em", // Slight negative tracking
					// Subsection header refinement with enhanced features
					fontFeatureSettings:
						'"kern" 1, "liga" 1, "clig" 1, "calt" 1, "lnum" 1, "case" 1, "cpsp" 1',
					textShadow: "0 0 1px rgba(0, 0, 0, 0.01)",
					"@media (max-width: 640px)": {
						fontWeight: "600", // Mobile optimization
					},
					// High-DPI displays: Can go lighter
					"@media (-webkit-min-device-pixel-ratio: 2)": {
						fontWeight: "525",
					},
					":root[data-theme='dark'] &": {
						fontWeight: "500", // Lighter in dark mode
						opacity: "0.92",
						"@media (max-width: 640px)": {
							fontWeight: "575",
						},
					},
				},
				".heading-4": {
					"@apply font-headline text-accent-base": {},
					fontSize: "var(--step-2)",
					"scroll-margin-top": "4rem",
					lineHeight: "1.35", // Balanced for details
					fontWeight: "600", // Semi-bold for clarity
					letterSpacing: "0.005em", // Slight positive for warmth
					// Detail header optimization - ligatures enabled for warmth
					fontFeatureSettings: '"kern" 1, "liga" 1, "clig" 1, "calt" 1, "lnum" 1',
					"@media (max-width: 640px)": {
						fontWeight: "650", // Mobile optimization
					},
					":root[data-theme='dark'] &": {
						fontWeight: "550", // Lighter in dark mode
						opacity: "0.90",
						"@media (max-width: 640px)": {
							fontWeight: "625",
						},
					},
				},
				".heading-5": {
					"@apply font-headline text-accent-base": {},
					fontSize: "var(--step-1)",
					"scroll-margin-top": "4rem",
					lineHeight: "1.4", // Tighter for smaller text
					fontWeight: "650", // Bold for small sizes
					letterSpacing: "0.01em", // Positive tracking for warmth
					// Fine detail header - ligatures for warmth
					fontFeatureSettings: '"kern" 1, "liga" 1, "clig" 1, "calt" 1, "lnum" 1',
					"@media (max-width: 640px)": {
						fontWeight: "675", // Slightly heavier on mobile
					},
					":root[data-theme='dark'] &": {
						fontWeight: "600", // Lighter in dark mode
						opacity: "0.90",
						"@media (max-width: 640px)": {
							fontWeight: "650",
						},
					},
				},
				".heading-6": {
					"@apply font-headline text-accent-base": {},
					fontSize: "var(--step-0)",
					"scroll-margin-top": "4rem",
					lineHeight: "1.5", // Optimal for small caps
					fontWeight: "600", // Medium weight for small caps
					textTransform: "uppercase",
					letterSpacing: theme("letterSpacing.caps"), // Semantic caps spacing
					// Enhanced small caps with warmth
					fontVariantCaps: "small-caps",
					fontFeatureSettings: '"kern" 1, "liga" 1, "clig" 1, "calt" 1, "smcp" 1, "c2sc" 1',
					"@media (max-width: 640px)": {
						fontWeight: "625",
					},
					":root[data-theme='dark'] &": {
						fontWeight: "550", // Lighter in dark mode
						opacity: "0.88",
						"@media (max-width: 640px)": {
							fontWeight: "600",
						},
					},
				},

				// Meta Text System - Inter optimized hierarchy
				".meta-primary": {
					fontSize: "var(--step--1)", // 14px equivalent
					fontWeight: theme("fontWeight.medium"),
					letterSpacing: theme("letterSpacing.normal"),
					lineHeight: "1.5",
					color: theme("colors.light"),
					fontFamily: theme("fontFamily.sans"),
				},
				".meta-secondary": {
					fontSize: "0.8125rem", // 13px
					fontWeight: "400", 
					letterSpacing: theme("letterSpacing.wide"),
					lineHeight: "1.45",
					color: theme("colors.lighter"),
					fontFamily: theme("fontFamily.sans"),
				},
				".meta-tertiary": {
					fontSize: "0.75rem", // 12px
					fontWeight: "380",
					letterSpacing: "0.03em", 
					lineHeight: "1.4",
					color: theme("colors.lightest"),
					fontFamily: theme("fontFamily.sans"),
				},
				".meta-caps": {
					fontSize: "0.6875rem", // 11px
					fontWeight: "500",
					textTransform: "uppercase",
					letterSpacing: "0.08em",
					lineHeight: "1.4",
					color: theme("colors.light"),
					fontFamily: theme("fontFamily.sans"),
					fontVariantCaps: "small-caps",
				},
				// Legacy compatibility - removed conflicting text-meta definition
				".text-caption": {
					"@apply meta-secondary italic": {},
				},
				".text-quote": {
					"@apply text-1 font-headline italic text-accent leading-relaxed": {},
				},

				// Legacy component - keeping for compatibility
				".title": {
					"@apply font-normal text-accent-base": {},
				},
				".data-footnote-backref": {
					"&:hover": {
						"@apply no-underline": {},
					},
					"@apply inline-flex bg-accent-two text-bgColor text-xs size-4 rounded-sm items-center justify-center":
						{},
				},

				// Icon System - Semantic classes with ultra-minimal stroke width
				".icon-sm": {
					"@apply size-2.5 aspect-square": {}, // 10px - decorative, small
					"stroke-width": "1 !important",
					"vector-effect": "non-scaling-stroke",
					"stroke-linecap": "round !important",
					"stroke-linejoin": "round !important",
				},
				".icon-base": {
					"@apply size-3 aspect-square": {}, // 12px - standard UI icons
					"stroke-width": "1 !important",
					"vector-effect": "non-scaling-stroke",
					"stroke-linecap": "round !important",
					"stroke-linejoin": "round !important",
				},
				".icon-lg": {
					"@apply size-3 aspect-square": {}, // 12px - prominent actions
					"stroke-width": "1 !important",
					"vector-effect": "non-scaling-stroke",
					"stroke-linecap": "round !important",
					"stroke-linejoin": "round !important",
				},
				".icon-xl": {
					"@apply size-4 aspect-square": {}, // 16px - large interactive
					"stroke-width": "1 !important",
					"vector-effect": "non-scaling-stroke",
					"stroke-linecap": "round !important",
					"stroke-linejoin": "round !important",
				},

				// Context-specific icon styles with ultra-minimal stroke width
				".icon-nav": {
					"@apply size-3 aspect-square drop-shadow-[0px_1.5px_1.5px_rgba(0,0,0,0.175)]": {},
					"stroke-width": "1 !important",
					"vector-effect": "non-scaling-stroke",
					"stroke-linecap": "round !important",
					"stroke-linejoin": "round !important",
				},
				".icon-close": {
					"@apply size-3 aspect-square hover:scale-110": {},
					"stroke-width": "1 !important",
					"vector-effect": "non-scaling-stroke",
					"stroke-linecap": "round !important",
					"stroke-linejoin": "round !important",
				},
				".icon-rss": {
					"@apply size-3 aspect-square opacity-70 hover:opacity-100": {},
					"stroke-width": "1 !important",
					"vector-effect": "non-scaling-stroke",
					"stroke-linecap": "round !important",
					"stroke-linejoin": "round !important",
				},
				".icon-toggle": {
					"@apply size-3 aspect-square": {},
					"stroke-width": "1 !important",
					"vector-effect": "non-scaling-stroke",
					"stroke-linecap": "round !important",
					"stroke-linejoin": "round !important",
				},
				".icon-action": {
					"@apply size-3 aspect-square hover:text-accent-two": {},
					"stroke-width": "1 !important",
					"vector-effect": "non-scaling-stroke",
					"stroke-linecap": "round !important",
					"stroke-linejoin": "round !important",
				},

				// Unified Button System - Consistent icon button containers
				".btn-icon": {
					"@apply flex items-center justify-center": {},
				},
				".btn-icon-sm": {
					"@apply btn-icon size-4 bg-transparent hover:bg-color-75 text-accent rounded-lg": {},
				},
				".btn-icon-close": {
					"@apply btn-icon size-5 bg-transparent hover:bg-color-75 text-accent-base rounded-lg": {},
				},
				".btn-icon-close-sm": {
					"@apply btn-icon size-3 bg-transparent hover:bg-color-75 text-light rounded": {},
				},
				".btn-icon-nav": {
					"@apply btn-icon size-4 bg-transparent hover:bg-color-75 text-accent-base rounded-lg": {},
				},
				".btn-icon-fab": {
					"@apply btn-icon size-10 bg-bgColor shadow-sm border border-special-lighter hover:shadow-md text-accent-base rounded-lg":
						{},
				},
				".btn-icon-scroll": {
					"@apply btn-icon size-8 bg-bgColor shadow-sm hover:bg-color-100 hover:shadow-md text-light rounded-md":
						{},
				},
				".btn-icon-minimal": {
					"@apply btn-icon size-4 bg-transparent hover:bg-color-75 text-accent-base rounded-lg": {},
				},
				".btn-icon-toggle": {
					"@apply btn-icon size-4 bg-transparent hover:text-accent-two rounded-lg drop-shadow-[0px_1.5px_1.5px_rgba(0,0,0,0.175)]":
						{},
				},

				// Tag/Badge System - Consistent semantic spacing
				".tag": {
					"@apply inline-flex items-center text-xs font-medium rounded-full px-3 py-1": {},
				},
				".tag-accent": {
					"@apply tag bg-accent-base/10 text-accent-base": {},
				},
				".tag-neutral": {
					"@apply tag bg-color-150 text-light": {},
				},
				// Prose blocks with IBM Plex Serif
				".prose-serif": {
					fontFamily: theme("fontFamily.serif"),
				},
				// Headline class for non-heading elements
				".font-headline": {
					fontFamily: theme("fontFamily.headline"),
				},
				// Consistent header spacing using grid variables
				".heading-spacing": {
					marginTop: "var(--space-8)",
					marginBottom: "var(--space-2)",
				},
				".heading-spacing-before": {
					marginTop: "var(--space-8)",
				},
				".heading-spacing-after": {
					marginBottom: "var(--space-2)",
				},
				// Section spacing utilities
				".section-spacing": {
					paddingTop: "var(--space-8)",
					paddingBottom: "var(--space-8)",
				},
				".section-spacing-large": {
					paddingTop: "var(--space-12)",
					paddingBottom: "var(--space-12)",
				},
				".component-spacing": {
					paddingTop: "var(--space-4)",
					paddingBottom: "var(--space-4)",
				},

				// Code block utilities
				".code-block": {
					"@apply bg-color-900 text-color-100 rounded-lg overflow-hidden": {},
					padding: "var(--space-4)",
					fontSize: "0.8125rem", // 13px
					lineHeight: "1.5",
					fontFamily: theme("fontFamily.mono"),
				},
				".code-inline": {
					"@apply bg-color-100 text-accent-base rounded px-1 py-0.5": {},
					fontSize: "0.875em",
					fontFamily: theme("fontFamily.mono"),
					fontWeight: "400",
				},
				// Header with subtitle group
				".header-group": {
					"& h1 + .subtitle, & h2 + .subtitle": {
						marginTop: "-0.5rem", // equivalent to -2b
						fontSize: theme("fontSize.0"),
						fontFamily: theme("fontFamily.sans"),
						fontWeight: "400",
						opacity: "0.8",
						color: theme("colors.textColor"),
					},
				},
			});
			// Typography heading styles - GENERATED FROM Utopia step-map
			addBase({
				// Base styles for all headers - Inter typography system
				"h1, h2, h3, h4, h5, h6": {
					fontFamily: theme("fontFamily.headline"),
					fontWeight: "400",
					lineHeight: "1.2",
					letterSpacing: "-0.005em",
					color: theme("colors.accent-base"),
					marginTop: "0",
					marginBottom: "0",
					fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1, "case" 1, "cpsp" 1',
					textRendering: "optimizeLegibility",
					"-webkit-font-smoothing": "antialiased",
					"-moz-osx-font-smoothing": "grayscale",
				},
				// H1 - Largest display heading (Inter optimized)
				h1: {
					fontSize: "var(--step-5)",
					lineHeight: "1.15",
					fontWeight: "350",
					letterSpacing: "-0.015em",
					// Subtle warmth with text shadow
					textShadow: "0 0 1px rgba(0, 0, 0, 0.02)",
				},
				// H2 - Major section heading (Inter optimized)
				h2: {
					fontSize: "var(--step-4)",
					lineHeight: "1.25",
					fontWeight: theme("fontWeight.medium"),
					letterSpacing: "-0.01em",
					textShadow: "0 0 1px rgba(0, 0, 0, 0.015)",
				},
				// H3 - Subsection heading (Inter optimized)
				h3: {
					fontSize: "var(--step-3)",
					lineHeight: "1.3",
					fontWeight: "550",
					letterSpacing: "-0.005em",
					textShadow: "0 0 1px rgba(0, 0, 0, 0.01)",
				},
				// H4 - Minor heading (Inter optimized)
				h4: {
					fontSize: "var(--step-2)",
					lineHeight: "1.35",
					fontWeight: "600",
					letterSpacing: "0.005em",
				},
				// H5 - Small heading (Inter optimized)
				h5: {
					fontSize: "var(--step-1)",
					lineHeight: "1.4",
					fontWeight: "650",
					letterSpacing: "0.01em",
				},
				// H6 - Smallest heading (Inter optimized)
				h6: {
					fontSize: "var(--step-0)",
					lineHeight: "1.5",
					fontWeight: "600",
					textTransform: "uppercase",
					letterSpacing: "0.08em",
					// Small caps effect for warmth
					fontVariantCaps: "small-caps",
				},
				// Dark mode optimizations for headers (Inter adjustments)
				':root[data-theme="dark"] h1': {
					fontWeight: "300", // Lighter in dark mode
					opacity: "0.95",
					textShadow: "0 0 2px rgba(255, 255, 255, 0.02)",
				},
				':root[data-theme="dark"] h2': {
					fontWeight: "400",
					opacity: "0.93",
					textShadow: "0 0 1px rgba(255, 255, 255, 0.015)",
				},
				':root[data-theme="dark"] h3': {
					fontWeight: "500",
					opacity: "0.92",
				},
				':root[data-theme="dark"] h4': {
					fontWeight: "550",
					opacity: "0.90",
				},
				':root[data-theme="dark"] h5': {
					fontWeight: "600",
					opacity: "0.90",
				},
				':root[data-theme="dark"] h6': {
					fontWeight: "550",
					opacity: "0.88",
				},
			});
		}),
	],

	theme: {
		extend: {
			screens: {
				xs: "320px", // Add xs size
				// xl: '1200px',
			},
			letterSpacing: {
				// Semantic letter-spacing system (consolidated from 20+ values)
				tight: "-0.02em",      // Headlines and display text
				normal: "0.005em",     // Body text (subtle breathing room for Inter)
				wide: "0.02em",        // Emphasis, buttons, interactive elements
				caps: "0.075em",       // Small caps and uppercase text
			},
			fontWeight: {
				// Semantic font weight system (consolidated from 15+ values)
				light: "380",      // Body text, warm and readable
				medium: "450",     // Meta text, emphasis, secondary elements  
				bold: "520",       // Headers, strong emphasis, calls-to-action
			},
			maxWidth: {
				lg: "32rem", // default 32rem (512px)
				xl: "36rem", // default 36rem (576px)
				"2xl": "42rem", // default 42rem (672px)
				"3xl": "48rem", // default 48rem (768px)
				"4xl": "54rem", // !!! // default 56rem (896px)
				"5xl": "64rem", // default 64rem (1024px)
				"6xl": "76rem", // !!! // default 72rem (1152px)
				prose: "var(--measure-base)", // Single source of truth for reading measure
			},
			// GENERATED FROM Utopia step-map
			fontSize: {
				"-2": ["var(--step--2)", "1.5"], // Smallest size
				"-1": ["var(--step--1)", "1.5"], // Small
				"0": ["var(--step-0)", "1.5"], // Base (body text) - 150% line height
				"1": ["var(--step-1)", "1.3"], // Large
				"2": ["var(--step-2)", "1.25"], // Larger
				"3": ["var(--step-3)", "1.2"], // Display
				"4": ["var(--step-4)", "1.15"], // Display Large - Hochuli: tighter leading for display sizes
				"5": ["var(--step-5)", "1.1"], // Display XL
				"6": ["var(--step-6)", "1.05"], // Display XXL
				// Legacy mappings for compatibility
				xs: ["var(--step--2)", "1.5"],
				sm: ["var(--step--1)", "1.5"],
				base: ["var(--step-0)", "1.5"],
				lg: ["var(--step-1)", "1.2"],
				xl: ["var(--step-2)", "1.2"],
				"2xl": ["var(--step-3)", "1.15"],
				"3xl": ["var(--step-4)", "1.1"],
				"4xl": ["var(--step-5)", "1.1"],
				"5xl": ["var(--step-6)", "1.05"],
			},
			// Grid System - 6px base unit, 24px baseline
			spacing: {
				// Core spacing scale using CSS variables
				"0": "0",
				px: "1px",
				"0.5": "0.125rem",
				"1": "var(--space-1)", // 6px (1 grid unit)
				"2": "var(--space-2)", // 12px (2 grid units)
				"3": "var(--space-3)", // 18px (3 grid units)
				"4": "var(--space-4)", // 24px (4 grid units = 1 baseline)
				"5": "var(--space-5)", // 30px (5 grid units)
				"6": "var(--space-6)", // 36px (6 grid units = 1.5 baselines)
				"8": "var(--space-8)", // 48px (8 grid units = 2 baselines)
				"12": "var(--space-12)", // 72px (12 grid units = 3 baselines)
				"16": "var(--space-16)", // 96px (16 grid units = 4 baselines)
				"24": "var(--space-24)", // 144px (24 grid units = 6 baselines)

				// New baseline-unit naming convention
				"1b": "var(--space-1)", // 6px (1 grid unit)
				"2b": "var(--space-2)", // 12px (2 grid units)
				"3b": "var(--space-3)", // 18px (3 grid units)
				"4b": "var(--space-4)", // 24px (4 grid units = 1 baseline)
				"5b": "var(--space-5)", // 30px (5 grid units)
				"6b": "var(--space-6)", // 36px (6 grid units = 1.5 baselines)
				"8b": "var(--space-8)", // 48px (8 grid units = 2 baselines)
				"10b": "var(--space-10)", // 60px (10 grid units = 2.5 baselines)
				"12b": "var(--space-12)", // 72px (12 grid units = 3 baselines)
				"16b": "var(--space-16)", // 96px (16 grid units = 4 baselines)
				"24b": "var(--space-24)", // 144px (24 grid units = 6 baselines)

				// Legacy mappings for gradual migration - DEPRECATED
				// baseline: "var(--grid-unit)",
				// "1b": "var(--space-1)",
				// "2b": "var(--space-2)",
				// "3b": "var(--space-3)",
				// "4b": "var(--space-4)",
				// "6b": "var(--space-6)",
				// "8b": "var(--space-8)",
				// "12b": "var(--space-12)",
				// "16b": "var(--space-16)",
				// hero: "var(--space-24)",

				// Semantic spacing tokens
				"space-3xs": "var(--space-1)", // 6px — micro-spacing
				"space-2xs": "var(--space-2)", // 12px
				"space-xs": "var(--space-3)", // 18px
				"space-s": "var(--space-4)", // 24px – base rhythm unit
				"space-m": "var(--space-4)", // 24px – paragraph gap
				"space-l": "var(--space-6)", // 36px – before headings
				"space-xl": "var(--space-8)", // 48px – regular section spacing
				"space-2xl": "var(--space-12)", // 72px – large section spacing
				"space-3xl": "var(--space-16)", // 96px – hero / major break

				// Compound spacing with smoother transitions (~33% increases)
				"space-3xs-2xs": "calc(var(--space-1) * 1.5)", // 9px
				"space-2xs-xs": "calc(var(--space-2) * 1.25)", // 15px
				"space-xs-s": "calc(var(--space-3) * 1.17)", // 21px
				"space-s-m": "calc(var(--space-3) * 1.5)", // 27px
				"space-m-l": "calc(var(--space-4) * 1.25)", // 30px
				"space-l-xl": "calc(var(--space-6) * 1.17)", // 42px
				"space-xl-2xl": "calc(var(--space-8) * 1.25)", // 60px
				"space-2xl-3xl": "calc(var(--space-12) * 1.17)", // 84px

				// Semantic spacing aliases - aligned to new grid
				line: "var(--space-1)", // 6px – micro adjustments
				paragraph: "var(--space-4)", // 24px – paragraph spacing
				"heading-before": "var(--space-6)", // 36px – before headings
				"heading-after": "var(--space-2)", // 12px – after headings
				"list-item": "var(--space-1)", // 6px – list item separation
				component: "var(--space-4)", // 24px – component padding
				"component-gap": "var(--space-4)", // 24px – between components
				section: "var(--space-8)", // 48px – section padding
				"section-large": "var(--space-12)", // 72px – major sections
				"button-x": "var(--space-3)", // 18px – button horizontal
				"button-y": "var(--space-2)", // 12px – button vertical
				input: "var(--space-3)", // 18px – input padding
				"code-button-x": "var(--space-3)", // 18px – code copy horizontal
				"code-button-y": "var(--space-2)", // 12px – code copy vertical
			},
			colors: {
				color: {
					950: "var(--theme-color-950)",
					900: "var(--theme-color-900)",
					850: "var(--theme-color-850)",
					800: "var(--theme-color-800)",
					750: "var(--theme-color-750)",
					700: "var(--theme-color-700)",
					650: "var(--theme-color-650)",
					600: "var(--theme-color-600)",
					550: "var(--theme-color-550)",
					500: "var(--theme-color-500)",
					450: "var(--theme-color-450)",
					400: "var(--theme-color-400)",
					350: "var(--theme-color-350)",
					300: "var(--theme-color-300)",
					250: "var(--theme-color-250)",
					200: "var(--theme-color-200)",
					150: "var(--theme-color-150)",
					100: "var(--theme-color-100)",
					75: "var(--theme-color-75)",
					50: "var(--theme-color-50)",
				},
				bgColor: "hsl(var(--theme-bg) / <alpha-value>)",
				textColor: "var(--theme-text)",
				"accent-base": "hsl(var(--theme-accent-base) / <alpha-value>)",
				"accent-one": "hsl(var(--theme-accent-one) / <alpha-value>)",
				"accent-two": "hsl(var(--theme-accent-two) / <alpha-value>)",
				link: "hsl(var(--theme-link) / <alpha-value>)",
				accent: "var(--theme-accent)",
				quote: "hsl(var(--theme-quote) / <alpha-value>)",
				lightest: "var(--theme-lightest)",
				lighter: "var(--theme-lighter)",
				light: "var(--theme-light)",
				"special-lightest": "var(--theme-special-lightest)",
				"special-lighter": "var(--theme-special-lighter)",
				"special-light": "var(--theme-special-light)",
				// Warm gray colors with subtle yellow tone
				warm: {
					50: "hsl(48deg 8% 96%)", // Very subtle warm gray (light mode bg)
					100: "hsl(48deg 6% 92%)", // Warm gray for borders (light mode)
					200: "hsl(48deg 5% 85%)", // Darker warm gray
					700: "hsl(48deg 4% 22%)", // Dark mode warm background
					800: "hsl(48deg 3% 18%)", // Darker warm background
					900: "hsl(48deg 2% 14%)", // Darkest warm background
				},
			},
			fontFamily: {
				// Headlines: Inter with system fallbacks
				headline: [
					"Inter Variable",
					"Inter",
					"system-ui",
					"-apple-system",
					"BlinkMacSystemFont",
					"Segoe UI",
					"Roboto",
					...fontFamily.sans,
				],
				// Body text: Inter with system fallbacks
				sans: [
					"Inter Variable",
					"Inter",
					"system-ui",
					"-apple-system",
					"BlinkMacSystemFont",
					"Segoe UI",
					"Roboto",
					"sans-serif",
				],
				// Long-form prose: Source Serif 4
				serif: ["Source Serif 4", "IBM Plex Serif", ...fontFamily.serif],
				// Code/mono: JetBrains Mono with optimized fallbacks
				mono: [
					"JetBrains Mono",
					"SFMono-Regular",
					"Consolas",
					"Liberation Mono",
					"Menlo",
					"Courier",
					"monospace",
				],
				// Metadata/decorative: JetBrains Mono with fallbacks
				meta: [
					"JetBrains Mono",
					"Departure Mono",
					"SFMono-Regular",
					"Consolas",
					"Menlo",
					"monospace",
				],
			},
			// @ts-expect-error
			// Remove above once tailwindcss exposes theme type
			typography: (theme) => ({
				DEFAULT: {
					css: {
						// Enforce baseline grid alignment
						"--tw-prose-body": theme("colors.textColor"),
						"--tw-prose-headings": theme("colors.accent-base"),
						"--tw-prose-line-height": "1.6",

						// Base typography
						fontSize: theme("fontSize.0"),
						lineHeight: "1.6", // Optimal for baseline grid

						// Headings with baseline grid
						"h1, h2, h3, h4, h5, h6": {
							"scroll-margin-top": "var(--space-8)", // For anchor links
						},
						h1: {
							fontSize: "var(--step-5)",
							fontFamily: 'var(--font-headline)',
							fontWeight: "600",
							letterSpacing: "-0.01em",
							marginBottom: "var(--space-4)",
							marginTop: "0",
							lineHeight: "1.1",
						},
						h2: {
							fontSize: "var(--step-4)",
							fontFamily: 'var(--font-headline)',
							fontWeight: "700",
							letterSpacing: "-0.005em",
							marginBottom: "var(--space-3)",
							marginTop: "var(--space-6)",
							lineHeight: "1.15",
						},
						h3: {
							fontSize: "var(--step-3)",
							fontFamily: 'var(--font-headline)',
							fontWeight: "900",
							letterSpacing: "0",
							marginBottom: "var(--space-3)",
							marginTop: "var(--space-4)",
							lineHeight: "1.2",
						},
						h4: {
							fontSize: "var(--step-2)",
							fontFamily: 'var(--font-headline)',
							fontWeight: "900",
							letterSpacing: "0",
							marginBottom: "var(--space-3)",
							marginTop: "var(--space-4)",
							lineHeight: "1.25",
						},
						h5: {
							fontSize: "var(--step-1)",
							fontFamily: 'var(--font-headline)',
							fontWeight: "900",
							letterSpacing: "0",
							marginBottom: "var(--space-1)",
							marginTop: "var(--space-4)",
							lineHeight: "1.3",
						},
						h6: {
							fontSize: "var(--step-0)",
							fontFamily: 'var(--font-headline)',
							fontWeight: "900",
							textTransform: "uppercase",
							letterSpacing: "0.05em",
							marginBottom: "var(--space-1)",
							marginTop: "var(--space-3)",
							lineHeight: "1.4",
						},

						// Paragraph spacing aligned to new grid
						p: {
							marginBottom: "var(--space-4)",
							marginTop: "0",
							lineHeight: "1.6",
						},

						// List spacing aligned to grid
						"ul, ol": {
							marginTop: "var(--space-4)",
							marginBottom: "var(--space-4)",
							paddingLeft: "var(--space-4)",
						},
						li: {
							paddingBottom: "var(--space-1)",
							lineHeight: "1.6",
						},
						"li > ul, li > ol": {
							marginTop: "var(--space-2)",
							marginBottom: "var(--space-2)",
						},
						"li::marker": {
							color: theme("colors.accent-base"),
						},

						// Code blocks aligned to grid
						pre: {
							marginTop: "var(--space-4)",
							marginBottom: "var(--space-4)",
							padding: "var(--space-3)",
							borderRadius: "var(--space-1)",
							fontSize: "0.8125rem",
							lineHeight: "1.6",
							overflowX: "auto",
							WebkitOverflowScrolling: "touch",
							"@apply relative": "",
						},
						code: {
							padding: "calc(var(--space-1) / 2) var(--space-1)",
							borderRadius: "calc(var(--space-1) / 2)",
							fontSize: "0.875em",
							fontWeight: "400",
							backgroundColor: theme("colors.color.100"),
						},
						"pre code": {
							padding: "0",
							borderRadius: "0",
							fontSize: "inherit",
							fontWeight: "inherit",
							backgroundColor: "transparent",
						},

						a: {
							"@apply inline-link": "",
						},
						// Blockquote aligned to grid
						blockquote: {
							marginTop: "var(--space-4)",
							marginBottom: "var(--space-4)",
							paddingLeft: "var(--space-4)",
							borderLeftWidth: "var(--space-1)",
							borderLeftColor: theme("colors.accent-base"),
							fontStyle: "italic",
							fontSize: "inherit",
							"@apply font-normal text-quote [&>p:first-of-type]:mt-0 [&>p:last-of-type]:mb-0": "",
							"p::before": {
								"@apply leading-none font-serif font-medium relative content-['“'] text-2xl text-lightest top-[0.31125rem] md:top-[0.31125rem] -ms-4 me-0.5":
									"",
							},
							"p::after": {
								"@apply leading-none font-serif font-medium relative content-['”'] text-2xl text-lightest top-[0.31125rem] md:top-[0.31125rem] ms-0":
									"",
							},
						},

						// Table spacing aligned to grid
						table: {
							marginTop: "var(--space-6)",
							marginBottom: "var(--space-6)",
							width: "100%",
							fontSize: theme("fontSize.-1"),
						},
						"thead th": {
							paddingTop: "var(--space-2)",
							paddingBottom: "var(--space-2)",
							paddingLeft: "var(--space-3)",
							paddingRight: "var(--space-3)",
							fontWeight: "600",
							borderBottomWidth: "2px",
							borderBottomColor: theme("colors.accent-base"),
						},
						"tbody td": {
							paddingTop: "var(--space-2)",
							paddingBottom: "var(--space-2)",
							paddingLeft: "var(--space-3)",
							paddingRight: "var(--space-3)",
							borderBottomWidth: "1px",
							borderBottomColor: theme("colors.color.200"),
						},
						"tbody tr:last-child td": {
							borderBottomWidth: "0",
						},

						// Keyboard input
						kbd: {
							padding: "calc(var(--space-1) / 2) var(--space-1)",
							fontSize: "0.875em",
							fontFamily: theme("fontFamily.mono"),
							borderRadius: "var(--space-1)",
							"@apply text-textColor bg-special-lighter border-color-100 shadow-[0px_2.5px_0px_rgba(0,0,0,0.25)]":
								"",
						},
						// Horizontal rules
						hr: {
							marginTop: "var(--space-6)",
							marginBottom: "var(--space-6)",
							"@apply border-t border-solid border-color-200": "",
						},
						// Strong emphasis
						strong: {
							fontWeight: "600",
							color: theme("colors.accent-base"),
						},
						sup: {
							"&:hover": {
								"@apply no-underline": "",
							},
							"@apply bg-accent-two ms-0.5 px-1 rounded-sm text-bgColor": "",
							a: {
								"&:hover": {
									"@apply no-underline": "",
								},
								"@apply text-bgColor": "",
							},
						},

						// Figure and image spacing with mobile optimization
						figure: {
							marginTop: "var(--space-4)",
							marginBottom: "var(--space-4)",
							marginLeft: "-1rem", // Full bleed on mobile
							marginRight: "-1rem",
							"@screen sm": {
								marginTop: "var(--space-6)",
								marginBottom: "var(--space-6)",
								marginLeft: "0",
								marginRight: "0",
							},
						},
						"figure img": {
							marginTop: "0",
							marginBottom: "0",
							width: "100%",
							height: "auto",
						},
						"figure figcaption": {
							marginTop: "var(--space-2)",
							paddingLeft: "1rem", // Restore padding for caption
							paddingRight: "1rem",
							fontSize: "0.8125rem", // Smaller on mobile
							color: theme("colors.light"),
							textAlign: "center",
							fontStyle: "italic",
							"@screen sm": {
								paddingLeft: "0",
								paddingRight: "0",
								fontSize: theme("fontSize.-1"),
							},
						},
						img: {
							marginTop: "var(--space-4)",
							marginBottom: "var(--space-4)",
							borderRadius: "var(--space-1)",
							maxWidth: "100%",
							height: "auto",
							"@screen sm": {
								marginTop: "var(--space-4)",
								marginBottom: "var(--space-4)",
							},
						},
						video: {
							marginTop: "var(--space-4)",
							marginBottom: "var(--space-4)",
							borderRadius: "var(--space-1)",
							maxWidth: "100%",
							height: "auto",
							"@screen sm": {
								marginTop: "var(--space-4)",
								marginBottom: "var(--space-4)",
							},
						},

						// Definition lists
						dl: {
							marginTop: "var(--space-3)",
							marginBottom: "var(--space-3)",
						},
						dt: {
							marginTop: "var(--space-2)",
							fontWeight: "600",
							color: theme("colors.accent-base"),
						},
						dd: {
							marginTop: "var(--space-1)",
							marginBottom: "var(--space-2)",
							paddingLeft: "var(--space-3)",
						},
						'th[align="left"], td[align="left"]': {
							"text-align": "left",
						},
						// Alternating backgrounds for table rows
						"tbody tr:nth-child(odd)": {
							"@apply bg-color-100": "", // Light background for odd rows
						},
						"tbody tr:nth-child(even)": {
							"@apply bg-color-50": "", // Lighter background for even rows
						},

						/* Admonitions/Aside */
						".aside": {
							"--admonition-color": "var(--tw-prose-quotes)",
							"@apply my-space-2xs p-component border-s-[0.375rem] rounded-md border-[--admonition-color]":
								"",
							".aside-title": {
								"@apply font-bold text-base flex items-center gap-space-2xs my-0 capitalize text-[--admonition-color]":
									"",
								"&:before": {
									"@apply inline-block shrink-0 overflow-visible h-4 w-4 align-middle content-[''] bg-[--admonition-color]":
										"",
									"mask-size": "contain",
									"mask-position": "center",
									"mask-repeat": "no-repeat",
								},
							},
							".aside-content": {
								"> :last-child": {
									"@apply mb-0": "",
								},
							},
						},
						".aside.aside-note": {
							"--admonition-color": theme("colors.color.400"),
							"@apply bg-color-75": "",
							".aside-title": {
								"&:before": {
									maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' version='1.1' width='16' height='16' aria-hidden='true'%3E%3Cpath fill='var(--admonitions-color-tip)' d='M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z'%3E%3C/path%3E%3C/svg%3E")`,
								},
							},
						},
						".aside.aside-tip": {
							"--admonition-color": theme("colors.color.400"),
							"@apply bg-color-75": "",
							".aside-title": {
								"&:before": {
									maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' version='1.1' width='16' height='16' aria-hidden='true'%3E%3Cpath d='M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.211c-.04-.282-.163-.547-.37-.847a8.456 8.456 0 0 0-.542-.68c-.084-.1-.173-.205-.268-.32C3.201 7.75 2.5 6.766 2.5 5.25 2.5 2.31 4.863 0 8 0s5.5 2.31 5.5 5.25c0 1.516-.701 2.5-1.328 3.259-.095.115-.184.22-.268.319-.207.245-.383.453-.541.681-.208.3-.33.565-.37.847a.751.751 0 0 1-1.485-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75ZM5.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5ZM6 15.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z'%3E%3C/path%3E%3C/svg%3E")`,
								},
							},
						},
						".aside.aside-important": {
							"--admonition-color": theme("colors.color.400"),
							"@apply bg-color-75": "",
							".aside-title": {
								"&:before": {
									maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' version='1.1' width='16' height='16' aria-hidden='true'%3E%3Cpath d='M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z'%3E%3C/path%3E%3C/svg%3E")`,
								},
							},
						},
						".aside.aside-warning": {
							"--admonition-color": theme("colors.color.400"),
							"@apply bg-color-75": "",
							".aside-title": {
								"&:before": {
									maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' version='1.1' width='16' height='16' aria-hidden='true'%3E%3Cpath d='M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z'%3E%3C/path%3E%3C/svg%3E")`,
								},
							},
						},
						".aside.aside-caution": {
							"--admonition-color": theme("colors.color.400"),
							"@apply bg-color-75": "",
							".aside-title": {
								"&:before": {
									maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' version='1.1' width='16' height='16' aria-hidden='true'%3E%3Cpath d='M4.47.22A.749.749 0 0 1 5 0h6c.199 0 .389.079.53.22l4.25 4.25c.141.14.22.331.22.53v6a.749.749 0 0 1-.22.53l-4.25 4.25A.749.749 0 0 1 11 16H5a.749.749 0 0 1-.53-.22L.22 11.53A.749.749 0 0 1 0 11V5c0-.199.079-.389.22-.53Zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z'%3E%3C/path%3E%3C/svg%3E")`,
								},
							},
						},
					},
				},
				// Enhanced dark mode typography with optimized contrast
				invert: {
					css: {
						// Base color adjustments
						"--tw-prose-body": "hsl(0deg 0% 88%)", // Not pure white
						"--tw-prose-headings": "hsl(0deg 0% 95%)", // Brighter headings
						"--tw-prose-bold": "hsl(0deg 0% 98%)", // High contrast for emphasis
						"--tw-prose-counters": "hsl(0deg 0% 60%)", // Muted counters
						"--tw-prose-bullets": "hsl(0deg 0% 50%)", // Subtle bullets
						"--tw-prose-hr": "hsl(0deg 0% 20%)", // Subtle dividers
						"--tw-prose-quotes": "hsl(0deg 0% 75%)", // Slightly muted quotes
						"--tw-prose-quote-borders": "hsl(0deg 0% 40%)", // Visible but not harsh
						"--tw-prose-captions": "hsl(0deg 0% 65%)", // Readable secondary text
						"--tw-prose-code": "hsl(0deg 0% 85%)", // Good contrast inline code
						"--tw-prose-pre-code": "hsl(0deg 0% 85%)", // Consistent with inline
						"--tw-prose-pre-bg": "hsl(0deg 0% 6%)", // Very dark for code blocks
						"--tw-prose-th-borders": "hsl(0deg 0% 30%)", // Visible table borders
						"--tw-prose-td-borders": "hsl(0deg 0% 15%)", // Subtle row borders

						// Typography adjustments
						p: {
							opacity: "0.90", // Slight reduction for comfort
							lineHeight: "1.65", // More space in dark mode
						},
						"h1, h2, h3, h4, h5, h6": {
							fontFamily: 'var(--font-headline)',
							letterSpacing: "-0.005em", // Tighter for dark mode sans-serif
						},
						h1: {
							opacity: "0.95",
							fontWeight: "600",
						},
						h2: {
							opacity: "0.93",
							fontWeight: "700",
						},
						h3: {
							opacity: "0.92",
							fontWeight: "900",
						},
						h4: {
							opacity: "0.90",
							fontWeight: "900",
						},
						h5: {
							opacity: "0.90",
							fontWeight: "900",
						},
						h6: {
							opacity: "0.88",
							fontWeight: "900",
						},

						// List adjustments
						li: {
							opacity: "0.88",
						},
						"li::marker": {
							color: "hsl(0deg 0% 50%)",
						},

						// Link enhancements
						a: {
							color: "hsl(0deg 0% 80%)",
							textDecoration: "underline",
							textDecorationColor: "hsl(0deg 0% 40%)",
							textUnderlineOffset: "0.15em",
							"&:hover": {
								color: "hsl(0deg 0% 95%)",
								textDecorationColor: "hsl(0deg 0% 60%)",
							},
						},

						// Code block optimizations
						code: {
							backgroundColor: "hsl(0deg 0% 12%)",
							color: "hsl(0deg 0% 88%)",
							borderColor: "hsl(0deg 0% 20%)",
							fontWeight: theme("fontWeight.medium"),
						},
						pre: {
							backgroundColor: "hsl(0deg 0% 6%)",
							borderColor: "hsl(0deg 0% 15%)",
							boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.5)",
						},
						"pre code": {
							backgroundColor: "transparent",
							border: "none",
						},

						// Strong emphasis with better contrast
						strong: {
							color: "hsl(0deg 0% 98%)",
							fontWeight: "500", // Not too heavy
						},

						// Blockquote refinements
						blockquote: {
							borderLeftColor: "hsl(0deg 0% 40%)",
							color: "hsl(0deg 0% 75%)",
							fontStyle: "italic",
							opacity: "0.85",
						},

						// Table optimizations
						thead: {
							borderBottomColor: "hsl(0deg 0% 30%)",
						},
						"thead th": {
							color: "hsl(0deg 0% 85%)",
							fontWeight: "550",
						},
						"tbody tr": {
							borderBottomColor: "hsl(0deg 0% 15%)",
						},
						"tbody td": {
							opacity: "0.88",
						},
						"tbody tr:nth-child(odd)": {
							backgroundColor: "hsl(0deg 0% 8%)",
						},
						"tbody tr:nth-child(even)": {
							backgroundColor: "hsl(0deg 0% 6%)",
						},

						// Figure and caption adjustments
						figcaption: {
							color: "hsl(0deg 0% 65%)",
							opacity: "0.9",
						},

						// Horizontal rule styling
						hr: {
							borderColor: "hsl(0deg 0% 20%)",
							opacity: "0.5",
						},
					},
				},
				lane: {
					css: {
						"--tw-prose-body": theme("colors.textColor / 1"),
						"--tw-prose-bold": theme("colors.textColor / 1"),
						"--tw-prose-bullets": theme("colors.textColor / 1"),
						"--tw-prose-code": theme("colors.accent / 1"),
						"--tw-prose-headings": theme("colors.accent-base / 1"),
						// "--tw-prose-hr": "0.5px dashed #666",
						"--tw-prose-links": theme("colors.link / 1"),
						"--tw-prose-quotes": theme("colors.quote / 1"),
						// "--tw-prose-th-borders": "#666",
						"code::before": { content: "none" },
						"code::after": { content: "none" },
					},
				},
				sm: {
					css: {
						code: {
							fontSize: theme("fontSize.sm")[0],
							fontWeight: "400",
						},
					},
				},
			}),
		},
	},
	safelist: [
		"bg-color-950",
		"bg-color-900",
		"bg-color-850",
		"bg-color-800",
		"bg-color-750",
		"bg-color-700",
		"bg-color-650",
		"bg-color-600",
		"bg-color-550",
		"bg-color-500",
		"bg-color-450",
		"bg-color-400",
		"bg-color-350",
		"bg-color-300",
		"bg-color-250",
		"bg-color-200",
		"bg-color-150",
		"bg-color-100",
		"bg-color-75",
		"bg-color-50",
		"text-color-950",
		"text-color-900",
		"text-color-850",
		"text-color-800",
		"text-color-750",
		"text-color-700",
		"text-color-650",
		"text-color-600",
		"text-color-550",
		"text-color-500",
		"text-color-450",
		"text-color-400",
		"text-color-350",
		"text-color-300",
		"text-color-250",
		"text-color-200",
		"text-color-150",
		"text-color-100",
		"text-color-75",
		"text-color-50",
		"show-grid",
	],
} satisfies Config;
