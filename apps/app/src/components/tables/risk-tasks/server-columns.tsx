import { getI18n } from "@/locales/server";

export async function getServerColumnHeaders() {
	const t = await getI18n();

	return {
		title: t("risk.tasks.title"),
		status: t("common.table.status"),
		assigneeId: t("common.assignee.label"),
	};
}
