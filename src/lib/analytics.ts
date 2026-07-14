// Typed wrappers for the exactly-four analytics events (wayfinder #5).
// No other posthog.capture call sites may exist anywhere in src/.
import posthog from "posthog-js";

let lastPathname: string | null = null;

// Manual $pageview with a last-pathname guard so the router's onResolved
// subscription plus the initial navigation can never double-fire for the
// same resolved location.
export function capturePageview(pathname: string) {
	if (typeof window === "undefined") return;
	if (pathname === lastPathname) return;
	lastPathname = pathname;
	posthog.capture("$pageview", { $current_url: window.location.href });
}

export function trackWaitlistSignup(source: string) {
	if (typeof window === "undefined") return;
	posthog.capture("waitlist_signup", { source });
}

export function trackWaitlistError() {
	if (typeof window === "undefined") return;
	posthog.capture("waitlist_error");
}

export function trackCtaClick(section: string) {
	if (typeof window === "undefined") return;
	posthog.capture("cta_click", { section });
}
