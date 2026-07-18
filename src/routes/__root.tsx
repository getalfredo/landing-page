// Above-the-fold faces, preloaded (wayfinder #59): the H1 sets Space
// Grotesk 700, the bezel etches set IBM Plex Mono 400. Everything else
// waits for the CSS-discovered load behind metric-matched fallbacks.
import plexMono400 from "@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2?url";
import spaceGrotesk700 from "@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff2?url";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import PostHogProvider from "../integrations/posthog/provider";
import appCss from "../styles.css?url";

// Share surface per wayfinder #21: title/description locked there, OG image
// as an absolute URL. JSON-LD per wayfinder #57: WebSite + Organization +
// minimal SoftwareApplication, no FAQPage (rich result removed May 2026),
// no offers/ratings (pre-launch). Canonicals are per-route (wayfinder #58):
// each page links its own; the root head carries none.
const TITLE = "Alfredo · Ship your next SaaS in minutes";
const DESCRIPTION =
	"Alfredo is the home for your projects. Your next one is live in minutes, with auth, email, database and analytics already wired. Watch them all from one HQ.";
export const SITE_URL = "https://getalfredo.com";
const CANONICAL = SITE_URL;
const OG_IMAGE = `${SITE_URL}/generated/og.png`;

const JSON_LD = JSON.stringify({
	"@context": "https://schema.org",
	"@graph": [
		{
			"@type": "WebSite",
			"@id": `${CANONICAL}/#website`,
			name: "Alfredo",
			url: CANONICAL,
			publisher: { "@id": `${CANONICAL}/#organization` },
		},
		{
			"@type": "Organization",
			"@id": `${CANONICAL}/#organization`,
			name: "Alfredo",
			url: CANONICAL,
			description: DESCRIPTION,
			logo: "https://getalfredo.com/generated/apple-touch-icon.png",
			sameAs: ["https://github.com/getalfredo", "https://x.com/alperortac"],
		},
		{
			"@type": "SoftwareApplication",
			"@id": `${CANONICAL}/#app`,
			name: "Alfredo",
			url: CANONICAL,
			description: DESCRIPTION,
			applicationCategory: "DeveloperApplication",
			publisher: { "@id": `${CANONICAL}/#organization` },
		},
	],
});

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: TITLE,
			},
			{
				name: "description",
				content: DESCRIPTION,
			},
			{
				name: "theme-color",
				content: "#14150e",
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
			{
				property: "og:type",
				content: "website",
			},
			{
				property: "og:site_name",
				content: "Alfredo",
			},
			{
				property: "og:image",
				content: OG_IMAGE,
			},
			{
				property: "og:image:width",
				content: "1200",
			},
			{
				property: "og:image:height",
				content: "630",
			},
			{
				property: "og:image:alt",
				content:
					"Alfredo. Ship your next SaaS in minutes, next to a dark console dashboard watching every project.",
			},
			{
				name: "twitter:card",
				content: "summary_large_image",
			},
			{
				name: "twitter:creator",
				content: "@alperortac",
			},
		],
		links: [
			{
				rel: "preload",
				href: spaceGrotesk700,
				as: "font",
				type: "font/woff2",
				crossOrigin: "anonymous",
			},
			{
				rel: "preload",
				href: plexMono400,
				as: "font",
				type: "font/woff2",
				crossOrigin: "anonymous",
			},
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "icon",
				href: "/favicon.svg",
				type: "image/svg+xml",
			},
			{
				rel: "icon",
				href: "/generated/favicon-32.png",
				type: "image/png",
				sizes: "32x32",
			},
			{
				rel: "apple-touch-icon",
				href: "/generated/apple-touch-icon.png",
				sizes: "180x180",
			},
			{
				rel: "manifest",
				href: "/manifest.json",
			},
		],
		scripts: [
			{
				type: "application/ld+json",
				children: JSON_LD,
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<PostHogProvider>
					{children}
					{import.meta.env.DEV && (
						<TanStackDevtools
							config={{
								position: "bottom-right",
							}}
							plugins={[
								{
									name: "Tanstack Router",
									render: <TanStackRouterDevtoolsPanel />,
								},
							]}
						/>
					)}
				</PostHogProvider>
				<Scripts />
			</body>
		</html>
	);
}
