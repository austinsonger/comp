"use client";

import { useState, useEffect, useRef } from "react";
import { LogoSpinner } from "@/components/logo-spinner";
import { cn } from "@comp/ui/cn";
import { AnimatePresence, motion } from "framer-motion";

interface ValidatingSpinnerProps {
	isValidating: boolean;
	delayMs?: number;
	className?: string;
}

export function ValidatingSpinner({
	isValidating,
	delayMs = 0,
	className,
}: ValidatingSpinnerProps) {
	const [showSpinner, setShowSpinner] = useState(false);
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const minDisplayTimerRef = useRef<NodeJS.Timeout | null>(null);
	const showTimeRef = useRef<number | null>(null);
	const hasShownRef = useRef(false);
	const minDisplayDuration = 800;

	useEffect(() => {
		if (isValidating && !showSpinner) {
			// Clear any existing timers
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}

			// Show spinner after delay
			timerRef.current = setTimeout(() => {
				setShowSpinner(true);
				hasShownRef.current = true;
				showTimeRef.current = Date.now();
			}, delayMs);
		} else if (!isValidating && showSpinner) {
			// For quick validations that trigger a show, keep visible for minimum time
			if (hasShownRef.current) {
				// Check if it's been shown for the minimum duration
				if (showTimeRef.current) {
					const timeVisible = Date.now() - showTimeRef.current;

					if (timeVisible < minDisplayDuration) {
						// Not visible long enough, set timer to hide after remaining time
						if (minDisplayTimerRef.current) {
							clearTimeout(minDisplayTimerRef.current);
						}

						minDisplayTimerRef.current = setTimeout(() => {
							setShowSpinner(false);
							hasShownRef.current = false;
							showTimeRef.current = null;
						}, minDisplayDuration - timeVisible);

						return; // Don't hide yet
					}
				}

				// Already shown for enough time, let AnimatePresence handle the exit animation
				setShowSpinner(false);
				hasShownRef.current = false;
				showTimeRef.current = null;
			}
		}

		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
			if (minDisplayTimerRef.current) {
				clearTimeout(minDisplayTimerRef.current);
			}
		};
	}, [isValidating, showSpinner, delayMs, minDisplayDuration]);

	return (
		<AnimatePresence>
			{showSpinner && (
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.9 }}
					transition={{
						duration: 0.5,
						ease: "easeInOut",
						exit: { duration: 0.5 },
					}}
				>
					<LogoSpinner
						className={cn("h-6 w-6 text-muted-foreground", className)}
					/>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
