// PROTOTYPE variant U — sectioned rail (wayfinder #19, throwaway).
// The minimal regroup: intent is only a LABEL LAYER. The rail keeps one
// keycap per service (all seven views and their #14 captions survive
// untouched); etched intent headers sort the caps into Health / Activity /
// Money / Mail groups. Rotation walks the caps in group order.
// KNOWN STALENESS: the reused service panels still render pre-#14 brands
// inside (PostHog/Gmail/Stripe) — the truth-list swap on panel guts is
// build/#20 work; the rail caps below already carry the truth-list.
import { useEffect, useState } from "react";
import {
	IntentShell,
	ROTATE_MS,
} from "#/components/prototype/showcase-intents";
import {
	SHOWCASE_PANELS,
	type ShowcaseKey,
} from "#/components/prototype/showcase-panels";

const GROUPS: {
	label: string;
	items: {
		key: ShowcaseKey;
		name: string;
		etch: string;
		provider: string | null;
		line: string;
	}[];
}[] = [
	{
		label: "HEALTH",
		items: [
			{
				key: "uptime",
				name: "Uptime",
				etch: "UPTIME",
				provider: "Uptime Kuma",
				line: "Know a project is down before its first user does.",
			},
			{
				key: "errors",
				name: "Errors",
				etch: "ERRORS",
				provider: "Sentry",
				line: "The stack trace is there before the bug report is.",
			},
		],
	},
	{
		label: "ACTIVITY",
		items: [
			{
				key: "traffic",
				name: "Traffic",
				etch: "TRAFFIC",
				provider: "Umami",
				line: "Every project's traffic on one graph, and the spike the moment it starts.",
			},
			{
				key: "auth",
				name: "Auth",
				etch: "AUTH",
				provider: "Better-Auth",
				line: "Signups across every project, the moment they move.",
			},
			{
				key: "github",
				name: "GitHub",
				etch: "GITHUB",
				provider: "All repos",
				line: "Stars, new issues and waiting PRs from every repo, at one glance.",
			},
		],
	},
	{
		label: "MONEY",
		items: [
			{
				key: "pay",
				name: "Payments",
				etch: "PAYMENTS",
				provider: "Creem",
				line: "A failed charge pings you before the customer does.",
			},
		],
	},
	{
		label: "MAIL",
		items: [
			{
				key: "mail",
				name: "Email",
				etch: "MAIL",
				provider: "Postmark",
				line: "Every mail your projects send, and the bounce that needs a second look.",
			},
		],
	},
];

const FLAT = GROUPS.flatMap((g) => g.items);

export function VariantUIntentSections() {
	const [sel, setSel] = useState<{ key: ShowcaseKey; n: number }>({
		key: "uptime",
		n: 0,
	});
	const active = FLAT.find((i) => i.key === sel.key);
	const Panel = SHOWCASE_PANELS[sel.key];

	useEffect(() => {
		const idx = FLAT.findIndex((i) => i.key === sel.key);
		const t = setTimeout(() => {
			setSel((prev) => ({
				key: FLAT[(idx + 1) % FLAT.length].key,
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
					{GROUPS.map((group) => (
						<div
							className="wsi-railgroup"
							style={{ flex: group.items.length }}
							key={group.label}
						>
							<span className="wsi-railhead">{group.label}</span>
							{group.items.map((item) => {
								const on = sel.key === item.key;
								return (
									<button
										type="button"
										role="tab"
										aria-selected={on}
										className={`wsi-key wsi-key-slim${on ? " wsi-key-on" : ""}`}
										key={item.key}
										onClick={() =>
											setSel((prev) => ({ key: item.key, n: prev.n + 1 }))
										}
									>
										<span
											className={`wsi-key-led${on ? " wsi-key-led-on" : ""}`}
											aria-hidden="true"
										/>
										<span className="wsi-key-name wsi-key-name-slim">
											{item.name}
										</span>
										{item.provider && (
											<span className="wsi-key-services">{item.provider}</span>
										)}
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
						</div>
					))}
					<style>{stylesU}</style>
				</>
			}
		>
			<div className="wsi-view" key={sel.key}>
				<Panel />
			</div>
		</IntentShell>
	);
}

const stylesU = `
.wsi-railgroup {
	display: flex;
	flex-direction: column;
	gap: 7px;
	min-height: 0;
}
.wsi-railgroup .wsi-key { flex: 1; min-height: 34px; }
.wsi-key-slim { padding: 0 12px; border-radius: 8px; }
.wsi-key-name-slim { font-size: 12.5px; }
.wsi-menu { gap: 8px; min-height: 0; overflow: hidden; padding: 14px 16px; }
.wsi-railhead { line-height: 1; }
`;
