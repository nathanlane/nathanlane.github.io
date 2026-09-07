/**
 * Show/hide behavior for a reading panel (TOC, series navigation) shared by the blog post
 * and series layouts. Owns visibility, ARIA state, and the responsive default for one panel:
 * open at/above `breakpointPx`, closed below it, resetting to that default whenever the
 * viewport crosses the breakpoint. No other stylesheet rule should override the panel's
 * display once this module is wired up to it.
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
 *   breakpointPx: 768,
 *   visibleClass: 'md:block'
 * });
 * ```
 */

export interface PanelToggleConfig {
	panelId: string;
	toggleButtonId?: string;
	mobileToggleButtonId?: string;
	closeButtonId?: string;
	// The width, in CSS pixels, at and above which the panel defaults to open. Must match the
	// media query encoded in `visibleClass` (e.g. 1281 for "min-[1281px]:block") — this module
	// is the sole owner of panel visibility, so no other stylesheet rule may hide or show the
	// panel at a different width.
	breakpointPx: number;
	visibleClass: string;
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

	const breakpointQuery = window.matchMedia(`(min-width: ${config.breakpointPx}px)`);

	// Check if panel is visible
	const isPanelVisible = (): boolean => {
		const isLargeScreen = breakpointQuery.matches;
		return (
			(isLargeScreen && panel.classList.contains(config.visibleClass)) ||
			(!isLargeScreen && !panel.classList.contains("hidden"))
		);
	};

	// Keep assistive technology in step with the visual state: a panel that is visually
	// hidden must not expose its links to screen readers or the tab order, and the toggle
	// buttons must report whether the panel they control is currently open.
	const syncAria = (visible: boolean): void => {
		panel.setAttribute("aria-hidden", String(!visible));
		for (const btn of [toggleBtn, mobileToggleBtn]) {
			btn?.setAttribute("aria-expanded", String(visible));
		}
	};

	// Hide panel
	const hidePanel = (): void => {
		panel.classList.add("hidden");
		panel.classList.remove("block", config.visibleClass);
		syncAria(false);
	};

	// Show panel
	const showPanel = (): void => {
		panel.classList.remove("hidden");
		panel.classList.add("block", config.visibleClass);
		syncAria(true);
	};

	// Toggle panel
	const togglePanel = (): void => {
		if (isPanelVisible()) {
			hidePanel();
		} else {
			showPanel();
		}
	};

	// A closed panel must hand focus back to whichever opener is actually on screen: the
	// mobile and desktop openers occupy complementary widths, so only one is ever reachable.
	const focusVisibleOpener = (): void => {
		for (const btn of [toggleBtn, mobileToggleBtn]) {
			if (btn instanceof HTMLElement && btn.offsetParent !== null) {
				btn.focus();
				return;
			}
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
		closeBtn.addEventListener("click", () => {
			hidePanel();
			focusVisibleOpener();
		});
	}

	// Publish the initial state, which is already class-driven and responsive in markup.
	syncAria(isPanelVisible());

	// Crossing the breakpoint moves the panel into a new responsive range, so any user toggle
	// from the old range no longer applies: reset to that range's own default (open at/above
	// the breakpoint, closed below it) rather than carrying the prior state forward.
	breakpointQuery.addEventListener("change", () => {
		if (breakpointQuery.matches) {
			showPanel();
		} else {
			hidePanel();
		}
	});
}
