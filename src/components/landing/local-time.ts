// Time-of-day awareness (#53): the visitor's wall clock is the one
// genuinely-local detail in an otherwise fully simulated hero, so it needs
// no SIMULATED etch. Returns the local time as HH:MM (null until mounted —
// server and first client render both show the dead --:-- state, so
// hydration never mismatches) plus a glow multiplier for the demo's LEDs
// and display glass: the same panel reads brighter in a dark room.
import { useEffect, useState } from "react";

// day 1 · dusk/dawn 1.25 · night 1.5 — consumed as --tod-glow, a blur-radius
// multiplier with fallback 1, so surfaces outside the demo never shift.
const glowFor = (hour: number) =>
	hour >= 21 || hour < 5 ? 1.5 : hour >= 18 || hour < 8 ? 1.25 : 1;

export function useLocalTime() {
	const [now, setNow] = useState<Date | null>(null);

	useEffect(() => {
		setNow(new Date());
		// First timeout lands on the next minute boundary, then tick per minute.
		let interval: number | undefined;
		const align = window.setTimeout(
			() => {
				setNow(new Date());
				interval = window.setInterval(() => setNow(new Date()), 60_000);
			},
			60_000 - (Date.now() % 60_000),
		);
		return () => {
			clearTimeout(align);
			if (interval !== undefined) clearInterval(interval);
		};
	}, []);

	if (!now) return { hhmm: null, glow: 1 };
	const hh = String(now.getHours()).padStart(2, "0");
	const mm = String(now.getMinutes()).padStart(2, "0");
	return { hhmm: `${hh}:${mm}`, glow: glowFor(now.getHours()) };
}
