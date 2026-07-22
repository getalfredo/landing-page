// Shared waitlist form (issue-4 mechanics, issue-14 strings, issue-17 HQ
// voice, issue-60 friction pass). Posts email + honeypot + consent text to
// /api/waitlist and swaps to an HQ-voiced inline state with the queue
// position. Progressive enhancement: the form carries a real action/method
// and named fields, so pre-hydration or no-JS submits post natively and the
// API answers with a redirect (`?wl=…&src=<source>#wl-<source>`) this
// component restores on mount. Email validates on blur only (never while
// typing), errors clear live on correction, and network / invalid / rate-
// limited failures each get their own line. Fires trackWaitlistSignup(source)
// on confirmed success and trackWaitlistError() on failure; `trackCta`
// (final CTA mount) fires trackCtaClick(source) on the button click for the
// land → intent → convert funnel (issue-5).
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

type ErrorKind = "invalid" | "rate" | "network";

type FormState =
	| { phase: "idle" }
	| { phase: "submitting" }
	| { phase: "confirmed"; position: number }
	| { phase: "already"; position: number }
	| { phase: "error"; kind: ErrorKind; retryAfter?: number };

type EmailCheck = "neutral" | "valid" | "invalid";

// Deliberately loose (the server re-validates); its job is catching the
// obvious slips — missing @, missing dot, stray spaces — on blur.
function emailLooksValid(value: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function errorLine(kind: ErrorKind, retryAfter?: number): string {
	switch (kind) {
		case "invalid":
			return "CHECK THE ADDRESS · NAME@DOMAIN.TLD";
		case "rate":
			return retryAfter
				? `TOO MANY TRIES · RETRY IN ${retryAfter}S`
				: "TOO MANY TRIES · RETRY IN A MOMENT";
		case "network":
			return "SIGNAL LOST · CHECK YOUR CONNECTION · TRY AGAIN";
	}
}

export function WaitlistForm({
	source,
	trackCta,
}: {
	source: string;
	trackCta?: boolean;
}) {
	const [state, setState] = useState<FormState>({ phase: "idle" });
	const [email, setEmail] = useState("");
	const [emailCheck, setEmailCheck] = useState<EmailCheck>("neutral");
	const [company, setCompany] = useState(""); // honeypot — must stay empty
	const confirmRef = useRef<HTMLOutputElement>(null);

	useEffect(() => {
		if (state.phase === "confirmed" || state.phase === "already") {
			confirmRef.current?.focus();
		}
	}, [state.phase]);

	// Restore the outcome of a native (no-JS / pre-hydration) submit from the
	// redirect params, scoped to this form instance via `src`. The params are
	// stripped afterwards so a refresh doesn't replay the state or the event.
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const wl = params.get("wl");
		if (!wl || params.get("src") !== source) return;
		const pos = Number(params.get("pos"));
		const retry = Number(params.get("retry"));
		for (const key of ["wl", "src", "pos", "retry"]) params.delete(key);
		const qs = params.toString();
		history.replaceState(
			null,
			"",
			window.location.pathname + (qs ? `?${qs}` : "") + window.location.hash,
		);
		if (wl === "ok" && Number.isFinite(pos) && pos > 0) {
			trackWaitlistSignup(source);
			setState({ phase: "confirmed", position: pos });
		} else if (wl === "invalid") {
			trackWaitlistError();
			setState({ phase: "error", kind: "invalid" });
		} else if (wl === "rate") {
			trackWaitlistError();
			setState({
				phase: "error",
				kind: "rate",
				retryAfter: Number.isFinite(retry) && retry > 0 ? retry : undefined,
			});
		} else {
			trackWaitlistError();
			setState({ phase: "error", kind: "network" });
		}
	}, [source]);

	const onEmailChange = (value: string) => {
		setEmail(value);
		// Never flag while typing — only clear an existing error the moment the
		// address turns valid, and keep the positive check honest.
		if (emailLooksValid(value)) {
			setEmailCheck("valid");
			if (state.phase === "error" && state.kind === "invalid") {
				setState({ phase: "idle" });
			}
		} else if (emailCheck === "valid") {
			setEmailCheck("neutral");
		}
	};

	const onEmailBlur = () => {
		if (email.trim() === "") {
			setEmailCheck("neutral");
			return;
		}
		setEmailCheck(emailLooksValid(email) ? "valid" : "invalid");
	};

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (state.phase === "submitting") return;
		const normalized = email.trim().toLowerCase();
		if (!emailLooksValid(normalized)) {
			setEmailCheck("invalid");
			return;
		}
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
			if (!res.ok) {
				trackWaitlistError();
				if (res.status === 429) {
					const retry = Number(res.headers.get("Retry-After"));
					setState({
						phase: "error",
						kind: "rate",
						retryAfter: Number.isFinite(retry) && retry > 0 ? retry : undefined,
					});
				} else if (res.status === 400) {
					setEmailCheck("invalid");
					setState({ phase: "error", kind: "invalid" });
				} else {
					setState({ phase: "error", kind: "network" });
				}
				return;
			}
			const data = (await res.json()) as { queuePosition: number };
			const already = confirmedEmails.has(normalized);
			confirmedEmails.add(normalized);
			// Detected resubmits don't count as signups — the event stays honest.
			if (!already) trackWaitlistSignup(source, normalized);
			setState(
				already
					? { phase: "already", position: data.queuePosition }
					: { phase: "confirmed", position: data.queuePosition },
			);
		} catch {
			trackWaitlistError();
			setState({ phase: "error", kind: "network" });
		}
	};

	if (state.phase === "confirmed" || state.phase === "already") {
		return (
			<output className="wf-done" ref={confirmRef} tabIndex={-1}>
				<span className="wf-state wf-state-ok">
					{state.phase === "confirmed"
						? `WAITLIST ● CONFIRMED · YOU ARE #${state.position}`
						: `ALREADY ABOARD · STILL #${state.position}`}
				</span>
				<span className="wf-next">
					{state.phase === "confirmed"
						? "You're in. Nothing more to do here. When Alfredo is ready, one email lands and the door opens."
						: "Same spot, still saved. One email when Alfredo is ready."}
				</span>
			</output>
		);
	}

	const fieldInvalid = emailCheck === "invalid";
	const shownError = fieldInvalid
		? errorLine("invalid")
		: state.phase === "error"
			? errorLine(state.kind, state.retryAfter)
			: null;

	return (
		<form
			className="wf"
			id={`wl-${source}`}
			action={`/api/waitlist?source=${source}`}
			method="post"
			onSubmit={submit}
		>
			<div className="wf-row">
				<label className="wf-slot">
					<span className="lp-etch wf-slot-label">
						OPERATOR
						{emailCheck === "valid" && (
							<span className="wf-slot-ok" aria-hidden="true">
								✓
							</span>
						)}
					</span>
					<input
						className="wf-input"
						type="email"
						name="email"
						required
						placeholder="you@yourdomain.dev"
						aria-label="Email address"
						aria-invalid={fieldInvalid || undefined}
						value={email}
						onChange={(e) => onEmailChange(e.target.value)}
						onBlur={onEmailBlur}
					/>
				</label>
				<input type="hidden" name="consentText" value={CONSENT_TEXT} />
				<input type="hidden" name="source" value={source} />
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
					className="lp-btn lp-btn-armed wf-key"
					type="submit"
					disabled={state.phase === "submitting"}
					onClick={trackCta ? () => trackCtaClick(source) : undefined}
				>
					Join the waitlist
				</button>
			</div>
			{shownError && (
				<p className="wf-state wf-state-err" role="alert">
					{shownError}
				</p>
			)}
			<p className="wf-consent">{CONSENT_TEXT}</p>
		</form>
	);
}
