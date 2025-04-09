import { useEffect, useRef, useState } from "react";

/**
 * Custom hook to track scroll position in a container
 * Returns ref to attach to scrollable element and scroll state indicators
 */
export function useScrollPosition() {
	const containerRef = useRef<HTMLDivElement>(null);
	const [canScrollDown, setCanScrollDown] = useState(false);
	const [canScrollUp, setCanScrollUp] = useState(false);

	const checkScrollPosition = () => {
		if (!containerRef.current) return;

		const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
		setCanScrollDown(scrollTop + clientHeight < scrollHeight - 10);
		setCanScrollUp(scrollTop > 10);
	};

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		container.addEventListener("scroll", checkScrollPosition);
		checkScrollPosition();
		const timer = setTimeout(checkScrollPosition, 100);

		return () => {
			container.removeEventListener("scroll", checkScrollPosition);
			clearTimeout(timer);
		};
	}, []);

	useEffect(() => {
		window.addEventListener("resize", checkScrollPosition);
		return () => window.removeEventListener("resize", checkScrollPosition);
	}, []);

	return {
		containerRef,
		canScrollDown,
		canScrollUp,
		checkScrollPosition,
	};
}
