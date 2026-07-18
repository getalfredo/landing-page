// Privacy page per wayfinder #6: docs/legal/privacy.md transcribed to TSX
// with the placeholders filled (contact email, last-updated date). Plain
// voice, no legal identity published. The wordmark links back home.
import { createFileRoute, Link } from "@tanstack/react-router";
import { consoleCssVars } from "#/components/landing/console-vars";
import { Wordmark } from "#/components/landing/wordmark";
import { SITE_URL } from "#/routes/__root";
import "#/components/landing/landing.css";

const CONTACT_EMAIL = "alportac@gmail.com";
const LAST_UPDATED = "2026-07-12";

// Own head per wayfinder #58: title, description and a self-referencing
// canonical (the page used to inherit the root's homepage canonical), plus
// the OG tags that would otherwise still describe the homepage.
const TITLE = "Privacy · Alfredo";
const DESCRIPTION =
	"How this site handles your data: a waitlist email if you join, cookieless anonymous analytics, and short-lived server logs. No cookies, no ads, no tracking.";
const CANONICAL = `${SITE_URL}/privacy`;

export const Route = createFileRoute("/privacy")({
	head: () => ({
		meta: [
			{
				title: TITLE,
			},
			{
				name: "description",
				content: DESCRIPTION,
			},
			{
				property: "og:title",
				content: TITLE,
			},
			{
				property: "og:description",
				content: DESCRIPTION,
			},
			{
				property: "og:url",
				content: CANONICAL,
			},
		],
		links: [
			{
				rel: "canonical",
				href: CANONICAL,
			},
		],
	}),
	component: PrivacyPage,
});

function PrivacyPage() {
	return (
		<div className="lp" style={consoleCssVars}>
			<header className="lp-header">
				<Link to="/" className="lp-wordmark-link" aria-label="Alfredo home">
					<Wordmark />
				</Link>
			</header>
			<main className="lp-privacy">
				<h1 className="lp-privacy-h1">Privacy</h1>
				<p className="lp-privacy-updated">Last updated: {LAST_UPDATED}</p>
				<p>
					<strong>The short version:</strong> this site sets no cookies, shows
					no ads, and runs nothing that identifies you. The only personal data
					we store is your email address - and only if you join the waitlist.
				</p>
				<h2>The waitlist</h2>
				<p>
					If you join the waitlist, we store your email address, the time you
					signed up, the exact consent wording you saw, and - if your visit
					carried one - a referral source (like a <code>ref</code> or UTM
					parameter).
				</p>
				<p>
					We use this for one thing: emailing you when Alfredo launches. We
					don't send anything else, we don't share the data with anyone, and we
					don't connect it to analytics. It lives in a database on our own
					server in the EU.
				</p>
				<p>
					Want out? Email{" "}
					<a className="lp-link" href={`mailto:${CONTACT_EMAIL}`}>
						{CONTACT_EMAIL}
					</a>{" "}
					and we'll delete your entry.
				</p>
				<h2>Analytics</h2>
				<p>
					We use PostHog (EU cloud, data hosted in Frankfurt) to see, in
					aggregate, whether the site works: page views, waitlist signups,
					clicks on the call-to-action. The setup is deliberately minimal:
				</p>
				<ul>
					<li>
						<strong>No cookies, no local storage.</strong> Analytics state lives
						only in your browser's memory while the page is open.
					</li>
					<li>
						<strong>Anonymous only.</strong> No user profiles, no
						identification, no recognizing you across visits.
					</li>
					<li>
						<strong>No IP storage.</strong> IP addresses are discarded, not
						stored with events.
					</li>
					<li>
						<strong>No session recording, no autocapture.</strong>
					</li>
				</ul>
				<p>
					Because nothing is stored on your device and no profile is built,
					there's no consent banner - there's nothing to consent to.
				</p>
				<h2>Hosting and logs</h2>
				<p>
					The site runs on our own server in the EU. Like every web server, it
					keeps short-lived technical logs (IP address, time, requested URL,
					browser) to keep things running and secure; they're rotated and
					deleted automatically. Your IP is also used transiently, in memory
					only, to rate-limit the waitlist form against abuse - it's never
					written to the database or linked to your entry.
				</p>
				<h2>Questions</h2>
				<p>
					Anything about your data:{" "}
					<a className="lp-link" href={`mailto:${CONTACT_EMAIL}`}>
						{CONTACT_EMAIL}
					</a>
					. If the site's data handling changes (for example, at launch), this
					page changes with it.
				</p>
			</main>
		</div>
	);
}
