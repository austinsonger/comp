export * from "./data/soc2";

import { soc2Requirements } from "./data/soc2";
import { AllRequirements } from "./types";

export const requirements: AllRequirements = {
	soc2: soc2Requirements,
	// iso27001: {},
	// gdpr: {},
} as const;
