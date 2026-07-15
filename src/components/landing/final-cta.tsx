// Final CTA per issue-8/14: waitlist mount #2, same component, distinct
// source. The button click carries the funnel's cta_click (issue-5).
import { WaitlistForm } from "#/components/landing/waitlist-form";
// PROTOTYPE (wayfinder #30): per-variant staging etches, dev builds only.
// Remove with src/components/prototype/cta-pass.tsx.
import { CtaFinalStage } from "#/components/prototype/cta-pass";

export function FinalCta() {
	return (
		<section className="lp-section lp-final">
			<CtaFinalStage slot="above" />
			<h2 className="lp-h2">Be there when Alfredo goes live.</h2>
			<CtaFinalStage slot="below" />
			<div className="lp-hero-cta">
				<WaitlistForm source="final-cta" trackCta />
			</div>
		</section>
	);
}
