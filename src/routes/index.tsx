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
// PROTOTYPE (wayfinder #31): ?faq=a|b|c swaps the FAQ treatment, dev builds
// only. Remove with src/components/prototype/faq-pass.tsx.
import {
	FaqPass,
	FaqSwitcher,
	useFaqPass,
} from "#/components/prototype/faq-pass";
// PROTOTYPE (wayfinder #32): ?footer=a|b|c swaps the footer treatment, dev
// builds only. Remove with src/components/prototype/footer-pass.tsx.
import {
	FooterPass,
	FooterSwitcher,
	useFooterPass,
} from "#/components/prototype/footer-pass";
// PROTOTYPE (wayfinder #35): ?gallery=a|b|c swaps the gallery treatment, dev
// builds only. Remove with src/components/prototype/gallery-pass.tsx.
import {
	GalleryArchive,
	GalleryPass,
	GallerySwitcher,
	useGalleryPass,
} from "#/components/prototype/gallery-pass";
import "#/components/landing/landing.css";

export const Route = createFileRoute("/")({
	component: LandingPage,
});

function LandingPage() {
	// PROTOTYPE (wayfinder #30): variant state + armed-header observer.
	const [cta, setCta] = useCtaPass();
	const armed = useCtaArmed(cta);
	// PROTOTYPE (wayfinder #31): FAQ treatment variant state.
	const [faq, setFaq] = useFaqPass();
	// PROTOTYPE (wayfinder #32): footer treatment variant state.
	const [footer, setFooter] = useFooterPass();
	// PROTOTYPE (wayfinder #35): gallery treatment variant state.
	const [gallery, setGallery] = useGalleryPass();
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
					{gallery === "b" && <GalleryArchive />}
					<Crescendo />
					<FinalCta />
					{faq === null ? <Faq /> : <FaqPass variant={faq} />}
				</main>
				{footer === null ? <Footer /> : <FooterPass variant={footer} />}
			</CtaPassProvider>
			{(gallery === "a" || gallery === "c") && (
				<GalleryPass variant={gallery} />
			)}
			<CtaSwitcher current={cta} onChange={setCta} />
			<FaqSwitcher current={faq} onChange={setFaq} />
			<FooterSwitcher current={footer} onChange={setFooter} />
			<GallerySwitcher current={gallery} onChange={setGallery} />
		</div>
	);
}
