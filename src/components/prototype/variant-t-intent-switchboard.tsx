// PROTOTYPE variant T — intent switchboard (wayfinder #19, throwaway).
// The maximal regroup: the rail is FOUR intent keycaps (Health, Activity,
// Money, Mail); each stage view is one composite panel merging its
// services' content, providers named only as etches inside. The seven
// service views die; per-service detail lives inline as panel sections.
import { useEffect, useState } from "react";
import {
	INTENT_ITEMS,
	INTENT_PANELS,
	type IntentKey,
	IntentShell,
	ROTATE_MS,
} from "#/components/prototype/showcase-intents";

export function VariantTIntentSwitchboard() {
	const [sel, setSel] = useState<{ key: IntentKey; n: number }>({
		key: "health",
		n: 0,
	});
	const active = INTENT_ITEMS.find((i) => i.key === sel.key);
	const Panel = INTENT_PANELS[sel.key];

	useEffect(() => {
		const idx = INTENT_ITEMS.findIndex((i) => i.key === sel.key);
		const t = setTimeout(() => {
			setSel((prev) => ({
				key: INTENT_ITEMS[(idx + 1) % INTENT_ITEMS.length].key,
				n: prev.n + 1,
			}));
		}, ROTATE_MS);
		return () => clearTimeout(t);
	}, [sel]);

	return (
		<IntentShell
			etch={active?.etch ?? ""}
			caption={active?.line ?? ""}
			rail={
				<>
					{INTENT_ITEMS.map((item) => {
						const on = sel.key === item.key;
						return (
							<button
								type="button"
								role="tab"
								aria-selected={on}
								className={`wsi-key${on ? " wsi-key-on" : ""}`}
								key={item.key}
								onClick={() =>
									setSel((prev) => ({ key: item.key, n: prev.n + 1 }))
								}
							>
								<span
									className={`wsi-key-led${on ? " wsi-key-led-on" : ""}`}
									aria-hidden="true"
								/>
								<span className="wsi-key-name">{item.name}</span>
								<span className="wsi-key-services">{item.services}</span>
								{on && (
									<span className="wsi-key-track" aria-hidden="true">
										<span
											className="wsi-key-fill"
											key={`${sel.key}-${sel.n}`}
										/>
									</span>
								)}
							</button>
						);
					})}
				</>
			}
		>
			<div className="wsi-view" key={sel.key}>
				<Panel />
			</div>
		</IntentShell>
	);
}
