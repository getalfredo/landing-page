// Crescendo per issue-27: the reworked refrain plus the home line as a
// two-line couplet, inside the amber-warmed band (issue-29). The WiringLanes
// loop is staged here as the crescendo set-piece (issue-27 moved Lanes from
// Act 2 to the crescendo). Lanes also stays Every day after's interim anchor
// until the sim attract loop that replaces it there ships on its own map
// (issue-72); the anchor swap happens there, not here.
import { LoopAnchor } from "#/components/landing/loop-anchor";
import { Waypoint } from "#/components/landing/waypoint";

export function Crescendo() {
	return (
		<section className="lp-section lp-band lp-band-amber" id="wp-payoff">
			<Waypoint index="06" label="THE PAYOFF" />
			<h2 className="lp-h2">
				Every project runs on your servers and reports to one HQ.
			</h2>
			<p className="lp-payoff">
				Every project you'll ever ship already has a home.
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
