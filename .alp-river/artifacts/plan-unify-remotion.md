<APPROVED_PLAN version="2">

## Approach
Collapse the standalone `videos/` Remotion project into the TanStack Start app as ONE npm package: pin the Remotion deps on the single root `package.json`, add a root `remotion.config.ts` (studio port 3001, `enableTailwind`, `@`->`/src` webpack alias), COPY the entry/compositions into `src/remotion/`, and point the Remotion root at a NEW minimal video-only `src/remotion/styles.css` (`@import "tailwindcss";` only - NOT the app's `src/styles.css`, whose `@layer base` paints a white body and which double-loads Inter). A baseline `git` commit opens M1 (the repo has ZERO commits and `videos/` is untracked, so a delete would be unrecoverable) to create a restore point; `videos/` then stays in place as a known-good reference and is deleted only in M5, after every gate AND the final render. Milestone 1 proves the two researcher-flagged unknowns empirically (config loads under `"type":"module"`; `vite build` ignores `src/remotion`) with a placeholder still BEFORE any bumper work. Only then do later milestones install the remocn animation components, make the backward-compatible prop edits, compose the locked Alfredo bumper, and render the final still + MP4.

## Plan Breakdown
Right now this repo carries the marketing site and a second, self-contained video project side by side, each with its own copy of React and its own dependency folder. This change folds the video project into the main app so there is one dependency folder, one React, and one set of build tools - and it rebuilds the "Alfredo" intro clip inside that unified home. Because the repo has never been committed and the video folder isn't tracked, the very first step takes a safety snapshot so nothing can be lost; the old video folder is then kept untouched as a working reference and only removed at the very end, after the new clip has rendered. For example, after the change a developer runs one command from the project root to open the video studio, and another to export a PNG frame or an MP4; meanwhile the website itself keeps starting and building exactly as before. The rebuilt intro shows a dark, barely-moving grid, the word "Alfredo" sharpening into focus, then the line "Ship your new SaaS in minutes." fading in beneath it, holding, then a clean cut (about 4.5 seconds, 1280x720).

`Snapshot + merge the two projects -> prove the studio + a test frame + the website all still work -> add the animation pieces -> build the intro -> export the frame and the video -> retire the old folder`

Milestones (advisory):
1. Take a safety snapshot, merge the two projects into one package (old video folder left in place as a reference), and prove the pipeline: video studio starts, a placeholder frame renders, and the website's dev + build stay green.
2. Add the three off-the-shelf animation components and the Inter font package.
3. Confirm those components animate purely from the frame number, then give the wordmark and tagline components optional transparent-background / font settings (defaults keep old behavior).
4. Build the Alfredo intro (dark grid + focusing wordmark + fading tagline, 1280x720 @ 30fps, 135 frames) in place of the old hand-built version, and type-check it.
5. Export the final frame + MP4, re-confirm the website still builds, save the Remotion dev notes, then delete the old video folder and scratch render files.

## Files to Modify
- `package.json` - (M1) pin `"remotion": "4.0.484"` (drop `^`); add `"@remotion/cli": "4.0.484"` + `"@remotion/tailwind-v4": "4.0.484"`; add three FULLY-QUALIFIED scripts - `"remotion:studio": "remotion studio src/remotion/index.ts"`, `"remotion:still": "remotion still src/remotion/index.ts AlfredoIntro out/AlfredoIntro.png"`, `"remotion:render": "remotion render src/remotion/index.ts AlfredoIntro out/AlfredoIntro.mp4"`; delete the dead `"pnpm": { "onlyBuiltDependencies": [...] }` block. (M2) add `"@remotion/google-fonts": "4.0.484"`. Keep react/react-dom/@types/react at `^19.2.0`, typescript `^6.0.2`.
- `.gitignore` - (M1) add `out/`.
- `tsconfig.json` - (M1) add TEMPORARY `"exclude": ["videos"]` so the new root `tsc --noEmit` gates don't traverse the RETAINED legacy `videos/src/*.tsx` (its un-imported `React.FC` was never type-checked). (M5) remove after `videos/` deleted. Direct consequence of keeping `videos/` through M4.
- `src/remotion/Root.tsx` - (M1) after copy: `import "./index.css"` -> `import "./styles.css"`; add `import type { FC } from "react"`, use `FC` not bare `React.FC` (root tsconfig strict + verbatimModuleSyntax + no allowUmdGlobalAccess -> React.FC errors TS2686). (M4) `<Composition>` width=1280 height=720 fps=30 durationInFrames=135.
- `src/remotion/Composition.tsx` - (M1) copied placeholder; add `import type { FC } from "react"`, replace all 5 `React.FC`->`FC` so M1 tsc passes. (M4) full rewrite to locked bumper (FC, not React.FC); delete hand-rolled Background/Headline/AccentLine/Tagline + SANS/EASE_OUT.
- `src/components/remocn/tracking-in.tsx` - (M3) add `background?` (default "white") + `fontFamily?` (default geist). color already a prop.
- `src/components/remocn/micro-scale-fade.tsx` - (M3, after install) add `fontFamily?`; add `background?` only if it hardcodes opaque bg. Defaults = existing.

Note: vite.config.ts, biome.json need NO edits. tsconfig needs ONLY the temporary exclude.

## Files to Create
- `remotion.config.ts` (root):
```ts
import path from "node:path";
import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind-v4";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setStudioPort(3001); // Vite dev owns 3000

Config.overrideWebpackConfig((currentConfig) =>
  enableTailwind({
    ...currentConfig,
    resolve: {
      ...currentConfig.resolve,
      alias: {
        ...currentConfig.resolve?.alias,
        "@": path.join(process.cwd(), "src"),
      },
    },
  }),
);
```
- `src/remotion/styles.css` (NEW) - exactly `@import "tailwindcss";` (mirrors old videos/src/index.css). Root.tsx imports THIS, not app ../styles.css. Gives compositions Tailwind utilities WITHOUT the white-body `@layer base { body { @apply bg-background } }` or the second @fontsource Inter load.
- `src/remotion/index.ts` - copied verbatim: `registerRoot(RemotionRoot)`.
- `src/remotion/Root.tsx` - copied with CSS-import + React.FC->FC fixes.
- `src/remotion/Composition.tsx` - copied placeholder with FC fix, rewritten M4.
- `src/components/remocn/{dynamic-grid,backdrop,micro-scale-fade}.tsx` - generated by shadcn add (M2).

Deletions (M5 ONLY, after all gates + render): FIRST relocate `videos/.agents/skills/remotion-best-practices/` -> root `.agents/skills/remotion-best-practices/`; THEN delete entire `videos/` (package.json, package-lock, node_modules, remotion.config.ts, src incl index.css, README, .gitignore, out/*, eslint.config.mjs, .prettierrc, tsconfig.json); THEN remove the temporary `videos` from tsconfig exclude. M1 baseline commit makes this recoverable.

## Implementation Steps
### M1 - Snapshot + Unify + empirical verify gate
1. Baseline snapshot FIRST: `git add -A && git commit -m "baseline: pre-Remotion-unification snapshot"`. Restore point (node_modules already gitignored).
2. Edit root package.json (pin remotion, add @remotion/cli + @remotion/tailwind-v4, 3 scripts, remove pnpm block). `npm install`.
3. Create root remotion.config.ts (shape above).
4. Create src/remotion/ and COPY (do NOT move - leave videos/ as reference): index.ts (verbatim); Root.tsx (import "./styles.css", import type { FC }, React.FC->FC); Composition.tsx (placeholder; import type { FC }, 5x React.FC->FC). Create src/remotion/styles.css = `@import "tailwindcss";`.
5. Add out/ to .gitignore; add temporary `"exclude": ["videos"]` to tsconfig.json.
6. Type-check gate: `npx tsc -p tsconfig.json --noEmit`. Clean (covers src/ + src/remotion, skips videos/).
7. Config-loads gate (unknown #1): `npm run remotion:studio`. PASS = boots :3001, lists AlfredoIntro, no ESM error. LOW risk (config eval'd CJS, ESM import -> require, type:module bypassed; old videos config ran same shape). Contingency ONLY if fails: async override `overrideWebpackConfig(async (c) => { const { enableTailwind } = await import("@remotion/tailwind-v4"); return enableTailwind({...c, resolve:{...c.resolve, alias:{...c.resolve?.alias, "@": path.join(process.cwd(),"src")}}}); })`. Do NOT rename to .cjs (Remotion auto-discovers only remotion.config.ts). Stop Studio after.
8. Still-render gate: `npm run remotion:still` -> out/AlfredoIntro.png. PASS = placeholder renders (proves unified webpack + enableTailwind + import "./styles.css").
9. Vite-unaffected gate (unknown #2): `npm run dev` (:3000) + `npm run build` (green, no src/remotion traversal). `npm ls react` + `npm ls remotion` each single version (videos/ un-linked, invisible).

### M2 - Install remocn components + Inter
10. From repo root: `npx shadcn add @remocn/dynamic-grid`, `@remocn/backdrop`, `@remocn/micro-scale-fade`. Land in src/components/remocn/. Confirm `git diff package.json` trivial.
11. Add @remotion/google-fonts@4.0.484; `npm install`.

### M3 - Inspect + backward-compatible prop edits
12. Read generated dynamic-grid/backdrop/micro-scale-fade .tsx: confirm export names + prop shapes AND verify each is FRAME-DRIVEN (useCurrentFrame; NO requestAnimationFrame/Date.now/Math.random). M4 prop block is PROVISIONAL pending this.
13. Edit tracking-in.tsx: add background? (default "white") + fontFamily? (default geist).
14. Edit micro-scale-fade.tsx: add fontFamily?; add background? only if hardcodes opaque bg. Defaults = existing.

### M4 - Compose bumper (first real @ alias exercise)
15. Root.tsx: <Composition> width=1280 height=720 fps=30 durationInFrames=135.
16. Rewrite src/remotion/Composition.tsx to the locked design (FC not React.FC), importing via @ alias (props PROVISIONAL pending step 12):
```tsx
import type { FC } from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { Backdrop } from "@/components/remocn/backdrop";
import { DynamicGrid } from "@/components/remocn/dynamic-grid";
import { TrackingIn } from "@/components/remocn/tracking-in";
import { MicroScaleFade } from "@/components/remocn/micro-scale-fade";

const inter = loadFont("normal", { weights: ["500", "700"], subsets: ["latin"] });

export const AlfredoIntro: FC = () => (
  <Backdrop
    padding={0}
    radius={0}
    shadow="none"
    fill={<DynamicGrid background="#0a0a0a" lineColor="rgba(255,255,255,0.05)" speed={0.4} />}
  >
    <AbsoluteFill style={{ transform: "translateY(-56px)", justifyContent: "center", alignItems: "center" }}>
      <Sequence layout="none">
        <TrackingIn text="Alfredo" color="#fafafa" fontWeight={700} fontSize={140} fontFamily={inter.fontFamily} background="transparent" />
      </Sequence>
    </AbsoluteFill>
    <AbsoluteFill style={{ transform: "translateY(76px)", justifyContent: "center", alignItems: "center" }}>
      <Sequence from={24} layout="none">
        <MicroScaleFade text="Ship your new SaaS in minutes." color="#fafafa" fontWeight={500} fontSize={34} fontFamily={inter.fontFamily} />
      </Sequence>
    </AbsoluteFill>
  </Backdrop>
);
```
Delete the four hand-rolled components + SANS/EASE_OUT. Adjust prop names to step 12. If @ alias fails in Remotion webpack, fix ONLY remotion.config.ts alias (step 3).
17. Tune translateY offsets, fontSizes, lineColor alpha against a still until centered/balanced, grid ~0.05. Entrances clamp -> frames ~85-135 auto-hold, hard cut at 135.
18. Type-check gate (NEW): `npx tsc -p tsconfig.json --noEmit`. Clean (Composition rewrite reintroduces FC; nothing else type-checks src/remotion).

### M5 - Final verify + cleanup
19. Still: `npm run remotion:still -- --frame=100 --scale=1` -> inspect out/AlfredoIntro.png (1280x720, mono, no hue).
20. MP4: `npm run remotion:render` -> out/AlfredoIntro.mp4 (1280x720, ~4.5s, reveal->hold->cut).
21. Regression: `npm run build` green; `npm run remotion:studio` still lists AlfredoIntro.
22. Retire legacy (now safe - gates + render green, baseline commit exists): relocate videos/.agents/skills/remotion-best-practices/ -> root .agents/skills/; delete entire videos/; remove temporary `videos` from tsconfig exclude.
23. Cleanup: delete M1 scratch renders in out/; grep src/remotion/Composition.tsx for NO linear-gradient/WebkitBackgroundClip/filter: blur(/interpolate-text. `npm run check` (Biome); final `npx tsc -p tsconfig.json --noEmit` clean with exclude removed and videos/ gone.

## Acceptance
- Studio loads :3001, lists AlfredoIntro (step 7).
- remotion.config.ts loads under type:module - LOW risk CJS eval (step 7).
- still + MP4 render from unified structure (steps 8, 19, 20).
- site works: dev :3000 + build green, no src/remotion traversal (step 9).
- single React + single remotion (step 9); videos/ removed (step 22).
- src/remotion type-checks clean under strict root tsconfig (FC imported) (steps 6, 18).
- generated components frame-driven -> deterministic MP4 (step 12).
- canvas 1280x720 @ 30fps 135f (step 15).
- bumper matches locked design: tracking-in mono #fafafa Inter transparent; micro-scale-fade tagline; Backdrop+DynamicGrid ~0.05 on #0a0a0a; no hue (steps 16-20).
- no hand-rolled gradient/glow/bar: grep clean (step 23).
- tracking-in prop edits backward-compatible (step 13).

## Out of Scope
- @remotion/player / @remotion/renderer + embedding into a route (future; Player import must be true dynamic import).
- Building compositions from the app's Tailwind-classed shared components (enableTailwind + @ alias keep it POSSIBLE; this bumper is inline-styled only).
- Importing app shadcn :root tokens into a composition (src/remotion/styles.css is Tailwind-only for now).
- CI wiring for the gates.

</APPROVED_PLAN>
