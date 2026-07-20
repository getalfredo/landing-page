// Final CTA per issue-8/14 as the page-closer below the FAQ (issue-27),
// staged per issue-30: a blinking status etch above the H2. Waitlist mount
// #2, same component, distinct source; the button click carries the
// funnel's cta_click (issue-5).
import { WaitlistForm } from "#/components/landing/waitlist-form";
import { Waypoint } from "#/components/landing/waypoint";

export function FinalCta() {
	return (
		<section className="lp-section lp-final" id="wp-get-in">
			<Waypoint index="08" label="GET IN" />
			<p className="lp-cta-status">
				<span className="lp-cta-status-led" />
				<span className="lp-etch">WAITLIST · OPEN</span>
			</p>
			<h2 className="lp-h2">Be there when Alfredo goes live.</h2>
			<div className="lp-hero-cta">
				<WaitlistForm source="final-cta" trackCta />
			</div>
		</section>
	);
}
