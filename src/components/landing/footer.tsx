// Footer per issue-32 (approved variant A "Nameplate"): one oversized
// left-aligned wordmark with a breathing LED dot closes the page over a
// hairline row — microprint left, etched links right. GitHub points at the
// org page until the code has a public home elsewhere.
export function Footer() {
	return (
		<footer className="lp-nameplate">
			<p className="lp-nameplate-mark">
				Alfredo
				<span className="lp-nameplate-led" aria-hidden="true" />
			</p>
			<div className="lp-nameplate-row">
				<span className="lp-etch lp-microprint">
					THE HOME FOR YOUR PROJECTS · SELF-HOSTED, YOURS FOREVER
				</span>
				<nav className="lp-nameplate-links" aria-label="Footer">
					<a className="lp-etch lp-etch-link" href="https://x.com/alperortac">
						X · @ALPERORTAC
					</a>
					<a
						className="lp-etch lp-etch-link"
						href="https://github.com/getalfredo"
					>
						GITHUB
					</a>
					<a className="lp-etch lp-etch-link" href="/privacy">
						PRIVACY
					</a>
				</nav>
			</div>
		</footer>
	);
}
