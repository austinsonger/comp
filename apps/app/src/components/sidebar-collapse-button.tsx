"use client";

import { updateSidebarState } from "@/actions/sidebar";
import { useSidebar } from "@/context/sidebar-context";
import { Button } from "@comp/ui/button";
import { Icons } from "@comp/ui/icons";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { cn } from "@comp/ui/cn";

interface SidebarCollapseButtonProps {
	isCollapsed: boolean;
}

export function SidebarCollapseButton({
	isCollapsed,
}: SidebarCollapseButtonProps) {
	const router = useRouter();
	const { setIsCollapsed } = useSidebar();

	const { execute } = useAction(updateSidebarState, {
		onSuccess: () => {
			router.refresh();
		},
	});

	const handleToggle = () => {
		// Update local state immediately for responsive UI
		setIsCollapsed(!isCollapsed);
		// Update server state (cookie)
		execute({ isCollapsed: !isCollapsed });
	};

	if (isCollapsed) {
		return (
			<Button
				variant="ghost"
				size="sm"
				className="h-8 w-8 rounded-none shadow-md bg-background"
				onClick={handleToggle}
			>
				<Icons.ChevronRight className="h-4 w-4 flex-shrink-0" />
			</Button>
		);
	}

	return (
		<Button
			variant="ghost"
			size="icon"
			className="h-8 w-8"
			onClick={handleToggle}
		>
			<Icons.ChevronLeft className="h-4 w-4" />
		</Button>
	);
}
