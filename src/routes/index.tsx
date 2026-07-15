// The production Alfredo landing page: ten sections in the issue-8 order.
// Copy verbatim from issue-14 with the issue-17 HQ swap; palette arrives
// as CSS custom properties set inline from console-tokens (console-vars.ts).
import { createFileRoute } from "@tanstack/react-router";
import { ActOne } from "#/components/landing/act-one";
import { ActTwo } from "#/components/landing/act-two";
import { consoleCssVars } from "#/components/landing/console-vars";
import { Crescendo } from "#/components/landing/crescendo";
import { Faq } from "#/components/landing/faq";
import { FinalCta } from "#/components/landing/final-cta";
import { Footer } from "#/components/landing/footer";
import { FounderNote } from "#/components/landing/founder-note";
import { Header } from "#/components/landing/header";
import { Hero } from "#/components/landing/hero";
import { Showcase } from "#/components/landing/showcase";
// PROTOTYPE (wayfinder #30): ?cta=a|b|c swaps the CTA treatment, dev builds
// only. Remove with src/components/prototype/cta-pass.tsx.
import {
	CtaPassProvider,
	CtaSwitcher,
	useCtaArmed,
	useCtaPass,
} from "#/components/prototype/cta-pass";
import "#/components/landing/landing.css";

export const Route = createFileRoute("/")({
	component: LandingPage,
});

function LandingPage() {
	// PROTOTYPE (wayfinder #30): variant state + armed-header observer.
	const [cta, setCta] = useCtaPass();
	const armed = useCtaArmed(cta);
	return (
		<div
			className="lp"
			style={consoleCssVars}
			data-cta={cta ?? undefined}
			data-cta-armed={armed ? "" : undefined}
		>
			<CtaPassProvider value={cta}>
				<Header />
				<main>
					<Hero />
					<ActOne />
					<ActTwo />
					<Showcase />
					<FounderNote />
					<Crescendo />
					<FinalCta />
					<Faq />
				</main>
				<Footer />
			</CtaPassProvider>
			<CtaSwitcher current={cta} onChange={setCta} />
		</div>
	);
}
