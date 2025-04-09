import { SingleFrameworkRequirements } from "../types";
import { soc2RequirementIds } from "./soc2.types";

export const soc2Requirements: SingleFrameworkRequirements<soc2RequirementIds> =
	{
		CC1: {
			name: "CC1: Control Environment",
			description:
				"This criterion ensures that the organization demonstrates commitment to integrity and ethical values, establishes board oversight, creates appropriate organizational structures, and shows commitment to competence.",
		},
		CC2: {
			name: "CC2: Communication and Information",
			description:
				"This criterion focuses on how the organization obtains and uses relevant quality information to support the functioning of internal control, and communicates internal control information internally and externally.",
		},
		CC3: {
			name: "CC3: Risk Assessment",
			description:
				"This criterion evaluates how the organization specifies suitable objectives, identifies and analyzes risk, and assesses fraud risk and significant change that could impact the system of internal control.",
		},
		CC4: {
			name: "CC4: Monitoring Activities",
			description:
				"This criterion assesses how the organization selects, develops and performs ongoing evaluations to determine whether controls are present and functioning, and communicates internal control deficiencies.",
		},
		CC5: {
			name: "CC5: Control Activities",
			description:
				"This criterion evaluates how the organization selects and develops control activities that contribute to the mitigation of risks, and deploys them through policies and procedures.",
		},
		CC6: {
			name: "CC6: Logical and Physical Access Controls",
			description:
				"This criterion focuses on how the organization implements controls over system boundaries, user identification and authentication, data security, and physical access to facilities and assets.",
		},
		CC7: {
			name: "CC7: System Operations",
			description:
				"This criterion assesses how the organization manages system operations, detects and mitigates processing deviations, and implements recovery plans and business continuity procedures.",
		},
		CC8: {
			name: "CC8: Change Management",
			description:
				"This criterion evaluates how the organization manages changes to infrastructure, data, software and procedures including change authorization and documentation.",
		},
		CC9: {
			name: "CC9: Risk Mitigation",
			description:
				"This criterion assesses how the organization identifies, selects and develops risk mitigation activities for risks arising from potential business disruptions and the use of vendors and business partners.",
		},
		A1: {
			name: "A1: Availability",
			description:
				"This criterion ensures that systems and data are available for operation and use as committed or agreed, including availability of information processing facilities and backup capabilities.",
		},
		C1: {
			name: "C1: Confidentiality",
			description:
				"This criterion ensures that information designated as confidential is protected according to policy and procedures as committed or agreed, including encryption, access controls and secure disposal.",
		},
		PI1: {
			name: "PI1: Processing Integrity",
			description:
				"This criterion ensures that system processing is complete, valid, accurate, timely and authorized to meet the entity's objectives.",
		},
		P1: {
			name: "P1: Privacy",
			description:
				"This criterion ensures that personal information is collected, used, retained, disclosed and disposed of in conformity with commitments in the entity's privacy notice and criteria set forth in Generally Accepted Privacy Principles.",
		},
	} as const;
