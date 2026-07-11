// PROTOTYPE variant V — intent drill (wayfinder #19, throwaway).
// The two-level answer: the rail is FOUR intent keycaps, and per-service
// detail lives ONE LEVEL DOWN — a row of provider sub-caps inside the
// stage drills into the existing full service views. Auto-rotate walks
// intents; entering an intent lands on its first provider.
// KNOWN STALENESS: the drilled-into service panels still render pre-#14
// brands inside (PostHog/Gmail/Stripe) — truth-list swap on panel guts is
// build/#20 work; caps and sub-caps below already carry the truth-list.
import { useEffect, useState } from "react";
import {
	INTENT_ITEMS,
	type IntentKey,
	IntentShell,
	ROTATE_MS,
} from "#/components/prototype/showcase-intents";
import {
	SHOWCASE_PANELS,
	type ShowcaseKey,
} from "#/components/prototype/showcase-panels";

const DRILL: Record<IntentKey, { key: ShowcaseKey; label: string }[]> = {
	health: [
		{ key: "uptime", label: "UPTIME KUMA" },
		{ key: "errors", label: "SENTRY" },
	],
	activity: [
		{ key: "traffic", label: "UMAMI" },
		{ key: "auth", label: "BETTER-AUTH" },
		{ key: "github", label: "GITHUB" },
	],
	money: [{ key: "pay", label: "CREEM" }],
	mail: [{ key: "mail", label: "POSTMARK" }],
};

export function VariantVIntentDrill() {
	const [sel, setSel] = useState<{
		intent: IntentKey;
		sub: ShowcaseKey;
		n: number;
	}>({ intent: "health", sub: "uptime", n: 0 });
	const active = INTENT_ITEMS.find((i) => i.key === sel.intent);
	const subs = DRILL[sel.intent];
	const Panel = SHOWCASE_PANELS[sel.sub];

	useEffect(() => {
		const idx = INTENT_ITEMS.findIndex((i) => i.key === sel.intent);
		const t = setTimeout(() => {
			const next = INTENT_ITEMS[(idx + 1) % INTENT_ITEMS.length].key;
			setSel((prev) => ({
				intent: next,
				sub: DRILL[next][0].key,
				n: prev.n + 1,
			}));
		}, ROTATE_MS);
		return () => clearTimeout(t);
	}, [sel]);

	const pickIntent = (intent: IntentKey) => {
		setSel((prev) => ({ intent, sub: DRILL[intent][0].key, n: prev.n + 1 }));
	};

	return (
		<IntentShell
			etch={`${active?.etch} / ${subs.find((s) => s.key === sel.sub)?.label}`}
			caption={active?.line ?? ""}
			rail={
				<>
					{INTENT_ITEMS.map((item) => {
						const on = sel.intent === item.key;
						return (
							<button
								type="button"
								role="tab"
								aria-selected={on}
								className={`wsi-key${on ? " wsi-key-on" : ""}`}
								key={item.key}
								onClick={() => pickIntent(item.key)}
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
											key={`${sel.intent}-${sel.n}`}
										/>
									</span>
								)}
							</button>
						);
					})}
				</>
			}
		>
			<div className="wsi-subcaps" role="tablist" aria-label="Providers">
				{subs.map((s) => {
					const on = sel.sub === s.key;
					return (
						<button
							type="button"
							role="tab"
							aria-selected={on}
							className={`wsi-subcap${on ? " wsi-subcap-on" : ""}`}
							key={s.key}
							onClick={() =>
								setSel((prev) => ({ ...prev, sub: s.key, n: prev.n + 1 }))
							}
						>
							{s.label}
						</button>
					);
				})}
			</div>
			<div className="wsi-view" key={sel.sub}>
				<Panel />
			</div>
		</IntentShell>
	);
}
