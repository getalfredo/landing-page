// PROTOTYPE (wayfinder #11, identity v2): iterate "The Console" toward
// final under the dual positioning. New round I/J/K tests how the
// operations story surfaces (fleet board in the chassis / one big glass
// display / physical rack units) plus the material and literalism axes.
// D/F/H kept for comparison. Switch via `?variant=` (d/f/h/i/j/k). Throwaway.
import { createFileRoute } from "@tanstack/react-router";
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

export const Route = createFileRoute("/")({
	validateSearch: (
		search: Record<string, unknown>,
	): { variant: VariantKey } => {
		const v = search.variant;
		return {
			variant: typeof v === "string" && v in VARIANTS ? (v as VariantKey) : "m",
		};
	},
	component: Home,
});

function Home() {
	const { variant } = Route.useSearch();

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
			<PrototypeSwitcher current={variant} />
		</>
	);
}
