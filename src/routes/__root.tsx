import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import PostHogProvider from "../integrations/posthog/provider";

import appCss from "../styles.css?url";

// Share surface per wayfinder #21: title/description locked there, canonical
// at the root, OG image as an absolute URL, no JSON-LD.
const TITLE = "Alfredo · Ship your next SaaS in minutes";
const DESCRIPTION =
	"Alfredo is the home for your projects. Your next one is live in minutes, with auth, email, database and analytics already wired. Watch them all from one HQ.";
const CANONICAL = "https://getalfredo.com";
const OG_IMAGE = "https://getalfredo.com/generated/og.png";

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
				property: "og:image",
				content: OG_IMAGE,
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
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "canonical",
				href: CANONICAL,
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
