/**
 * Panel Toggle Utility
 * ===================
 *
 * Purpose: Provides reusable show/hide functionality for panels (TOC, Series, etc.)
 *
 * Created: July 17, 2025
 * Author: Claude Assistant
 *
 * This utility consolidates duplicate panel toggle code that was previously
 * scattered across BlogPost.astro and Series.astro layouts (~236 lines reduced
 * to this single 70-line module).
 *
 * Features:
 * - Configuration-based initialization
 * - Responsive breakpoint support (md/lg)
 * - Type-safe with TypeScript interfaces
 * - Handles desktop and mobile toggle buttons
 * - Optional close button support
 *
 * Usage:
 * ```typescript
 * import { initializePanelToggle } from '@/utils/panelToggle';
 *
 * initializePanelToggle({
 *   panelId: 'toc-panel',
 *   toggleButtonId: 'toggle-toc',
 *   mobileToggleButtonId: 'toggle-toc-mobile',
 *   closeButtonId: 'close-toc',
 *   breakpoint: 'md',
 *   visibleClass: 'md:block'
 * });
 * ```
 */

export interface PanelToggleConfig {
	panelId: string;
	toggleButtonId?: string;
	mobileToggleButtonId?: string;
	closeButtonId?: string;
	breakpoint: "md" | "lg";
	visibleClass: "md:block" | "lg:block";
}

export function initializePanelToggle(config: PanelToggleConfig): void {
	const panel = document.getElementById(config.panelId);

	// Panel is optional at runtime: layouts initialize several panels unconditionally and
	// only some of them render on a given page (e.g. the series panel only exists on posts
	// that belong to a series). Absence is legitimate, so no-op instead of throwing.
	if (!panel) {
		return;
	}

	// Get buttons if they exist
	const toggleBtn = config.toggleButtonId ? document.getElementById(config.toggleButtonId) : null;
	const mobileToggleBtn = config.mobileToggleButtonId
		? document.getElementById(config.mobileToggleButtonId)
		: null;
	const closeBtn = config.closeButtonId ? document.getElementById(config.closeButtonId) : null;

	// Breakpoint media query
	const breakpointSize = config.breakpoint === "md" ? "768px" : "1024px";

	// Check if panel is visible
	const isPanelVisible = (): boolean => {
		const isLargeScreen = window.matchMedia(`(min-width: ${breakpointSize})`).matches;
		return (
			(isLargeScreen && panel.classList.contains(config.visibleClass)) ||
			(!isLargeScreen && !panel.classList.contains("hidden"))
		);
	};

	// Hide panel
	const hidePanel = (): void => {
		panel.classList.add("hidden");
		panel.classList.remove("block", config.visibleClass);
	};

	// Show panel
	const showPanel = (): void => {
		panel.classList.remove("hidden");
		panel.classList.add("block", config.visibleClass);
	};

	// Toggle panel
	const togglePanel = (): void => {
		if (isPanelVisible()) {
			hidePanel();
		} else {
			showPanel();
		}
	};

	// Attach event listeners
	if (toggleBtn) {
		toggleBtn.addEventListener("click", togglePanel);
	}

	if (mobileToggleBtn) {
		mobileToggleBtn.addEventListener("click", togglePanel);
	}

	if (closeBtn) {
		closeBtn.addEventListener("click", hidePanel);
	}
}
