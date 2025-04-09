"use client";

import { useState, useEffect, useRef } from "react";
import NumberFlow, { continuous } from "@number-flow/react";
import { useDebounce } from "use-debounce";

interface FullScreenNumberAnimationProps {
	total: number;
}

const EFFECT_DURATION = 7000;

// Radial pulse effect
function PulseEffect() {
	return (
		<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
			<div className="w-40 h-40 rounded-full bg-primary animate-pulse-out" />
		</div>
	);
}

export function FullScreenNumberAnimation({
	total,
}: FullScreenNumberAnimationProps) {
	const [isVisible, setIsVisible] = useState(false);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const [animationValue, setAnimationValue] = useState(total);
	const [showEffects, setShowEffects] = useState(false);
	const prevTotalRef = useRef(total);
	const animationCompleteRef = useRef(false);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	// Debounce value changes to handle rapid updates
	const [debouncedTotal] = useDebounce(total, 300);

	// Initialize audio element
	useEffect(() => {
		// Create audio element only on client side
		if (typeof window !== "undefined") {
			audioRef.current = new Audio("/pulse.mp3");
			audioRef.current.preload = "auto";
		}

		return () => {
			// Cleanup
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current = null;
			}
		};
	}, []);

	// Play sound effect
	const playSound = () => {
		if (audioRef.current) {
			// Reset to beginning if already playing
			audioRef.current.currentTime = 0;

			// Play the sound with a promise to handle autoplay restrictions
			const playPromise = audioRef.current.play();

			if (playPromise !== undefined) {
				playPromise.catch((error) => {
					console.error("Audio playback failed:", error);
				});
			}
		}
	};

	// Add custom animations to global styles
	useEffect(() => {
		const style = document.createElement("style");
		style.textContent = `
			@keyframes pulse-out {
				0% { transform: scale(0.5); opacity: 0.7; }
				100% { transform: scale(4); opacity: 0; }
			}
			.animate-pulse-out {
				animation: pulse-out 2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
			}
		`;
		document.head.appendChild(style);

		return () => {
			try {
				document.head.removeChild(style);
			} catch (e) {
				console.error("Error removing style", e);
			}
		};
	}, []);

	// When debounced total changes, trigger the animation sequence
	useEffect(() => {
		if (debouncedTotal === prevTotalRef.current) return;

		// Reset animation state
		animationCompleteRef.current = false;

		// Step 1: Show the fullscreen with previous value
		setAnimationValue(prevTotalRef.current);
		setIsVisible(true);
		setShowEffects(false);

		// Step 2: After a delay, start the number transition
		const startTransitionTimer = setTimeout(() => {
			setIsTransitioning(true);
			setAnimationValue(debouncedTotal);

			// Show visual effects when number starts transitioning
			setTimeout(() => {
				setShowEffects(true);
				// Play sound when effects are shown
				playSound();
			}, 100);
		}, 500);

		// Step 3: Hide fullscreen after animation and a brief pause
		const hideTimer = setTimeout(() => {
			// Only hide if animation has completed
			if (animationCompleteRef.current) {
				setIsVisible(false);
				setIsTransitioning(false);
				setShowEffects(false);
				prevTotalRef.current = debouncedTotal;
			}
		}, EFFECT_DURATION);

		return () => {
			clearTimeout(startTransitionTimer);
			clearTimeout(hideTimer);
		};
	}, [debouncedTotal]);

	// Do not render anything if not visible
	if (!isVisible) {
		return null;
	}

	// Render the full-screen animation overlay
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in-0 duration-300 overflow-hidden">
			{showEffects && <PulseEffect />}

			<div className="text-9xl font-bold text-primary font-variant-numeric-tabular relative z-10">
				<NumberFlow
					value={animationValue}
					plugins={[continuous]}
					animated={isTransitioning}
					transformTiming={{
						duration: 1200,
						easing: "cubic-bezier(0.25, 1, 0.5, 1)",
					}}
					spinTiming={{
						duration: 1500,
						easing: "cubic-bezier(0.16, 1, 0.3, 1)",
					}}
					willChange={true}
					respectMotionPreference={true}
					onAnimationsFinish={(e) => {
						// Mark animation as complete
						if (isTransitioning && animationValue === debouncedTotal) {
							animationCompleteRef.current = true;

							// If we're past the hide timer duration, hide now
							const timeElapsed =
								Date.now() -
								(prevTotalRef.current !== debouncedTotal
									? Date.now() - EFFECT_DURATION
									: 0);
							if (timeElapsed >= EFFECT_DURATION) {
								setIsVisible(false);
								setIsTransitioning(false);
								setShowEffects(false);
								prevTotalRef.current = debouncedTotal;
							}
						}
					}}
				/>
			</div>
		</div>
	);
}
