import { useI18n } from "@/locales/client";
import { cn } from "@comp/ui/cn";

export const STATUS_TYPES = [
	"draft",
	"published",
	"archived",
	"needs_review",
	"relevant",
	"not-relevant",
] as const;

export type StatusType = (typeof STATUS_TYPES)[number];

const STATUS_COLORS: Record<StatusType, string> = {
	published: "#00DC73",
	relevant: "#00DC73",
	draft: "#ffc107",
	archived: "#0ea5e9",
	needs_review: "#ff0000",
	"not-relevant": "#ff0000",
} as const;

// Map status types to translation keys
const getStatusTranslation = (
	status: StatusType,
	t: ReturnType<typeof useI18n>,
) => {
	switch (status) {
		case "draft":
			return t("policies.status.draft");
		case "published":
			return t("policies.status.published");
		case "archived":
			return t("policies.status.archived");
		case "needs_review":
			return t("policies.status.needs_review");
		case "relevant":
			return t("policies.status.relevant");
		case "not-relevant":
			return t("policies.status.not-relevant");
		default:
			return status;
	}
};

export function StatusPolicies({
	status,
	className,
	withLabel = true,
}: {
	status: StatusType;
	className?: string;
	withLabel?: boolean;
}) {
	const t = useI18n();

	return (
		<div className={cn("flex items-center gap-2", className)}>
			<div
				className={cn("size-2.5")}
				style={{ backgroundColor: STATUS_COLORS[status] ?? "  " }}
			/>
			{withLabel ? getStatusTranslation(status, t) : null}
		</div>
	);
}
