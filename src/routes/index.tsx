// The production Alfredo landing page on the issue-27 narrative-v2 spine:
// hero → Day one → showcase → Every day after → founder note → crescendo →
// FAQ → final CTA. Copy verbatim from issue-14 with the issue-17 HQ swap
// and the issue-27 refrain rework; section identity (waypoints, bands,
// minimap) per issue-29; palette arrives as CSS custom properties set
// inline from console-tokens (console-vars.ts).
import { createFileRoute } from "@tanstack/react-router";
import { Comparison } from "#/components/landing/comparison";
import { consoleCssVars } from "#/components/landing/console-vars";
import { Crescendo } from "#/components/landing/crescendo";
import { DayOne } from "#/components/landing/day-one";
import { EveryDayAfter } from "#/components/landing/every-day-after";
import { Faq } from "#/components/landing/faq";
import { FinalCta } from "#/components/landing/final-cta";
import { Footer } from "#/components/landing/footer";
import { FounderNote } from "#/components/landing/founder-note";
import { Gallery } from "#/components/landing/gallery";
import { Glossary } from "#/components/landing/glossary";
import { Header } from "#/components/landing/header";
import { Hero } from "#/components/landing/hero";
import { KeycapCoupling } from "#/components/landing/keycap-coupling";
import { Minimap } from "#/components/landing/minimap";
import { Showcase } from "#/components/landing/showcase";
// PROTOTYPE (wayfinder #42): ?sim=spectacle|pain swaps Every day after's
// anchor for the sim attract loop + fullscreen playable sim, dev builds
// only. Remove with src/components/prototype/sim-pass.tsx.
import {
	SimActTwo,
	SimSwitcher,
	useSimPass,
} from "#/components/prototype/sim-pass";
import { SITE_URL } from "#/routes/__root";
import "#/components/landing/landing.css";

export const Route = createFileRoute("/")({
	// Canonicals are per-route (wayfinder #58) — links accumulate across route
	// heads, so the root declares none and each page links its own.
	head: () => ({
		links: [
			{
				rel: "canonical",
				href: SITE_URL,
			},
		],
	}),
	component: LandingPage,
});

function LandingPage() {
	// PROTOTYPE (wayfinder #42): gamified sim variant state.
	const [sim, setSim] = useSimPass();
	return (
		<div className="lp" style={consoleCssVars}>
			<Header />
			<Minimap />
			<main>
				<Hero />
				<DayOne />
				<Showcase />
				{sim === null ? <EveryDayAfter /> : <SimActTwo variant={sim} />}
				{/* #74 (variant E): the comparison section sits between Every day
				    after and the founder note (#41 decision 3) — waypoint 04 KEEP,
				    everything after renumbers +1. */}
				<Comparison />
				<FounderNote />
				<Crescendo />
				<Faq />
				{/* #49 round 2: glossary sits BEFORE "Get in" (the final CTA),
				    not at the page tail — waypoint 08 TERMS, Get in → 09. */}
				<Glossary />
				<FinalCta />
			</main>
			<Footer />
			{/* #35 (variant C "Monitor wall"): a right-edge pull-tab opens a
			    full-screen wall of every set-piece; mounts outside <main>. */}
			<Gallery />
			{/* The sim prototype keeps its bar, hidden unless ?sim= is explicitly
			    in the URL (#42 sim → map #72). */}
			{sim !== null && <SimSwitcher current={sim} onChange={setSim} />}
			{/* #52 (variant c "Hold"): waitlist submit keycap mirrors Enter. */}
			<KeycapCoupling />
		</div>
	);
}
