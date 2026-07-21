// Hero per issue-14 (+ issue-17 HQ swap): dual-promise H1 with the cycling
// product word (#16), sub, the ambient HQ demo (#26/#46/#47 fold-in, #71),
// the #68 contrast etch and waitlist mount #1. The header's scroll button
// targets #waitlist.
import { CyclingWord } from "#/components/landing/cycling-word";
import { HeroDemo } from "#/components/landing/hero-demo";
import { WaitlistForm } from "#/components/landing/waitlist-form";

export function Hero() {
	return (
		<section className="lp-hero" id="wp-hero">
			<h1 className="lp-h1">
				Ship your next <CyclingWord /> in minutes.
				<br />
				Watch them all from <span className="lp-green">one HQ.</span>
			</h1>
			<p className="lp-sub">
				Alfredo is the home for your projects. Your next one is live in minutes,
				with auth, email, database and analytics already wired. And every
				project you add is watched from one place.
			</p>
			<HeroDemo />
			{/* #68: the sprawl contrast as an inert caption scoring the demo,
			    page-level typography outside the bezel */}
			<p className="lp-etch lp-hero-tabs">
				<s>COUNTLESS TABS</s> <span aria-hidden="true">→</span>{" "}
				<span className="lp-green">ONE HQ</span>
			</p>
			<div className="lp-hero-cta" id="waitlist">
				<WaitlistForm source="hero" />
			</div>
		</section>
	);
}
