// FAQ per issue-31 (approved variant A, exclusive accordion panel): one
// console glass panel, six seam-divided rows with etched indexes and an LED
// that lights on the open row. Exactly one answer is visible at all times —
// first open on load, clicking the open row is a no-op. Copy verbatim from
// issue-14; the last answer links the privacy page (issue-8).
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Waypoint } from "#/components/landing/waypoint";

const QA: { q: string; a: React.ReactNode }[] = [
	{
		q: "What exactly does Alfredo wire?",
		a: (
			<>
				That's a journey you steer. Alfredo starts with Umami for analytics,
				Postmark for email, Convex for the database, Better-Auth for auth, Creem
				for payments, Sentry for errors, GitHub and Uptime Kuma. The lineup
				grows from what you ask for.
			</>
		),
	},
	{
		q: "How does it work?",
		a: (
			<>
				When you deploy a project, Alfredo creates the keys and config each
				integration needs and wires them in automatically. You never copy a
				secret into a .env file again.
			</>
		),
	},
	{
		q: "Where does it run?",
		a: (
			<>
				On your own server. Any VPS you can SSH into works. Alfredo doesn't host
				your projects; you have full control.
			</>
		),
	},
	{
		q: "Is Alfredo open source?",
		a: <>Yes. Self-hosting only counts if you can read what you're hosting.</>,
	},
	{
		q: "What if Alfredo disappears?",
		a: (
			<>
				Your projects won't notice. Everything runs on your server, and the code
				stays open source.
			</>
		),
	},
	{
		q: "What happens with my email?",
		a: (
			<>
				You get{" "}
				<Link className="lp-link" to="/privacy">
					exactly one email
				</Link>
				: the one that says Alfredo is live. Be one of the first inside.
			</>
		),
	},
];

const index = (i: number) => String(i + 1).padStart(2, "0");

export function Faq() {
	const [open, setOpen] = useState(0);

	return (
		<section className="lp-section" id="wp-questions">
			<Waypoint index="06" label="QUESTIONS" />
			<h2 className="lp-h2">Questions.</h2>
			<div className="lp-faq-panel">
				{QA.map((item, i) => {
					const isOpen = open === i;
					return (
						<div
							key={item.q}
							className={isOpen ? "lp-faq-row lp-faq-row-open" : "lp-faq-row"}
						>
							<button
								type="button"
								className="lp-faq-row-btn"
								aria-expanded={isOpen}
								onClick={() => setOpen(i)}
							>
								<span className="lp-etch lp-faq-index">{index(i)}</span>
								<span className="lp-faq-q">{item.q}</span>
								<span className="lp-faq-led" aria-hidden="true" />
							</button>
							<div className="lp-faq-fold">
								<div className="lp-faq-fold-inner">
									<p className="lp-faq-a">{item.a}</p>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}
