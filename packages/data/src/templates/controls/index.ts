import { accessAuthentication } from "./data/access-authentication";
import { accessRemoval } from "./data/access-removal";
import { accessRestrictions } from "./data/access-restrictions";
import { accessRestrictionsForConfidentialData } from "./data/access-restrictions-for-confidential-data";
import { accessReview } from "./data/access-review";
import { accessSecurity } from "./data/access-security";
import { accuracyAndCompleteness } from "./data/accuracy-and-completeness";
import { boardOversight } from "./data/board-oversight";
import { changeManagementRisk } from "./data/change-management-risk";
import { choiceAndConsent } from "./data/choice-and-consent";
import { codeOfConduct } from "./data/code-of-conduct";
import { confidentialDataDisposal } from "./data/confidential-data-disposal";
import { confidentialInformationClassification } from "./data/confidential-information-classification";
import { controlMonitoring } from "./data/control-monitoring";
import { controlSelection } from "./data/control-selection";
import { dataRetentionAndDisposal } from "./data/data-retention-and-disposal";
import { deficiencyManagement } from "./data/deficiency-management";
import { exceptionHandling } from "./data/exception-handling";
import { externalCommunication } from "./data/external-communication";
import { fraudRiskAssessment } from "./data/fraud-risk-assessment";
import { informationAssetChanges } from "./data/information-asset-changes";
import { informationQuality } from "./data/information-quality";
import { infrastructureMonitoring } from "./data/infrastructure-monitoring";
import { inputProcessingAndOutputControls } from "./data/input-processing-and-output-controls";
import { internalCommunication } from "./data/internal-communication";
import { maliciousSoftwarePrevention } from "./data/malicious-software-prevention";
import { managementPhilosophy } from "./data/management-philosophy";
import { organizationalStructure } from "./data/organizational-structure";
import { personnelPolicies } from "./data/personnel-policies";
import { policyImplementation } from "./data/policy-implementation";
import { privacyNotice } from "./data/privacy-notice";
import { riskAssessmentProcess } from "./data/risk-assessment-process";
import { riskIdentification } from "./data/risk-identification";
import { securityEventAnalysis } from "./data/security-event-analysis";
import { securityEventCommunication } from "./data/security-event-communication";
import { securityEventRecovery } from "./data/security-event-recovery";
import { securityEventResponse } from "./data/security-event-response";
import { systemAccountManagement } from "./data/system-account-management";
import { technologyControls } from "./data/technology-controls";
import type { TemplateControl } from "./types";

export const controls = [
	boardOversight,
	managementPhilosophy,
	organizationalStructure,
	personnelPolicies,
	codeOfConduct,
	informationQuality,
	internalCommunication,
	externalCommunication,
	riskAssessmentProcess,
	riskIdentification,
	fraudRiskAssessment,
	changeManagementRisk,
	controlMonitoring,
	deficiencyManagement,
	controlSelection,
	technologyControls,
	policyImplementation,
	accessSecurity,
	accessAuthentication,
	accessRemoval,
	accessReview,
	systemAccountManagement,
	accessRestrictions,
	informationAssetChanges,
	maliciousSoftwarePrevention,
	infrastructureMonitoring,
	securityEventResponse,
	securityEventRecovery,
	securityEventAnalysis,
	securityEventCommunication,
	confidentialInformationClassification,
	accessRestrictionsForConfidentialData,
	confidentialDataDisposal,
	accuracyAndCompleteness,
	inputProcessingAndOutputControls,
	exceptionHandling,
	privacyNotice,
	choiceAndConsent,
	dataRetentionAndDisposal,
] as const satisfies TemplateControl[];
