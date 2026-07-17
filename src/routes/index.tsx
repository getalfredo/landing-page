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
// PROTOTYPE (wayfinder #49): ?glossary=a|b|c mounts a glossary treatment at
// the page tail (before the footer), dev builds only. Remove with
// src/components/prototype/glossary-pass.tsx.
import {
	GlossaryPass,
	GlossarySwitcher,
	useGlossaryPass,
} from "#/components/prototype/glossary-pass";
// PROTOTYPE (wayfinder #50): ?live=a|b|c puts one piece of real telemetry
// on the page as a LIVE etch (footer colophon line / crescendo proof line /
// live meter strip), dev builds only. Remove with
// src/components/prototype/live-pass.tsx and src/routes/api/live.ts.
import {
	LiveCrescendo,
	LiveFooter,
	LiveMeterFooter,
	LiveSwitcher,
	useLivePass,
} from "#/components/prototype/live-pass";
// PROTOTYPE (wayfinder #42): ?sim=spectacle|pain swaps Every day after's
// anchor for the sim attract loop + fullscreen playable sim, dev builds
// only. Remove with src/components/prototype/sim-pass.tsx.
import {
	SimActTwo,
	SimSwitcher,
	useSimPass,
} from "#/components/prototype/sim-pass";
// PROTOTYPE (wayfinder #51): ?topo=a|b|c places the etched mono topology
// diagram (Day one coda / FAQ answer / standalone interlude), dev builds
// only. Remove with src/components/prototype/topo-pass.tsx.
import {
	TopoDayOne,
	TopoFaq,
	TopoInterlude,
	TopoSwitcher,
	useTopoPass,
} from "#/components/prototype/topo-pass";
import "#/components/landing/landing.css";

export const Route = createFileRoute("/")({
	component: LandingPage,
});

function LandingPage() {
	// PROTOTYPE (wayfinder #35): gallery treatment variant state.
	const [gallery, setGallery] = useGalleryPass();
	// PROTOTYPE (wayfinder #42): gamified sim variant state.
	const [sim, setSim] = useSimPass();
	// PROTOTYPE (wayfinder #49): glossary treatment variant state.
	const [glossary, setGlossary] = useGlossaryPass();
	// PROTOTYPE (wayfinder #50): LIVE etch variant state.
	const [live, setLive] = useLivePass();
	// PROTOTYPE (wayfinder #51): topology diagram variant state.
	const [topo, setTopo] = useTopoPass();
	return (
		<div className="lp" style={consoleCssVars}>
			<Header />
			<Minimap />
			<main>
				<Hero />
				{/* #51: variant a closes Day one with the diagram; variant c mounts
				    the interlude band between Day one and the showcase. */}
				{topo === "a" ? <TopoDayOne /> : <DayOne />}
				{topo === "c" && <TopoInterlude />}
				<Showcase />
				{sim === null ? <EveryDayAfter /> : <SimActTwo variant={sim} />}
				<FounderNote />
				{gallery === "b" && <GalleryArchive />}
				{/* #50: variant b swaps the crescendo for the refrain-proof copy. */}
				{live === "b" ? <LiveCrescendo /> : <Crescendo />}
				{/* #51: variant b puts the diagram inside "Where does it run?". */}
				{topo === "b" ? <TopoFaq /> : <Faq />}
				{/* #49 round 2: glossary sits BEFORE "Get in" (the final CTA),
				    not at the page tail. */}
				{glossary !== null && <GlossaryPass variant={glossary} />}
				<FinalCta />
			</main>
			{/* #50: variant c (winner) swaps the footer for the meter-below-the-
			    wordmark copy; variant a swaps in the colophon-line copy. */}
			{live === "c" ? (
				<LiveMeterFooter />
			) : live === "a" ? (
				<LiveFooter />
			) : (
				<Footer />
			)}
			{(gallery === "a" || gallery === "c") && (
				<GalleryPass variant={gallery} />
			)}
			{/* Decided passes (#35/#42/#49/#50) keep their prototypes but hide
			    their bars unless the variant param is explicitly in the URL — the
			    page stays inspectable while newer tickets prototype on it. */}
			{gallery !== null && (
				<GallerySwitcher current={gallery} onChange={setGallery} />
			)}
			{sim !== null && <SimSwitcher current={sim} onChange={setSim} />}
			{glossary !== null && (
				<GlossarySwitcher current={glossary} onChange={setGlossary} />
			)}
			{live !== null && <LiveSwitcher current={live} onChange={setLive} />}
			{/* Topology (#51) is the live prototype: its bar shows by default so
			    the variants are discoverable; [ ] flips between them. */}
			<TopoSwitcher current={topo} onChange={setTopo} />
		</div>
	);
}
