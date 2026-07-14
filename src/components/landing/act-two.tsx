// Act 2: Life — dashboard sprawl → one-HQ payoff (copy verbatim from
// issue-14 with the issue-17 swap), anchored by the WiringLanes loop.
import { ActAnchor } from "#/components/landing/act-anchor";

export function ActTwo() {
	return (
		<section className="lp-section">
			<h2 className="lp-h2">
				Every project you ship adds five more dashboards to check.
			</h2>
			<p className="lp-body">
				Traffic is in one tab, email delivery in another, payments in a third.
				That is one project. Ship a second and it all doubles. The setup
				eventually ends. The checking never does.
			</p>
			<p className="lp-payoff">
				<strong>Because Alfredo wired your stack, it can watch it.</strong>{" "}
				Traffic spikes, bounced emails, failed payments: every project, one HQ.
			</p>
			<ActAnchor
				src="/generated/wiring-lanes.mp4"
				poster="/generated/wiring-lanes-poster.jpg"
				reducedSrc="/generated/wiring-lanes-reduced-motion.jpg"
				label="Alfredo wiring loop: apps come and go, service lanes keep running"
			/>
		</section>
	);
}
