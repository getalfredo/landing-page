// The production Alfredo landing page on the issue-27 narrative-v2 spine:
// hero → Day one → showcase → Every day after → founder note → crescendo →
// FAQ → final CTA. Copy verbatim from issue-14 with the issue-17 HQ swap
// and the issue-27 refrain rework; section identity (waypoints, bands,
// minimap) per issue-29; palette arrives as CSS custom properties set
// inline from console-tokens (console-vars.ts).
import { createFileRoute } from "@tanstack/react-router";
import { consoleCssVars } from "#/components/landing/console-vars";
import { Crescendo } from "#/components/landing/crescendo";
import { DayOne } from "#/components/landing/day-one";
import { EveryDayAfter } from "#/components/landing/every-day-after";
import { Faq } from "#/components/landing/faq";
import { FinalCta } from "#/components/landing/final-cta";
import { Footer } from "#/components/landing/footer";
import { FounderNote } from "#/components/landing/founder-note";
import { Header } from "#/components/landing/header";
import { Hero } from "#/components/landing/hero";
import { Minimap } from "#/components/landing/minimap";
import { Showcase } from "#/components/landing/showcase";
// PROTOTYPE (wayfinder #35): ?gallery=a|b|c swaps the gallery treatment, dev
// builds only. Remove with src/components/prototype/gallery-pass.tsx.
import {
	GalleryArchive,
	GalleryPass,
	GallerySwitcher,
	useGalleryPass,
} from "#/components/prototype/gallery-pass";
// PROTOTYPE (wayfinder #42): ?sim=spectacle|pain swaps Every day after's
// anchor for the sim attract loop + fullscreen playable sim, dev builds
// only. Remove with src/components/prototype/sim-pass.tsx.
import {
	SimActTwo,
	SimSwitcher,
	useSimPass,
} from "#/components/prototype/sim-pass";
import "#/components/landing/landing.css";

export const Route = createFileRoute("/")({
	component: LandingPage,
});

function LandingPage() {
	// PROTOTYPE (wayfinder #35): gallery treatment variant state.
	const [gallery, setGallery] = useGalleryPass();
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
				<FounderNote />
				{gallery === "b" && <GalleryArchive />}
				<Crescendo />
				<Faq />
				<FinalCta />
			</main>
			<Footer />
			{(gallery === "a" || gallery === "c") && (
				<GalleryPass variant={gallery} />
			)}
			{/* Decided passes (#35/#42) keep their prototypes but hide their bars
			    unless the variant param is explicitly in the URL — the page stays
			    inspectable while newer tickets prototype on it. */}
			{gallery !== null && (
				<GallerySwitcher current={gallery} onChange={setGallery} />
			)}
			{sim !== null && <SimSwitcher current={sim} onChange={setSim} />}
		</div>
	);
}
