// Waypoint etch per issue-29 (system D): every section except the hero
// opens with a centered marker — hairline · NN LABEL · hairline. Labels
// are functional console words (issue-29 amends issue-27's no-on-page-labels
// rule for these etches only). The signal pass (issue-78) dropped the round
// LED and routed the index number to amber on every section.
export function Waypoint({ index, label }: { index: string; label: string }) {
	return (
		<div className="lp-waypoint" aria-hidden="true">
			<span className="lp-waypoint-line" />
			<span className="lp-etch lp-waypoint-text">
				<span className="lp-waypoint-index">{index}</span> {label}
			</span>
			<span className="lp-waypoint-line" />
		</div>
	);
}
