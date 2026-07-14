// FAQ per issue-14: six questions, copy verbatim; the last answer links
// the privacy page (issue-8).
import { Link } from "@tanstack/react-router";

export function Faq() {
	return (
		<section className="lp-section">
			<h2 className="lp-h2">Questions.</h2>
			<dl className="lp-faq-list">
				<div>
					<dt className="lp-faq-q">What exactly does Alfredo wire?</dt>
					<dd className="lp-faq-a">
						That's a journey you steer. Alfredo starts with Umami for analytics,
						Postmark for email, Convex for the database, Better-Auth for auth,
						Creem for payments, Sentry for errors, GitHub and Uptime Kuma. The
						lineup grows from what you ask for.
					</dd>
				</div>
				<div>
					<dt className="lp-faq-q">How does it work?</dt>
					<dd className="lp-faq-a">
						When you deploy a project, Alfredo creates the keys and config each
						integration needs and wires them in automatically. You never copy a
						secret into a .env file again.
					</dd>
				</div>
				<div>
					<dt className="lp-faq-q">Where does it run?</dt>
					<dd className="lp-faq-a">
						On your own server. Any VPS you can SSH into works. Alfredo doesn't
						host your projects; you have full control.
					</dd>
				</div>
				<div>
					<dt className="lp-faq-q">Is Alfredo open source?</dt>
					<dd className="lp-faq-a">
						Yes. Self-hosting only counts if you can read what you're hosting.
					</dd>
				</div>
				<div>
					<dt className="lp-faq-q">What if Alfredo disappears?</dt>
					<dd className="lp-faq-a">
						Your projects won't notice. Everything runs on your server, and the
						code stays open source.
					</dd>
				</div>
				<div>
					<dt className="lp-faq-q">What happens with my email?</dt>
					<dd className="lp-faq-a">
						You get{" "}
						<Link className="lp-link" to="/privacy">
							exactly one email
						</Link>
						: the one that says Alfredo is live. Be one of the first inside.
					</dd>
				</div>
			</dl>
		</section>
	);
}
