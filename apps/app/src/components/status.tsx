import { useI18n } from "@/locales/client";
import { cn } from "@comp/ui/cn";

export const STATUS_TYPES = ["open", "pending", "closed", "archived"] as const;

export type StatusType = (typeof STATUS_TYPES)[number];

const STATUS_COLORS: Record<StatusType, string> = {
	open: "#ffc107",
	pending: "#0ea5e9",
	closed: "#00DC73",
	archived: "#64748b",
} as const;

export function Status({
	status,
	noLabel,
}: { status: StatusType; noLabel?: boolean }) {
	const t = useI18n();

	return (
		<div className="flex items-center gap-2">
			<div
				className={cn("size-2.5")}
				style={{ backgroundColor: STATUS_COLORS[status] ?? "  " }}
			/>
			{!noLabel && t(`common.status.${status}`)}
		</div>
	);
}
