"use client";

import { Icons } from "@comp/ui/icons";
import { cn } from "@comp/ui/cn";
import Link from "next/link";

interface SidebarLogoProps {
	isCollapsed: boolean;
	organizationId: string;
}

export function SidebarLogo({ isCollapsed, organizationId }: SidebarLogoProps) {
	return (
		<div className={cn("transition-all duration-300 flex items-center")}>
			<Link href={`/${organizationId}`}>
				<Icons.Logo
					width={45}
					height={45}
					className={cn("transition-transform duration-300")}
				/>
			</Link>
		</div>
	);
}
