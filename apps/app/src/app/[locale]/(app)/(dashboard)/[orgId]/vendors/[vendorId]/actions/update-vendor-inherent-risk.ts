"use server";

import { db } from "@comp/db";
import { appErrors } from "@/lib/errors";
import type { ActionResponse } from "@/types/actions";
import { createSafeActionClient } from "next-safe-action";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Impact, Likelihood } from "@prisma/client";

const schema = z.object({
	vendorId: z.string(),
	inherentProbability: z.nativeEnum(Likelihood),
	inherentImpact: z.nativeEnum(Impact),
});

export const updateVendorInherentRisk = createSafeActionClient()
	.schema(schema)
	.action(async ({ parsedInput }): Promise<ActionResponse> => {
		try {
			await db.vendor.update({
				where: { id: parsedInput.vendorId },
				data: {
					inherentProbability: parsedInput.inherentProbability,
					inherentImpact: parsedInput.inherentImpact,
				},
			});

			revalidatePath(`/vendors/${parsedInput.vendorId}`);

			return { success: true };
		} catch (error) {
			return {
				success: false,
				error:
					error instanceof Error ? error.message : appErrors.UNEXPECTED_ERROR,
			};
		}
	});
