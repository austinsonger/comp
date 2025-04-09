import { useI18n } from "@/locales/client";

type StatusType = "upToDate" | "needsReview" | "draft" | "empty";

/**
 * Custom hook for evidence status translations
 */
export function useStatusTranslation() {
	const t = useI18n();

	/**
	 * Get translated status label
	 */
	const getStatusLabel = (status: StatusType): string => {
		switch (status) {
			case "upToDate":
				return t("evidence.status.up_to_date");
			case "needsReview":
				return t("evidence.status.needs_review");
			case "draft":
				return t("evidence.status.draft");
			case "empty":
				return t("evidence.status.empty");
			default:
				return status;
		}
	};

	return {
		getStatusLabel,
	};
}
