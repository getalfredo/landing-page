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
import "#/components/landing/landing.css";

export const Route = createFileRoute("/")({
	component: LandingPage,
});

function LandingPage() {
	return (
		<div className="lp" style={consoleCssVars}>
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
		</div>
	);
}
