// Footer per issue-8/14: wordmark + privacy link only, microprint as the
// last line of the page.
import { Wordmark } from "#/components/landing/wordmark";

export function Footer() {
	return (
		<footer className="lp-footer">
			<Wordmark />
			<a className="lp-link" href="/privacy">
				Privacy
			</a>
			<span className="lp-etch lp-microprint">
				ALFREDO · THE HOME FOR YOUR PROJECTS · SELF-HOSTED, YOURS FOREVER
			</span>
		</footer>
	);
}
