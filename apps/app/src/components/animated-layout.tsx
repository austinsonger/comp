import { cn } from "@comp/ui/cn";

interface AnimatedLayoutProps {
	children: React.ReactNode;
	sidebar: React.ReactNode;
	isCollapsed: boolean;
}

export function AnimatedLayout({
	children,
	sidebar,
	isCollapsed,
}: AnimatedLayoutProps) {
	return (
		<div className="flex h-screen w-full overflow-hidden">
			<div
				className={cn(
					"flex-shrink-0 border-r bg-background duration-300 ease-in-out hidden md:block",
					isCollapsed ? "w-[80px]" : "w-[240px]",
				)}
			>
				{sidebar}
			</div>
			<div className="flex-1 overflow-auto">{children}</div>
		</div>
	);
}
