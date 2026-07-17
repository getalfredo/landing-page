// Day one (issue-27, formerly Act 1): setup tax → wired-once payoff (copy
// verbatim from issue-14), anchored by the WiringPatchBay loop (issue-15/18).
import { LoopAnchor } from "#/components/landing/loop-anchor";
import { Waypoint } from "#/components/landing/waypoint";

export function DayOne() {
	return (
		<section className="lp-section" id="wp-deploy">
			<Waypoint index="01" label="DEPLOY" />
			<h2 className="lp-h2">
				Every new project makes you set up the same boilerplate again.
			</h2>
			<p className="lp-body">
				You have an idea. The waitlist needs email, so you set that up. Sign-ups
				need auth, and auth needs a database. Analytics, because you want to
				know if anyone shows up. Secrets, because the keys have to live
				somewhere. You have built all of this before, and you will build it
				again. Or you rent it: five managed services, five bills, none of it
				yours.
			</p>
			<p className="lp-payoff">
				<strong>Alfredo wires all of it once, on your own server.</strong> Your
				next project is live in minutes.
			</p>
			<LoopAnchor
				src="/generated/wiring-patchbay.mp4"
				poster="/generated/wiring-patchbay-poster.jpg"
				reducedSrc="/generated/wiring-patchbay-reduced-motion.jpg"
				label="Alfredo wiring loop: services are wired at deploy, reused across projects"
			/>
		</section>
	);
}
