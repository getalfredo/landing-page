// Shared layout for the nine /compare/alfredo-vs-<name> subpages (#75).
// One component, nine thin route files: each route supplies a slug, this
// renders the full deep-dive from the #64-sourced record in compare-data.ts.
//
// Non-adversarial frame (#63 §5, #45): keep-first ordering — the relationship
// sentence and "You keep" lead, the backing table and "Alfredo adds" follow,
// each product's real wins are named plainly, and the page closes on an
// honest "stay put if…". Every capability cell stays qualified prose, never a
// bare mark; Alfredo's own column is unhighlighted honesty, not a scoreboard.
//
// The backing table is laid out capability-per-row (axis · Alfredo · X) so the
// long qualified cells have room to breathe on a reading page, unlike the
// dense inverted on-page table (#74). All cells render server-side (AEO).
import { Link } from "@tanstack/react-router";
import {
	ALFREDO_CELLS,
	AXES,
	type Cell,
	type CellStatus,
	PRODUCTS,
	STATUS_LABEL,
	STATUS_SQ,
} from "#/components/compare/compare-data";
import { consoleCssVars } from "#/components/landing/console-vars";
import { Footer } from "#/components/landing/footer";
import { Wordmark } from "#/components/landing/wordmark";
import { SITE_URL } from "#/routes/__root";
import "#/components/landing/landing.css";
import "#/components/landing/comparison.css";
import "#/components/compare/compare.css";

/** Per-route head (#58: each route links its own canonical/OG; no root
 *  fallback exists). Built from the product record so a route file stays thin. */
export function compareHead(slug: string) {
	const p = PRODUCTS[slug];
	const canonical = `${SITE_URL}/compare/alfredo-vs-${p.slug}`;
	return {
		meta: [
			{ title: p.title },
			{ name: "description", content: p.description },
			{ property: "og:title", content: p.title },
			{ property: "og:description", content: p.description },
			{ property: "og:url", content: canonical },
		],
		links: [{ rel: "canonical", href: canonical }],
	};
}

function Pip({ status }: { status: CellStatus }) {
	return (
		<span
			className={`lp-sq ${STATUS_SQ[status]} cmp-tbl-pip`}
			role="img"
			aria-label={STATUS_LABEL[status]}
		/>
	);
}

function BackingCell({ cell }: { cell: Cell }) {
	return (
		<td className={`cmp-sub-cell cmp-tbl-cell-${cell.s}`}>
			<Pip status={cell.s} />
			<span className="cmp-sub-cell-q">{cell.q}</span>
		</td>
	);
}

function BackingTable({ name, cells }: { name: string; cells: Cell[] }) {
	return (
		<div className="cmp-sub-tbl">
			<div className="cmp-tbl-scroll">
				<table className="cmp-sub-table">
					<caption className="lp-visually-hidden">
						Alfredo versus {name} across seven capabilities, each cell marked
						automatic, manual, or not possible with a short qualifier.
					</caption>
					<thead>
						<tr>
							<th scope="col" className="cmp-sub-corner">
								<span className="lp-etch">CAPABILITY</span>
							</th>
							<th scope="col" className="cmp-sub-colhead cmp-sub-colhead-alf">
								Alfredo
							</th>
							<th scope="col" className="cmp-sub-colhead">
								{name}
							</th>
						</tr>
					</thead>
					<tbody>
						{AXES.map((axis, i) => (
							<tr key={axis} className="cmp-sub-row">
								<th scope="row" className="cmp-sub-rowhead">
									{axis}
								</th>
								<BackingCell cell={ALFREDO_CELLS[i]} />
								<BackingCell cell={cells[i]} />
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="cmp-tbl-foot">
				<span className="cmp-tbl-legend">
					<span className="lp-sq lp-sq-up cmp-tbl-pip" /> automatic
					<span className="lp-sq lp-sq-partial cmp-tbl-pip" /> manual
					<span className="lp-sq lp-sq-none cmp-tbl-pip" /> not possible
				</span>
				<span className="lp-etch cmp-tbl-stamp">VERIFIED JULY 2026</span>
			</div>
		</div>
	);
}

export function CompareSubpage({ slug }: { slug: string }) {
	const p = PRODUCTS[slug];
	return (
		<div className="lp" style={consoleCssVars}>
			<header className="lp-header">
				<Link to="/" className="lp-wordmark-link" aria-label="Alfredo home">
					<Wordmark />
				</Link>
				<span className="lp-header-right">
					<span className="lp-etch">SELF-HOSTED</span>
					<Link
						to="/"
						hash="waitlist"
						className="lp-btn lp-btn-keycap lp-header-btn"
					>
						Join the waitlist
					</Link>
				</span>
			</header>

			<main className="cmp-sub">
				<p className="lp-etch cmp-sub-kicker">
					BUT CAN'T {p.name.toUpperCase()} DO THAT?
				</p>
				<h1 className="cmp-sub-h1">Alfredo vs {p.name}</h1>
				<p className="cmp-sub-doubt">“{p.doubt}”</p>
				<p className="cmp-sub-rel">{p.relationship}</p>

				{/* keep-first (#45): what survives adopting Alfredo leads. */}
				<section className="cmp-sub-block cmp-sub-block-keep">
					<h2 className="cmp-sub-h2">
						<span className="lp-etch cmp-sub-tag">YOU KEEP</span>
					</h2>
					<p className="cmp-sub-p">{p.youKeep}</p>
				</section>

				<section className="cmp-sub-block">
					<h2 className="cmp-sub-h2">
						Alfredo and {p.name}, across the seven things
					</h2>
					<p className="cmp-sub-p cmp-sub-p-lead">
						The honest version, side by side. Green is automatic, amber is
						manual work you own, a grey ring is not possible.
					</p>
					<BackingTable name={p.name} cells={p.cells} />
				</section>

				<section className="cmp-sub-block">
					<h2 className="cmp-sub-h2">
						<span className="lp-etch cmp-sub-tag">ALFREDO ADDS</span>
					</h2>
					<p className="cmp-sub-p">{p.alfredoAdds}</p>
				</section>

				<section className="cmp-sub-block">
					<h2 className="cmp-sub-h2">
						<span className="lp-etch cmp-sub-tag">
							{p.name.toUpperCase()}'S REAL WINS
						</span>
					</h2>
					<p className="cmp-sub-p">{p.realWins}</p>
				</section>

				{/* closing "stay put if…" (#63 §4.6, mandatory, never a strawman). */}
				<section className="cmp-sub-block cmp-sub-block-stay">
					<h2 className="cmp-sub-h2">
						<span className="lp-etch cmp-sub-tag">
							STAY ON {p.name.toUpperCase()} IF
						</span>
					</h2>
					<p className="cmp-sub-p">
						Stay put if {p.stayPutIf} Alfredo is an early, unproven prototype;{" "}
						{p.name} is the mature, proven thing.
					</p>
				</section>

				<div className="cmp-sub-cta">
					<Link
						to="/"
						hash="waitlist"
						className="lp-btn lp-btn-keycap cmp-sub-cta-btn"
					>
						Join the waitlist
					</Link>
					<Link
						to="/"
						hash="wp-compare"
						className="lp-etch cmp-link cmp-sub-back"
					>
						← back to the full comparison
					</Link>
				</div>
			</main>

			<Footer />
		</div>
	);
}
