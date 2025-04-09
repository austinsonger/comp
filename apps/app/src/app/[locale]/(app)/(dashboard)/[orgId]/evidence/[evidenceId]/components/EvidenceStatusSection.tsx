import { EvidenceStatus } from "@comp/db/types";
import { cn } from "@comp/ui/cn";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@comp/ui/select";
import { EVIDENCE_STATUS_HEX_COLORS } from "../../(overview)/constants/evidence-status";

const statusOptions: { value: EvidenceStatus; label: string }[] = [
	{ value: "draft", label: "Draft" },
	{ value: "published", label: "Published" },
	{ value: "not_relevant", label: "Not Relevant" },
];

export const EvidenceStatusSection = ({
	status,
	handleStatusChange,
	isSaving,
}: {
	status: EvidenceStatus;
	handleStatusChange: (value: EvidenceStatus) => void;
	isSaving: boolean;
}) => {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-2 mb-1.5">
				<span className="font-medium">Status</span>
			</div>
			<Select
				value={status}
				onValueChange={handleStatusChange}
				disabled={isSaving}
			>
				<SelectTrigger className="w-full h-9 text-sm">
					<SelectValue>
						<div className={cn("flex items-center gap-2")}>
							<div
								className={cn("size-2.5")}
								style={{
									backgroundColor: EVIDENCE_STATUS_HEX_COLORS[status] ?? "  ",
								}}
							/>
							{status
								.split("_")
								.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
								.join(" ")}
						</div>
					</SelectValue>
				</SelectTrigger>
				<SelectContent>
					{statusOptions.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							<div className={cn("flex items-center gap-2")}>
								<div
									className={cn("size-2.5")}
									style={{
										backgroundColor:
											EVIDENCE_STATUS_HEX_COLORS[option.value] ?? "  ",
									}}
								/>
								{option.label}
							</div>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};
