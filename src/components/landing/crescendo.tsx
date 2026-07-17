// Crescendo per issue-27: the reworked refrain plus the home line as a
// two-line couplet, inside the amber-warmed band (issue-29). The Lanes
// set-piece staging waits for rebuild wave 2 (issue-70): Lanes still
// anchors Every day after until the sim attract loop replaces it there.
import { Waypoint } from "#/components/landing/waypoint";

export function Crescendo() {
	return (
		<section className="lp-section lp-band lp-band-amber" id="wp-payoff">
			<Waypoint index="05" label="THE PAYOFF" amber />
			<h2 className="lp-h2">
				Every project runs on your servers and reports to one HQ.
			</h2>
			<p className="lp-payoff">
				Every project you'll ever ship already has a home.
			</p>
		</section>
	);
}
