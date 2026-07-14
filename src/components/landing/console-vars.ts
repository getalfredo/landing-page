// Token bridge (plan: static CSS cannot import TS): the landing root and
// the hero demo root set these custom properties inline from the shared
// console tokens; landing.css / hero-demo.css / showcase.css consume them
// via var(--…) and define no palette literals of their own, aside from the
// showcase-local --red/--red-rgb/--red-glow trio scoped to .scp-win (an
// incident/failure accent that is intentionally not part of the shared ink
// palette; see showcase.css).
import type { CSSProperties } from "react";
import { ink, keycap } from "#/lib/console-tokens";

export const consoleCssVars = {
	"--bg": ink.bg,
	"--panel": ink.panel,
	"--panel-2": ink.panel2,
	"--surface": ink.surface,
	"--paper": ink.paper,
	"--paper-rgb": ink.paperRgb,
	"--paper-soft": ink.paperSoft,
	"--seam": ink.seam,
	"--led": ink.led,
	"--led-rgb": ink.ledRgb,
	"--led-glow": ink.ledGlow,
	"--led-off": ink.ledOff,
	"--green-text": ink.green,
	"--green-rgb": ink.greenRgb,
	"--green-glow": ink.greenGlow,
	"--amber": ink.amber,
	"--amber-rgb": ink.amberRgb,
	"--amber-glow": ink.amberGlow,
	"--display-bg": ink.displayBg,
	"--display-text": ink.green,
	"--keycap-bone-top": keycap.boneTop,
	"--keycap-bone-bottom": keycap.boneBottom,
	"--keycap-bone-hover-top": keycap.boneHoverTop,
	"--keycap-bone-hover-bottom": keycap.boneHoverBottom,
	"--keycap-bone-shadow": keycap.boneShadow,
	"--keycap-ink": keycap.ink,
	"--keycap-ink-rgb": keycap.inkRgb,
	"--keycap-amber-top": keycap.amberTop,
	"--keycap-amber-bottom": keycap.amberBottom,
	"--keycap-amber-hover-top": keycap.amberHoverTop,
	"--keycap-amber-shadow": keycap.amberShadow,
	"--keycap-led-on": keycap.ledOn,
	"--keycap-led-on-glow-rgb": keycap.ledOnGlowRgb,
} as CSSProperties;
