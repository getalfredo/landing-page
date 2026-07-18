// The production Alfredo landing page on the issue-27 narrative-v2 spine:
// hero → Day one → showcase → Every day after → founder note → crescendo →
// FAQ → final CTA. Copy verbatim from issue-14 with the issue-17 HQ swap
// and the issue-27 refrain rework; section identity (waypoints, bands,
// minimap) per issue-29; palette arrives as CSS custom properties set
// inline from console-tokens (console-vars.ts).
import { createFileRoute } from "@tanstack/react-router";
import { consoleCssVars } from "#/components/landing/console-vars";
import { SITE_URL } from "#/routes/__root";
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
// PROTOTYPE (wayfinder #52): ?keys=a|b|c couples the physical keyboard to
// the page's keycaps (Enter in the waitlist input depresses the submit cap;
// optionally Enter presses the demo's hot key), dev builds only. Remove
// with src/components/prototype/keys-pass.tsx.
import {
	KeysCoupler,
	KeysSwitcher,
	useKeysPass,
} from "#/components/prototype/keys-pass";
// PROTOTYPE (wayfinder #54): ?ledger=a|b|c mounts the setup-tax ledger
// strip inside Day one (two-column ledger / stamped receipt / flip strip),
// dev builds only. Remove with src/components/prototype/ledger-pass.tsx.
import {
	LedgerDayOne,
	LedgerSwitcher,
	useLedgerPass,
} from "#/components/prototype/ledger-pass";
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
	// PROTOTYPE (wayfinder #35): gallery treatment variant state.
	const [gallery, setGallery] = useGalleryPass();
	// PROTOTYPE (wayfinder #42): gamified sim variant state.
	const [sim, setSim] = useSimPass();
	// PROTOTYPE (wayfinder #49): glossary treatment variant state.
	const [glossary, setGlossary] = useGlossaryPass();
	// PROTOTYPE (wayfinder #50): LIVE etch variant state.
	const [live, setLive] = useLivePass();
	// PROTOTYPE (wayfinder #54): setup-tax ledger variant state.
	const [ledger, setLedger] = useLedgerPass();
	// PROTOTYPE (wayfinder #52): keyboard-coupled keycaps variant state.
	const keys = useKeysPass();
	return (
		<div className="lp" style={consoleCssVars}>
			<Header />
			<Minimap />
			<main>
				<Hero />
				{ledger === null ? <DayOne /> : <LedgerDayOne variant={ledger} />}
				<Showcase />
				{sim === null ? <EveryDayAfter /> : <SimActTwo variant={sim} />}
				<FounderNote />
				{gallery === "b" && <GalleryArchive />}
				{/* #50: variant b swaps the crescendo for the refrain-proof copy. */}
				{live === "b" ? <LiveCrescendo /> : <Crescendo />}
				<Faq />
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
			{/* #54 decided (flip strip c won): bar hides unless ?ledger= is in
			    the URL, like the other decided passes. */}
			{ledger !== null && (
				<LedgerSwitcher current={ledger} onChange={setLedger} />
			)}
			<KeysCoupler variant={keys.variant} demo={keys.demo} />
			{keys.variant !== null && (
				<KeysSwitcher
					current={keys.variant}
					onChange={keys.setVariant}
					demo={keys.demo}
					onDemoChange={keys.setDemo}
				/>
			)}
		</div>
	);
}
