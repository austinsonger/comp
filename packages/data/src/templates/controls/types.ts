import { FrameworkId } from "../../static/frameworks/types";
import { AllRequirementIdsByFramework } from "../../static/requirements/types";
import { TemplateEvidenceId } from "../evidence";
import { TemplatePolicyId } from "../policies";

/**
 * Represents an artifact associated with a control
 * that can be used to demonstrate compliance.
 */
export type TemplateArtifact =
	| {
			type: "policy";
			policyId: TemplatePolicyId;
	  }
	| {
			type: "evidence";
			evidenceId: TemplateEvidenceId;
	  };

/**
 * Represents a requirement that a control addresses.
 */
export type TemplateRequirement<T extends FrameworkId = FrameworkId> = {
	frameworkId: T;
	requirementId: AllRequirementIdsByFramework[T];
};

/**
 * Represents a security or compliance control that organizations
 * implement to address specific requirements.
 */
export interface TemplateControl {
	/** Unique identifier for the control */
	id: string;
	/** Display name of the control */
	name: string;
	/** Detailed explanation of what this control entails */
	description: string;
	/** List of artifacts used to demonstrate implementation of this control */
	mappedArtifacts: TemplateArtifact[];
	/** List of requirements this control addresses */
	mappedRequirements: TemplateRequirement[];
}
