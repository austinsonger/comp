"use server";

import { auth } from "@/utils/auth";
import { db } from "@comp/db";
import { Artifact, Evidence, Policy } from "@comp/db/types";
import { headers } from "next/headers";
import { cache } from "react";

interface GetRelatedArtifactsParams {
	organizationId: string;
	controlId: string;
}

export const getRelatedArtifacts = cache(
	async ({
		organizationId,
		controlId,
	}: GetRelatedArtifactsParams): Promise<
		(Artifact & {
			evidence: Evidence | null;
			policy: Policy | null;
		})[]
	> => {
		try {
			const session = await auth.api.getSession({
				headers: await headers(),
			});

			if (!session || !session.session.activeOrganizationId) {
				return [];
			}

			// Fetch the control with its artifacts
			const control = await db.control.findUnique({
				where: {
					id: controlId,
					organizationId: organizationId,
				},
				include: {
					artifacts: {
						include: {
							policy: true,
							evidence: true,
						},
					},
				},
			});

			if (!control || !control.artifacts) {
				return [];
			}

			// Transform the artifacts into the format expected by the UI
			return control.artifacts;
		} catch (error) {
			console.error("Error fetching Linked Artifacts:", error);
			return [];
		}
	},
);
