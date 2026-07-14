import { useEffect, useState } from "react";

// Shared by the H1 cycle (#16) and the act-anchor video mounts (#15): both
// swap to a static treatment when the visitor prefers reduced motion. The
// hero demo attract fill (#20) needs a one-shot imperative read instead (a
// mid-sequence flip would restart the attract theater), so it reads
// matchMedia directly rather than consuming this reactive hook.
export function usePrefersReducedMotion() {
	const [reduced, setReduced] = useState(false);
	useEffect(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		setReduced(mq.matches);
		const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
		mq.addEventListener("change", onChange);
		return () => mq.removeEventListener("change", onChange);
	}, []);
	return reduced;
}
