"use client";

import { Button } from "@comp/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { PolicyCard } from "./PolicyCard";
import type { Policy, Member } from "@comp/db/types";
import { useAction } from "next-safe-action/hooks";
import { markPolicyAsCompleted } from "../../actions/markPolicyAsCompleted";
import { toast } from "sonner";

interface PolicyCarouselProps {
	policies: Policy[];
	member: Member;
	initialIndex?: number;
	onIndexChange?: (index: number) => void;
}

export function PolicyCarousel({
	policies,
	member,
	initialIndex = 0,
	onIndexChange,
}: PolicyCarouselProps) {
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [currentIndex, setCurrentIndex] = useState(initialIndex);
	const onCompletePolicy = useAction(markPolicyAsCompleted, {
		onSuccess: () => {
			toast.success("Policy completed");
		},
		onError: () => {
			toast.error("Failed to complete policy");
		},
	});

	const scrollToIndex = (index: number) => {
		if (!scrollContainerRef.current) return;
		const container = scrollContainerRef.current;
		const itemWidth = container.clientWidth;
		container.scrollTo({
			left: index * itemWidth,
			behavior: "instant",
		});
		setCurrentIndex(index);
		onIndexChange?.(index);
	};

	useEffect(() => {
		// Scroll to initial index without animation on mount
		if (scrollContainerRef.current && initialIndex > 0) {
			const container = scrollContainerRef.current;
			const itemWidth = container.clientWidth;
			container.scrollTo({
				left: initialIndex * itemWidth,
				behavior: "instant",
			});
		}
	}, [initialIndex]);

	const handleScroll = () => {
		if (!scrollContainerRef.current) return;
		const container = scrollContainerRef.current;
		const scrollPosition = container.scrollLeft;
		const itemWidth = container.clientWidth;
		const newIndex = Math.round(scrollPosition / itemWidth);
		setCurrentIndex(newIndex);
		onIndexChange?.(newIndex);
	};

	const handlePrevious = () => {
		if (currentIndex > 0) {
			scrollToIndex(currentIndex - 1);
		}
	};

	const handleNext = () => {
		if (currentIndex < policies.length - 1) {
			scrollToIndex(currentIndex + 1);
		}
	};

	return (
		<div className="w-full space-y-4">
			<div
				ref={scrollContainerRef}
				className="flex overflow-x-hidden snap-x snap-mandatory scroll-smooth"
				onScroll={handleScroll}
			>
				{policies.map((policy) => (
					<div key={policy.id} className="flex-none w-full snap-center">
						<PolicyCard
							policy={policy}
							onNext={handleNext}
							onComplete={() =>
								onCompletePolicy.execute({ policyId: policy.id })
							}
							onClick={() => handleNext()}
							member={member}
							isLastPolicy={currentIndex === policies.length - 1}
						/>
					</div>
				))}
			</div>
			<div className="flex items-center justify-between">
				<Button
					variant="outline"
					size="icon"
					onClick={handlePrevious}
					disabled={currentIndex === 0}
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>
				<span className="text-sm text-muted-foreground">
					Policy {currentIndex + 1} of {policies.length}
				</span>
				<Button
					variant="outline"
					size="icon"
					onClick={handleNext}
					disabled={currentIndex === policies.length - 1}
				>
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
