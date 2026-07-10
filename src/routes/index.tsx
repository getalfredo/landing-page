// PROTOTYPE (wayfinder #3, round 3): one committed visual language — "The
// Console", a modern precision control surface. D and F kept for comparison.
// Switch via `?variant=` (d/f/h). Throwaway.
import { createFileRoute } from "@tanstack/react-router";
import {
	PrototypeSwitcher,
	VARIANTS,
	type VariantKey,
} from "#/components/prototype/prototype-switcher";
import { VariantDAppliance } from "#/components/prototype/variant-d-appliance";
import { VariantFBigReadout } from "#/components/prototype/variant-f-big-readout";
import { VariantHConsole } from "#/components/prototype/variant-h-console";

export const Route = createFileRoute("/")({
	validateSearch: (
		search: Record<string, unknown>,
	): { variant: VariantKey } => {
		const v = search.variant;
		return {
			variant: typeof v === "string" && v in VARIANTS ? (v as VariantKey) : "h",
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
			<PrototypeSwitcher current={variant} />
		</>
	);
}
