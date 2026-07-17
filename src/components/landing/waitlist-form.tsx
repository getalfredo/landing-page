// Shared waitlist form (issue-4 mechanics, issue-14 strings, issue-17 HQ
// voice). Posts email + honeypot + consent text to /api/waitlist and swaps
// to an HQ-voiced inline state with the queue position. Fires
// trackWaitlistSignup(source) on confirmed success and trackWaitlistError()
// on failure; `trackCta` (final CTA mount) fires trackCtaClick(source) on the
// button click for the land → intent → convert funnel (issue-5).
import { useEffect, useRef, useState } from "react";
import {
	trackCtaClick,
	trackWaitlistError,
	trackWaitlistSignup,
} from "#/lib/analytics";

const CONSENT_TEXT = "One email when Alfredo is ready. Nothing else.";

// The API answers duplicates with the identical 201 by design (issue-4: no
// list-membership leakage), so the already-aboard state is detected here:
// an email this session already confirmed gets the STILL #n line.
const confirmedEmails = new Set<string>();

type FormState =
	| { phase: "idle" }
	| { phase: "submitting" }
	| { phase: "confirmed"; position: number }
	| { phase: "already"; position: number }
	| { phase: "error" };

export function WaitlistForm({
	source,
	trackCta,
}: {
	source: string;
	trackCta?: boolean;
}) {
	const [state, setState] = useState<FormState>({ phase: "idle" });
	const [email, setEmail] = useState("");
	const [company, setCompany] = useState(""); // honeypot — must stay empty
	const confirmRef = useRef<HTMLOutputElement>(null);

	useEffect(() => {
		if (state.phase === "confirmed" || state.phase === "already") {
			confirmRef.current?.focus();
		}
	}, [state.phase]);

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (state.phase === "submitting") return;
		const normalized = email.trim().toLowerCase();
		setState({ phase: "submitting" });
		try {
			const res = await fetch("/api/waitlist", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: normalized,
					consentText: CONSENT_TEXT,
					source,
					company,
				}),
			});
			if (!res.ok) throw new Error(String(res.status));
			const data = (await res.json()) as { queuePosition: number };
			const already = confirmedEmails.has(normalized);
			confirmedEmails.add(normalized);
			// Detected resubmits don't count as signups — the event stays honest.
			if (!already) trackWaitlistSignup(source);
			setState(
				already
					? { phase: "already", position: data.queuePosition }
					: { phase: "confirmed", position: data.queuePosition },
			);
		} catch {
			trackWaitlistError();
			setState({ phase: "error" });
		}
	};

	if (state.phase === "confirmed" || state.phase === "already") {
		return (
			<output className="wf-state wf-state-ok" ref={confirmRef} tabIndex={-1}>
				{state.phase === "confirmed"
					? `WAITLIST ● CONFIRMED · YOU ARE #${state.position}`
					: `ALREADY ABOARD · STILL #${state.position}`}
			</output>
		);
	}

	return (
		<form className="wf" onSubmit={submit}>
			<div className="wf-row">
				<label className="wf-slot">
					<span className="lp-etch wf-slot-label">OPERATOR</span>
					<input
						className="wf-input"
						type="email"
						required
						placeholder="you@yourdomain.dev"
						aria-label="Email address"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</label>
				<input
					className="wf-hp"
					type="text"
					name="company"
					tabIndex={-1}
					autoComplete="off"
					aria-hidden="true"
					value={company}
					onChange={(e) => setCompany(e.target.value)}
				/>
				<button
					className="lp-btn lp-btn-keycap wf-key"
					type="submit"
					disabled={state.phase === "submitting"}
					onClick={trackCta ? () => trackCtaClick(source) : undefined}
				>
					Join the waitlist
				</button>
			</div>
			{state.phase === "error" && (
				<p className="wf-state wf-state-err" role="alert">
					SIGNAL LOST · TRY AGAIN
				</p>
			)}
			<p className="wf-consent">{CONSENT_TEXT}</p>
		</form>
	);
}
