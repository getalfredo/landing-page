// Every day after (issue-27, formerly Act 2): dashboard sprawl → one-HQ
// payoff, reworked as the callback to the showcase directly above it.
// INTERIM (issue-70): the WiringLanes loop stays as this section's anchor
// until the sim attract loop that replaces it is built (issue-66/67); the
// crescendo's Lanes set-piece staging moves with it in rebuild wave 2.
import { LoopAnchor } from "#/components/landing/loop-anchor";
import { Waypoint } from "#/components/landing/waypoint";

export function EveryDayAfter() {
	return (
		<section className="lp-section" id="wp-operate">
			<Waypoint index="03" label="OPERATE" />
			<h2 className="lp-h2">
				Every project you ship adds five more dashboards to check.
			</h2>
			<p className="lp-body">
				Traffic is in one tab, email delivery in another, payments in a third.
				That is one project. Ship a second and it all doubles. The setup
				eventually ends. The checking never does.
			</p>
			<p className="lp-payoff">
				<strong>The fix is the HQ you just saw.</strong> Alfredo wired your
				stack, so Alfredo watches it.
			</p>
			<LoopAnchor
				src="/generated/wiring-lanes.mp4"
				poster="/generated/wiring-lanes-poster.jpg"
				reducedSrc="/generated/wiring-lanes-reduced-motion.jpg"
				label="Alfredo wiring loop: apps come and go, service lanes keep running"
			/>
		</section>
	);
}
