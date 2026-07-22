import { PostHogProvider as BasePostHogProvider } from "@posthog/react";
import posthog from "posthog-js";
import { type ReactNode, useEffect } from "react";
import { capturePageview } from "../../lib/analytics";

// Placeholder keys (phc_xxx) must not init: bogus keys spam the console in
// dev and would silently drop every event if they ever reached prod.
if (
	typeof window !== "undefined" &&
	import.meta.env.VITE_POSTHOG_KEY &&
	import.meta.env.VITE_POSTHOG_KEY !== "phc_xxx"
) {
	posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
		api_host: import.meta.env.VITE_POSTHOG_HOST || "https://a.aistack.to",
		person_profiles: "identified_only",
		persistence: "memory",
		autocapture: false,
		capture_pageview: false,
		disable_session_recording: false,
		defaults: "2026-05-30",
	});
}

interface PostHogProviderProps {
	children: ReactNode;
}

export default function PostHogProvider({ children }: PostHogProviderProps) {
	// The router's onResolved subscription is suppressed on the SSR-hydrated
	// first load, so capture the initial $pageview here on mount (wayfinder #5).
	useEffect(() => {
		capturePageview(window.location.pathname);
	}, []);

	return <BasePostHogProvider client={posthog}>{children}</BasePostHogProvider>;
}
