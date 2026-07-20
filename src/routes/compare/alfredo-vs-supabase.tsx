// /compare/alfredo-vs-supabase — one of the nine comparison deep-dives (#75).
// Thin by design: the head and body both come from the #64-sourced record in
// compare-data.ts via the shared layout. Own canonical + OG per #58.
import { createFileRoute } from "@tanstack/react-router";
import {
	CompareSubpage,
	compareHead,
} from "#/components/compare/compare-layout";

export const Route = createFileRoute("/compare/alfredo-vs-supabase")({
	head: () => compareHead("supabase"),
	component: () => <CompareSubpage slug="supabase" />,
});
