<APPROVED_PLAN version="1">

## Approach
Rebuild the `AlfredoIntro` sting by composing four real remocn animation-tier components instead of hand-rolled divs, following the logo-bumper archetype (wordmark build -> hold, mark beat dropped, text-only). `Backdrop` (full-bleed, padding 0) owns the background and renders a near-black `DynamicGrid` with ~5%-alpha lines as its `fill`; on top, two vertically-offset `Sequence`s play `TrackingIn` ("Alfredo") and `MicroScaleFade` ("Ship your new SaaS in minutes."), both mono white (`#fafafa`), holding static into a hard cut at 135f. The accent is the motion, not a hue. Milestone 1 installs the three new components and renders a single background frame to confirm cross-package context (verified-low risk) before the full composition is built.

```
videos/src/Root.tsx -- Composition id="AlfredoIntro"  1280x720 @30fps  durationInFrames=135
        |
        v
videos/src/Composition.tsx   (rewritten - hand-rolled Background/Headline/AccentLine/Tagline deleted)
  loadFont()  // @remotion/google-fonts/Inter - registers "Inter" before render
  <Backdrop padding=0 radius=0 shadow="none"
            fill={<DynamicGrid background="#0a0a0a" lineColor="rgba(255,255,255,0.05)" speed={0.4}/>}>   <- dark fill + faint grid (no glow blobs)
     |- translateY(-56)  <Sequence layout="none">          <TrackingIn  text="Alfredo" color="#fafafa" fontFamily=Inter/>   <- letters focus-in as one unit
     |- translateY(+76)  <Sequence from={24} layout="none"><MicroScaleFade text="Ship your new SaaS in minutes." color="#fafafa" fontFamily=Inter/>   <- calm supporting entrance
  </Backdrop>
  imports <- ../../src/components/remocn/{backdrop,dynamic-grid,tracking-in,micro-scale-fade}   (installed via `shadcn add @remocn/<name>` at repo root)

timeline:  0 -wordmark focus-> 24 -tagline scale-fade-> ~85 -----static lockup hold-----> 135 | hard cut
```

## Plan Breakdown
This swaps the Alfredo intro video's hand-built pieces for real off-the-shelf animation components, keeping the same content: the word "Alfredo" focuses into place, then the line "Ship your new SaaS in minutes." fades in just beneath it, both in plain white on a near-black background carrying a barely-visible moving grid - no colored glows, no rainbow text, no gradient bar. The whole thing runs ~4.5 seconds: reveal, then a still hold, then a clean cut, so it can be dropped in front of other clips as a reusable intro. The video frame also moves to the standard 1280x720 size. For example, a viewer sees a dark frame, "Alfredo" sharpens in, the tagline settles under it, it holds, cut.

`Root sets size+length -> dark grid background -> "Alfredo" focuses in -> tagline fades in -> hold -> cut`

Milestones (advisory, each ends in a render you can eyeball):
1. Install the three new components, switch the canvas to 1280x720, and render one background-only frame to confirm everything wires up across the two projects.
2. Load the Inter font into the video project and render a frame to confirm it shows.
3. Build the real lockup (background + wordmark + tagline with the hold) and delete the old hand-built pieces.
4. Render both a still frame and an MP4 to verify, and clean up the leftover test-render files.

## Files to Modify
- `videos/src/Root.tsx` - change the `<Composition>` to `width={1280} height={720} fps={30} durationInFrames={135}` (from 1920x1080 / 120f). No other change; it already imports `AlfredoIntro` from `./Composition`.
- `videos/src/Composition.tsx` - full rewrite. Delete the hand-rolled `Background` (radial-gradient blur-glow), `Headline` (gradient-clipped text), `AccentLine` (gradient bar), and `Tagline` components plus the `SANS`/`EASE_OUT` constants. Replace `AlfredoIntro` with the `Backdrop > DynamicGrid fill + two offset Sequences` composition shown in `## Approach`; call `loadFont()` at module scope.
- `src/components/remocn/tracking-in.tsx` - minimal, backward-compatible customization (shadcn ownership): add `background?: string` to `TrackingInProps` defaulting to `"white"` and use it for the wrapper `div` background (call site passes `"transparent"` so it composes over `Backdrop`); add `fontFamily?: string` defaulting to the current geist stack and use it on the text `<span>` (call site passes the loaded Inter family). `color` is already a prop. Animation logic (spring tracking collapse + blur clear) untouched.
- `src/components/remocn/micro-scale-fade.tsx` - (after install, see Step 6) read the generated file; apply the same treatment only where it hardcodes values: add `fontFamily?: string` (default = existing) and, only if it hardcodes an opaque background, add `background?: string` (default = existing). Pass `color`, `fontFamily`, and (if added) `background="transparent"` from the call site.
- `videos/package.json` - add `@remotion/google-fonts@4.0.484` (version-matched to `remotion`) via the install in Step 4.
- `.gitignore` - add `videos/out/` so render artifacts never ship (currently untracked-and-committable).

## Files to Create
(the three component files are generated by `shadcn add`, not hand-authored)
- `src/components/remocn/dynamic-grid.tsx` - generated by `shadcn add @remocn/dynamic-grid`. Used as-is via props (`background`, `lineColor`, `speed`); no edit needed.
- `src/components/remocn/backdrop.tsx` - generated by `shadcn add @remocn/backdrop`. Used as-is via props (`fill`, `padding`, `radius`, `shadow`); no edit needed.
- `src/components/remocn/micro-scale-fade.tsx` - generated by `shadcn add @remocn/micro-scale-fade`, then the conditional edit above.

## Implementation Steps
(ordered by dependency; grouped by milestone)

M1 - integration de-risk + canvas
1. From the repo root `/home/alp/dev/projects/alfredo/landing-page` (where `components.json` lives), run: `npx shadcn add @remocn/dynamic-grid`, `npx shadcn add @remocn/backdrop`, `npx shadcn add @remocn/micro-scale-fade`. They land in `src/components/remocn/`. The CLI auto-adds npm deps to root `package.json`; per the registry JSON these pull only `remotion` (already present) and no `registryDependencies`, so expect no other root dep change - confirm `git diff package.json` is empty or trivial.
2. Edit `videos/src/Root.tsx` to `width={1280} height={720} fps={30} durationInFrames={135}`.
3. Gate render: temporarily render the background alone to prove cross-package context resolves. Simplest: in `videos/src/Composition.tsx` temporarily return `<Backdrop fill={<DynamicGrid background="#0a0a0a" lineColor="rgba(255,255,255,0.05)" speed={0.4} />} padding={0} radius={0} shadow="none" />` (imports via the path in Step 5), then run the still command from Step 9 at `--frame=10`. Pass = a 1280x720 near-black grid frame renders with no "context"/"useCurrentFrame outside Sequence" error. Contingency (expected NOT to fire): if it throws a duplicate-instance/context error, wrap `videos/remotion.config.ts`'s `Config.overrideWebpackConfig` to add a `resolve.alias` deduping `remotion`, `react`, `react-dom` to the `videos` instance (`require.resolve(..., { paths: [__dirname] })`), composed with `enableTailwind`, then re-render.

M2 - Inter font
4. From `videos/`, install `@remotion/google-fonts@4.0.484`.
5. In `videos/src/Composition.tsx`, import the four components by plain relative path at depth `../../` (Composition.tsx is at `videos/src/`): `import { Backdrop } from "../../src/components/remocn/backdrop";` and likewise `dynamic-grid` (`DynamicGrid`), `tracking-in` (`TrackingIn`), `micro-scale-fade` (`MicroScaleFade`) - confirm each export name from the generated `.tsx`. Add `import { loadFont } from "@remotion/google-fonts/Inter";` and at module scope `const inter = loadFont();`. Render the gate still again to confirm no font error.

M3 - compose the lockup + cleanup hand-rolled
6. Read the generated `src/components/remocn/micro-scale-fade.tsx` and `src/components/remocn/tracking-in.tsx`; apply the prop edits in `## Files to Modify` (add `background?`/`fontFamily?` only where hardcoded, defaults preserving current behavior).
7. Replace `AlfredoIntro` in `videos/src/Composition.tsx` with the full composition from `## Approach`: `Backdrop` (`padding={0} radius={0} shadow="none"`, `fill={<DynamicGrid background="#0a0a0a" lineColor="rgba(255,255,255,0.05)" speed={0.4} />}`) wrapping two `AbsoluteFill`s - wordmark `transform: translateY(-56px)` holding `<Sequence layout="none"><TrackingIn text="Alfredo" color="#fafafa" fontWeight={700} fontSize={140} fontFamily={inter.fontFamily} background="transparent" /></Sequence>`, and tagline `transform: translateY(76px)` holding `<Sequence from={24} layout="none"><MicroScaleFade text="Ship your new SaaS in minutes." color="#fafafa" fontWeight={500} fontSize={34} fontFamily={inter.fontFamily} /></Sequence>`. Delete the four hand-rolled components and the `SANS`/`EASE_OUT` constants entirely.
8. Tune the two `translateY` offsets, `fontSize`s, and `lineColor` alpha against the still render until the lockup is centered/balanced and the grid is barely-there (~0.05). Entrances clamp, so frames ~85-135 are an automatic static hold ending in a hard cut.

M4 - verify + cleanup
9. Still: from `videos/` run `node_modules/.bin/remotion still src/index.ts AlfredoIntro out/lockup.png --frame=100 --scale=1` (frame 100 = settled lockup; scale 1 = true 1280x720). Inspect the PNG.
10. MP4: from `videos/` run `node_modules/.bin/remotion render src/index.ts AlfredoIntro out/AlfredoIntro.mp4`. Confirm 1280x720, ~4.5s, the reveal->hold->cut reads correctly.
11. Cleanup confirmation: delete the stale tracer renders `videos/out/frame45.png` and the old `videos/out/AlfredoIntro.mp4` (regenerated above); add `videos/out/` to `.gitignore`; confirm `videos/src/Composition.tsx` contains no `interpolate`-based text, no `linear-gradient`, no `background-clip`/`WebkitBackgroundClip`, and no `filter: blur(...)`.

## Acceptance
- Root.tsx Composition is 1280x720 @ 30fps, durationInFrames ~135.
- hand-rolled Background/Headline/AccentLine/Tagline deleted; no gradient text-fill, no large-blur glow wash, no gradient bar anywhere (Step 11 grep: no `linear-gradient`, `WebkitBackgroundClip`, `filter: blur(`).
- wordmark + tagline render via `shadcn add @remocn/<name>` components, not hand-rolled `interpolate`.
- background is a low-opacity DynamicGrid (~0.05) inside Backdrop on a dark fill, no animated glow blobs.
- mono (white wordmark `#fafafa` / near-black `#0a0a0a` bg, no hue).
- verified by rendering BOTH a still and an MP4 with the local binary.

</APPROVED_PLAN>
