// Minimal header per issue-8/14: wordmark top-left, SELF-HOSTED etch and a
// small "Join the waitlist" scroll button top-right. No nav.
import { Wordmark } from "#/components/landing/wordmark";
import { trackCtaClick } from "#/lib/analytics";

export function Header() {
	const scrollToForm = () => {
		trackCtaClick("header");
		document
			.getElementById("waitlist")
			?.scrollIntoView({ behavior: "smooth", block: "center" });
	};

	return (
		<header className="lp-header">
			<Wordmark />
			<span className="lp-header-right">
				<span className="lp-etch">SELF-HOSTED</span>
				<button
					type="button"
					className="lp-btn lp-btn-keycap lp-header-btn"
					onClick={scrollToForm}
				>
					Join the waitlist
				</button>
			</span>
		</header>
	);
}
