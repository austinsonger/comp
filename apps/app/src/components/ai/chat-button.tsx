"use client";

import { Button } from "@comp/ui/button";
import { useMediaQuery } from "@comp/ui/hooks";
import { useQueryState } from "nuqs";

export function AssistantButton() {
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const [, setAssistantOpen] = useQueryState("assistant", {
		history: "push",
		parse: (value) => value === "true",
		serialize: (value) => value.toString(),
	});

	if (!isDesktop) {
		return null;
	}

	return (
		<Button
			variant="outline"
			className="relative min-w-[250px] w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64 border-0 p-0 hover:bg-transparent font-normal no-drag"
			onClick={() => setAssistantOpen(true)}
		>
			<span className="ml-4 md:ml-0">Ask Comp AI a question...</span>
			<kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 border bg-accent px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
				<span className="text-xs">⌘</span>K
			</kbd>
		</Button>
	);
}
