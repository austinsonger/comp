"use client";

import { useSearchParams } from "next/navigation";

/**
 * Custom hook to generate the SWR key for analytics endpoints,
 * automatically appending the 'secret' query parameter if present.
 * Returns null if the secret is not found, preventing SWR from fetching.
 *
 * @param apiEndpointBase The base path of the API endpoint (e.g., '/api/internal/dashboard/analytics/evidence')
 * @returns The SWR key (URL string with secret or null)
 */
export function useAnalyticsSWRKeyWithSecret(
	apiEndpointBase: string,
): string | null {
	const searchParams = useSearchParams();
	const secret = searchParams.get("secret");

	if (!secret) {
		return null; // Don't fetch if secret is missing
	}

	// Construct the key with the secret
	return `${apiEndpointBase}?secret=${encodeURIComponent(secret)}`;
}
