import { db } from "@comp/db";
import { logger, schedules } from "@trigger.dev/sdk/v3";
import { sendIntegrationResults } from "./integration-results";

export const sendIntegrationSchedule = schedules.task({
	id: "integration-schedule",
	cron: "0 0 * * *",
	maxDuration: 1000 * 60 * 10, // 10 minutes
	run: async () => {
		const now = new Date();
		const upcomingThreshold = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

		logger.info(
			`Sending integration runs from now: ${now} to ${upcomingThreshold}`,
		);

		const integrations = await db.integration.findMany({
			select: {
				id: true,
				name: true,
				integrationId: true,
				settings: true,
				userSettings: true,
				organization: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		});

		const triggerPayloads = integrations.map((integration) => ({
			payload: {
				integration: {
					id: integration.id,
					name: integration.name,
					integration_id: integration.integrationId,
					settings: integration.settings,
					user_settings: integration.userSettings,
					organization: integration.organization,
				},
			},
		}));

		if (triggerPayloads.length > 0) {
			try {
				await sendIntegrationResults.batchTrigger(triggerPayloads);

				logger.info(`Triggered ${triggerPayloads.length} integration runs`);
			} catch (error) {
				logger.error(`Failed to trigger batch runs: ${error}`);

				return {
					success: false,
					totalIntegrations: integrations.length,
					triggeredIntegrations: triggerPayloads.length,
					error: error instanceof Error ? error.message : String(error),
				};
			}
		}

		return {
			success: true,
			totalIntegrations: integrations.length,
			triggeredIntegrations: triggerPayloads.length,
		};
	},
});
