// PROTOTYPE (wayfinder #11 identity v2, extended for #12, #13 and #19):
// iterate "The Console" toward final. N is the click-driven hero demo.
// O/P/Q/R/S are the #13 showcase round; T/U/V are the #19 intent-grouping
// round (same taxonomy, three answers to where per-service detail lives).
// Switch via `?variant=`. Throwaway.
import { createFileRoute } from "@tanstack/react-router";
import {
	H1_MODES,
	H1CyclePicker,
	type H1Mode,
	type H1Run,
} from "#/components/prototype/h1-cycle";
import {
	PrototypeSwitcher,
	VARIANTS,
	type VariantKey,
} from "#/components/prototype/prototype-switcher";
import { VariantDAppliance } from "#/components/prototype/variant-d-appliance";
import { VariantFBigReadout } from "#/components/prototype/variant-f-big-readout";
import { VariantHConsole } from "#/components/prototype/variant-h-console";
import { VariantIFleetPanel } from "#/components/prototype/variant-i-fleet-panel";
import { VariantJDarkOps } from "#/components/prototype/variant-j-dark-ops";
import { VariantKRack } from "#/components/prototype/variant-k-rack";
import { VariantLOpsDeck } from "#/components/prototype/variant-l-ops-deck";
import { VariantMWebConsole } from "#/components/prototype/variant-m-web-console";
import {
	FILL_MODES,
	type FillMode,
	FillModePicker,
	VariantNHeroDemo,
} from "#/components/prototype/variant-n-hero-demo";
import { VariantOShowcaseWall } from "#/components/prototype/variant-o-showcase-wall";
import { VariantPShowcaseGlass } from "#/components/prototype/variant-p-showcase-glass";
import { VariantQShowcaseLedger } from "#/components/prototype/variant-q-showcase-ledger";
import { VariantRShowcaseRail } from "#/components/prototype/variant-r-showcase-rail";
import { VariantSShowcaseSwitchboard } from "#/components/prototype/variant-s-showcase-switchboard";
import { VariantTIntentSwitchboard } from "#/components/prototype/variant-t-intent-switchboard";
import { VariantUIntentSections } from "#/components/prototype/variant-u-intent-sections";
import { VariantVIntentDrill } from "#/components/prototype/variant-v-intent-drill";
import { VariantWOgFrames } from "#/components/prototype/variant-w-og-frames";

export const Route = createFileRoute("/")({
	validateSearch: (
		search: Record<string, unknown>,
	): { variant: VariantKey; h1: H1Mode; h1run: H1Run; fill: FillMode } => {
		const v = search.variant;
		const m = search.h1;
		const f = search.fill;
		return {
			variant: typeof v === "string" && v in VARIANTS ? (v as VariantKey) : "n",
			h1: typeof m === "string" && m in H1_MODES ? (m as H1Mode) : "flip",
			h1run: search.h1run === "settle" ? "settle" : "loop",
			fill:
				typeof f === "string" && f in FILL_MODES ? (f as FillMode) : "attract",
		};
	},
	component: Home,
});

function Home() {
	const { variant, h1, h1run, fill } = Route.useSearch();

	return (
		<>
			{variant === "d" && <VariantDAppliance />}
			{variant === "f" && <VariantFBigReadout />}
			{variant === "h" && <VariantHConsole />}
			{variant === "i" && <VariantIFleetPanel />}
			{variant === "j" && <VariantJDarkOps />}
			{variant === "k" && <VariantKRack />}
			{variant === "l" && <VariantLOpsDeck />}
			{variant === "m" && <VariantMWebConsole />}
			{variant === "n" && (
				<VariantNHeroDemo key={fill} h1Mode={h1} h1Run={h1run} fill={fill} />
			)}
			{variant === "o" && <VariantOShowcaseWall />}
			{variant === "p" && <VariantPShowcaseGlass />}
			{variant === "q" && <VariantQShowcaseLedger />}
			{variant === "r" && <VariantRShowcaseRail />}
			{variant === "s" && <VariantSShowcaseSwitchboard />}
			{variant === "t" && <VariantTIntentSwitchboard />}
			{variant === "u" && <VariantUIntentSections />}
			{variant === "v" && <VariantVIntentDrill />}
			{variant === "w" && <VariantWOgFrames />}
			{variant === "n" && <H1CyclePicker mode={h1} run={h1run} />}
			{variant === "n" && <FillModePicker fill={fill} />}
			<PrototypeSwitcher current={variant} />
		</>
	);
}
