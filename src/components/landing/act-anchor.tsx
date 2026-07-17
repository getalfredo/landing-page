// Shared act-video mount per issue-15: the approved wiring loop rendered to
// video at build, mounted below the act copy in console-glass framing (the
// compositions carry their own bezel chrome inside the frame, so the web
// glass stays a plain mount — no captions, no SIMULATED etch). Playing
// loops pause off-viewport; prefers-reduced-motion swaps the video for the
// claim-carrying static frame.
import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "#/components/landing/use-prefers-reduced-motion";

export function ActAnchor({
	src,
	poster,
	reducedSrc,
	label,
}: {
	src: string;
	poster: string;
	reducedSrc: string;
	label: string;
}) {
	const reduced = usePrefersReducedMotion();
	const videoRef = useRef<HTMLVideoElement>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: the video element mounts/unmounts when `reduced` flips, so the observer must re-attach
	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;
		const io = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					video.play().catch(() => {});
				} else {
					video.pause();
				}
			},
			{ threshold: 0.2 },
		);
		io.observe(video);
		return () => io.disconnect();
	}, [reduced]);

	return (
		<div className="lp-anchor">
			{reduced ? (
				<img className="lp-anchor-media" src={reducedSrc} alt={label} />
			) : (
				<video
					className="lp-anchor-media"
					ref={videoRef}
					src={src}
					poster={poster}
					preload="metadata"
					muted
					loop
					playsInline
					aria-label={label}
				/>
			)}
		</div>
	);
}
