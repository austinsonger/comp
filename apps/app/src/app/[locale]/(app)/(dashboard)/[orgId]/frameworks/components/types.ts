import type {
	Evidence,
	FrameworkInstance,
	IntegrationResult,
	Policy,
} from "@comp/db/types";
import { FrameworkInstanceWithControls } from "../types";

export interface ComplianceScoresProps {
	policiesCompliance: number;
	evidenceTasksCompliance: number;
	cloudTestsCompliance: number;
	overallCompliance: number;
	frameworkCompliance: {
		id: string;
		name: string;
		compliance: number;
	}[];
	policies: Policy[];
	evidenceTasks: Evidence[];
	tests: IntegrationResult[];
}

export interface FrameworkWithCompliance {
	framework: FrameworkInstance;
	compliance: number;
}

export interface FrameworkInstanceWithComplianceScore {
	frameworkInstance: FrameworkInstanceWithControls;
	complianceScore: number;
}
