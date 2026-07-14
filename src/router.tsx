import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { capturePageview } from "./lib/analytics";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
	const router = createTanStackRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
	});

	if (typeof window !== "undefined") {
		router.subscribe("onResolved", () => {
			capturePageview(window.location.pathname);
		});
	}

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
