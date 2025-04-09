import { getI18n } from "@/locales/server";

export async function getServerColumnHeaders() {
	const t = await getI18n();

	return {
		title: t("risk.register.table.risk"),
		status: t("common.table.status"),
		department: t("common.filters.department"),
		assigneeId: t("common.assignee.label"),
	};
}
