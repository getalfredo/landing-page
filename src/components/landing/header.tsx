// Sticky glass header per issue-30: wordmark top-left, SELF-HOSTED etch and
// a "Join the waitlist" scroll button top-right, no nav. The button stays
// calm bone until the hero waitlist form scrolls past the top of the
// viewport, then arms amber — one hot key always in reach without competing
// with the hero demo while it is on screen.
import { useEffect, useState } from "react";
import { Wordmark } from "#/components/landing/wordmark";
import { trackCtaClick } from "#/lib/analytics";

function useArmed(): boolean {
	const [armed, setArmed] = useState(false);

	// A scroll check instead of an IntersectionObserver: observers attached
	// during streamed-SSR hydration never receive crossing notifications in
	// Chromium, so the armed flip silently dies. Scroll events are immune.
	useEffect(() => {
		let raf = 0;
		const check = () => {
			raf = 0;
			const el = document.getElementById("waitlist");
			if (!el) return;
			setArmed(el.getBoundingClientRect().bottom < 0);
		};
		const onScroll = () => {
			if (!raf) raf = requestAnimationFrame(check);
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		check();
		return () => {
			window.removeEventListener("scroll", onScroll);
			if (raf) cancelAnimationFrame(raf);
		};
	}, []);

	return armed;
}

export function Header() {
	const armed = useArmed();
	const scrollToForm = () => {
		trackCtaClick("header");
		document
			.getElementById("waitlist")
			?.scrollIntoView({ behavior: "smooth", block: "center" });
	};

	return (
		<header className={armed ? "lp-header lp-header-armed" : "lp-header"}>
			<Wordmark />
			<span className="lp-header-right">
				<span className="lp-etch">SELF-HOSTED</span>
				<button
					type="button"
					className={`lp-btn ${armed ? "lp-btn-armed" : "lp-btn-keycap"} lp-header-btn`}
					onClick={scrollToForm}
				>
					Join the waitlist
				</button>
			</span>
		</header>
	);
}
