// Showcase per issue-19 (approved variant T, the Intent Switchboard): four
// intent keycaps on the rail, one composite panel per view, 5s auto-rotate
// with per-cap progress, pinned skeleton (#20). Heading/sub verbatim from
// issue-14 with the issue-17 swap (Inside the headquarters.). Rotation
// freezes for prefers-reduced-motion and a manual pause keycap (WCAG 2.2.2);
// the rail is a full APG tabs pattern (tabpanel + roving tabindex).
import { useEffect, useRef, useState } from "react";
import {
	INTENT_ITEMS,
	INTENT_PANELS,
	type IntentKey,
	ROTATE_MS,
} from "#/components/landing/showcase-intents";
import "#/components/landing/showcase.css";
import { usePrefersReducedMotion } from "#/components/landing/use-prefers-reduced-motion";

export function Showcase() {
	const reduced = usePrefersReducedMotion();
	const [sel, setSel] = useState<{ key: IntentKey; n: number }>({
		key: "health",
		n: 0,
	});
	const [paused, setPaused] = useState(false);
	const [railFocused, setRailFocused] = useState(false);
	const frozen = reduced || paused || railFocused;
	const tabRefs = useRef<Record<IntentKey, HTMLButtonElement | null>>({
		health: null,
		activity: null,
		money: null,
		mail: null,
	});
	const active = INTENT_ITEMS.find((i) => i.key === sel.key);
	const Panel = INTENT_PANELS[sel.key];

	useEffect(() => {
		if (frozen) return;
		const idx = INTENT_ITEMS.findIndex((i) => i.key === sel.key);
		const t = setTimeout(() => {
			setSel((prev) => ({
				key: INTENT_ITEMS[(idx + 1) % INTENT_ITEMS.length].key,
				n: prev.n + 1,
			}));
		}, ROTATE_MS);
		return () => clearTimeout(t);
	}, [sel, frozen]);

	const selectKey = (key: IntentKey) => {
		setSel((prev) => ({ key, n: prev.n + 1 }));
	};

	const onTabKeyDown = (e: React.KeyboardEvent, idx: number) => {
		let nextIdx: number | null = null;
		if (e.key === "ArrowRight" || e.key === "ArrowDown") {
			nextIdx = (idx + 1) % INTENT_ITEMS.length;
		} else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
			nextIdx = (idx - 1 + INTENT_ITEMS.length) % INTENT_ITEMS.length;
		} else if (e.key === "Home") {
			nextIdx = 0;
		} else if (e.key === "End") {
			nextIdx = INTENT_ITEMS.length - 1;
		}
		if (nextIdx === null) return;
		e.preventDefault();
		const nextKey = INTENT_ITEMS[nextIdx].key;
		selectKey(nextKey);
		tabRefs.current[nextKey]?.focus();
	};

	return (
		<section className="lp-section" aria-label="Inside the headquarters">
			<h2 className="lp-h2">Inside the headquarters.</h2>
			<p className="lp-sub">
				The views you get on day one, across every project you run.
			</p>

			<div className="wsi-bezel">
				<div className="wsi-bezel-top">
					<span className="scp-etch">ALFREDO OS 0.1</span>
					<span className="scp-etch">HQ / {active?.etch ?? ""}</span>
					<span className="scp-etch">SIMULATED DATA</span>
					<button
						type="button"
						className="scp-etch wsi-pause"
						aria-pressed={paused}
						aria-label={paused ? "Resume rotation" : "Pause rotation"}
						onClick={() => setPaused((p) => !p)}
					>
						<span aria-hidden="true">{paused ? "▶ PLAY" : "II PAUSE"}</span>
					</button>
				</div>

				<div className="wsi-app">
					<div
						className="wsi-menu"
						role="tablist"
						aria-label="HQ views"
						onFocus={() => setRailFocused(true)}
						onBlur={(e) => {
							if (!e.currentTarget.contains(e.relatedTarget as Node)) {
								setRailFocused(false);
							}
						}}
					>
						{INTENT_ITEMS.map((item, idx) => {
							const on = sel.key === item.key;
							return (
								<button
									type="button"
									role="tab"
									id={`wsi-tab-${item.key}`}
									aria-selected={on}
									aria-controls={`wsi-panel-${item.key}`}
									tabIndex={on ? 0 : -1}
									className={`wsi-key${on ? " wsi-key-on" : ""}`}
									key={item.key}
									ref={(el) => {
										tabRefs.current[item.key] = el;
									}}
									onClick={() => selectKey(item.key)}
									onKeyDown={(e) => onTabKeyDown(e, idx)}
								>
									<span
										className={`wsi-key-led${on ? " wsi-key-led-on" : ""}`}
										aria-hidden="true"
									/>
									<span className="wsi-key-name">{item.name}</span>
									<span className="wsi-key-services">{item.services}</span>
									{on && !frozen && (
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
					<div className="wsi-main">
						<div className="wsi-stage">
							<div
								className="wsi-view"
								key={sel.key}
								role="tabpanel"
								id={`wsi-panel-${sel.key}`}
								aria-labelledby={`wsi-tab-${sel.key}`}
								// biome-ignore lint/a11y/noNoninteractiveTabindex: APG tabpanel, keyboard-reachable by design (read-only dashboard, no focusable content)
								tabIndex={0}
							>
								<Panel />
							</div>
						</div>
						<div className="wsi-captionbar">
							<p className="wsi-caption">{active?.line ?? ""}</p>
						</div>
					</div>
				</div>

				<div className="wsi-bezel-bottom">
					<span className="scp-etch wsi-microprint">
						YOUR SERVERS · ONE HQ · N PROJECTS
					</span>
				</div>
			</div>
		</section>
	);
}
