// Hero per issue-14 (+ issue-17 HQ swap): dual-promise H1 with the cycling
// product word (#16), sub, the interactive HQ demo (#12/20/22) and waitlist
// mount #1. The header's scroll button targets #waitlist.
import { CyclingWord } from "#/components/landing/cycling-word";
import { HeroDemo } from "#/components/landing/hero-demo";
import { WaitlistForm } from "#/components/landing/waitlist-form";
// PROTOTYPE (wayfinder #26): ?hv2=1 swaps the demo for the v2 combined
// screen, dev builds only. Remove with src/components/prototype/.
import { HeroDemoV2, useHeroV2 } from "#/components/prototype/hero-demo-v2";

export function Hero() {
	const [hv2, setHv2] = useHeroV2();
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
			{hv2 ? <HeroDemoV2 axes={hv2} onAxes={setHv2} /> : <HeroDemo />}
			<div className="lp-hero-cta" id="waitlist">
				<WaitlistForm source="hero" />
			</div>
		</section>
	);
}
