// Final CTA per issue-8/14: waitlist mount #2, same component, distinct
// source. The button click carries the funnel's cta_click (issue-5).
import { WaitlistForm } from "#/components/landing/waitlist-form";

export function FinalCta() {
	return (
		<section className="lp-section">
			<h2 className="lp-h2">Be there when Alfredo goes live.</h2>
			<div className="lp-hero-cta">
				<WaitlistForm source="final-cta" trackCta />
			</div>
		</section>
	);
}
