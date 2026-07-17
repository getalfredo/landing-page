// Waypoint etch per issue-29 (system D): every section except the hero
// opens with a centered marker — hairline · NN LABEL · LED · hairline.
// Labels are functional console words (issue-29 amends issue-27's
// no-on-page-labels rule for these etches only); the crescendo's LED
// goes amber with its band.
export function Waypoint({
	index,
	label,
	amber,
}: {
	index: string;
	label: string;
	amber?: boolean;
}) {
	return (
		<div className="lp-waypoint" aria-hidden="true">
			<span className="lp-waypoint-line" />
			<span className="lp-etch lp-waypoint-text">
				<span className="lp-waypoint-index">{index}</span> {label}
			</span>
			<span
				className={
					amber ? "lp-waypoint-led lp-waypoint-led-amber" : "lp-waypoint-led"
				}
			/>
			<span className="lp-waypoint-line" />
		</div>
	);
}
