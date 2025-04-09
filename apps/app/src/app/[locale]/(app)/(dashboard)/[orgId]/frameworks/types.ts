import {
	Artifact,
	Control,
	Evidence,
	FrameworkInstance,
	Policy,
	RequirementMap,
} from "@comp/db/types";

export type FrameworkInstanceWithControls = FrameworkInstance & {
	controls: (Control & {
		artifacts: (Artifact & {
			policy: Policy | null;
			evidence: Evidence | null;
		})[];
		requirementsMapped: RequirementMap[];
	})[];
};
