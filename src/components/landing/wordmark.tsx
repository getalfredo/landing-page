// `Alfredo` + LED-dot wordmark (identity v2, #11) shared by header,
// footer and hero chrome.
export function Wordmark() {
	return (
		<span className="lp-wordmark">
			Alfredo
			<span className="lp-wordmark-led" aria-hidden="true" />
		</span>
	);
}
