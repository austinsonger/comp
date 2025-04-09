import { accessControlPolicy } from "./data/access-control.policy";
import { applicationSecurityPolicy } from "./data/application-security.policy";
import { availabilityPolicy } from "./data/availability.policy";
import { businessContinuityPolicy } from "./data/business-continuity.policy";
import { changeManagementPolicy } from "./data/change-management.policy";
import { classificationPolicy } from "./data/classification.policy";
import { codeOfConductPolicy } from "./data/code-of-conduct.policy";
import { confidentialityPolicy } from "./data/confidentiality.policy";
import { corporateGovernancePolicy } from "./data/corporate-governance.policy";
import { cyberRiskPolicy } from "./data/cyber-risk.policy";
import { dataCenterPolicy } from "./data/data-center.policy";
import { dataClassificationPolicy } from "./data/data-classification.policy";
import { disasterRecoveryPolicy } from "./data/disaster_recovery.policy";
import { humanResourcesPolicy } from "./data/human_resources.policy";
import { incidentResponsePolicy } from "./data/incident_response.policy";
import { informationSecurityPolicy } from "./data/information-security.policy";
import { passwordPolicy } from "./data/password-policy.policy";
import { privacyPolicy } from "./data/privacy.policy";
import { riskAssessmentPolicy } from "./data/risk-assessment.policy";
import { riskManagementPolicy } from "./data/risk-management.policy";
import { softwareDevelopmentPolicy } from "./data/software-development.policy";
import { systemChangePolicy } from "./data/system-change.policy";
import { thirdPartyPolicy } from "./data/thirdparty.policy";
import { vendorRiskManagementPolicy } from "./data/vendor-risk-management.policy";
import { workstationPolicy } from "./data/workstation.policy";
import type { TemplatePolicy } from "./types";

export const policies = {
	access_control_policy: accessControlPolicy,
	application_security_policy: applicationSecurityPolicy,
	availability_policy: availabilityPolicy,
	business_continuity_policy: businessContinuityPolicy,
	change_management_policy: changeManagementPolicy,
	classification_policy: classificationPolicy,
	code_of_conduct_policy: codeOfConductPolicy,
	confidentiality_policy: confidentialityPolicy,
	corporate_governance_policy: corporateGovernancePolicy,
	cyber_risk_policy: cyberRiskPolicy,
	data_center_policy: dataCenterPolicy,
	data_classification_policy: dataClassificationPolicy,
	disaster_recovery_policy: disasterRecoveryPolicy,
	human_resources_policy: humanResourcesPolicy,
	incident_response_policy: incidentResponsePolicy,
	information_security_policy: informationSecurityPolicy,
	password_policy: passwordPolicy,
	privacy_policy: privacyPolicy,
	risk_assessment_policy: riskAssessmentPolicy,
	risk_management_policy: riskManagementPolicy,
	software_development_policy: softwareDevelopmentPolicy,
	system_change_policy: systemChangePolicy,
	third_party_policy: thirdPartyPolicy,
	vendor_risk_management_policy: vendorRiskManagementPolicy,
	workstation_policy: workstationPolicy,
} as const satisfies Record<string, TemplatePolicy>;

export type TemplatePolicyId = keyof typeof policies;
