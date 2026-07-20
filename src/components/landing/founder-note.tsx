// Founder note per issue-8/14: short human aside, name + X handle. Copy
// verbatim from issue-14. The waypoint etch (issue-29) carries the section
// marker, so the old FROM THE FOUNDER etch heading is a visually hidden h2.
import { Waypoint } from "#/components/landing/waypoint";

export function FounderNote() {
	return (
		<section className="lp-section" id="wp-founder">
			<Waypoint index="05" label="FOUNDER" />
			<h2 className="lp-etch lp-visually-hidden">FROM THE FOUNDER</h2>
			<p className="lp-body">
				I've shipped a lot of side projects. Every one made me set up the same
				boilerplate before the fun part could start, and every one left me
				another set of dashboards to check. Alfredo is me refusing to do that
				ever again. It runs on my server and watches my projects, and I want it
				to do the same for yours.
			</p>
			<p className="lp-founder-sig">— Alper (@alperortac)</p>
		</section>
	);
}
