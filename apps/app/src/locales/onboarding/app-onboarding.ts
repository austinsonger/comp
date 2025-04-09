export const app_onboarding = {
	risk_management: {
		title: "Risk Management",
		description: "Manage your risks and ensure your organization is protected.",
		detailed_description:
			"Create and manage your risks in one place. Add details, assign owners, and track progress.",
		cta: "Create your first risk",
		learn_more: "Learn more",
		faqs: {
			question_1: "What is risk management?",
			answer_1:
				"Risk management is the process of identifying, assessing, and mitigating risks.",
			question_2: "Why should I manage risks?",
			answer_2:
				"Risks can impact your organization's operations, reputation, and financial stability. By managing risks, you can reduce the likelihood of negative events and protect your organization.",
			question_3: "Do I need to manage risks for SOC 2?",
			answer_3:
				"Yes, you need to manage risks for SOC 2 and other frameworks. Risk management is a key component of SOC 2 compliance.",
		},
	},
	vendors: {
		title: "Vendor Management",
		description:
			"Manage your vendors and ensure your organization is protected.",
		cta: "Add your first vendor",
		learn_more: "Learn more",
		faqs: {
			question_1: "What is a vendor?",
			answer_1:
				"A vendor is a third-party organization that provides services to your organization.",
			question_2: "Why should I manage vendors?",
			answer_2:
				"Vendors can impact your organization's operations, reputation, and financial stability. By managing vendors, you can reduce the likelihood of negative events and protect your organization.",
			question_3: "Do I need to manage vendors for SOC 2?",
			answer_3:
				"Yes, you need to manage vendors for SOC 2 and other frameworks. Vendor management is a key component of SOC 2 compliance.",
		},
	},
	employees: {
		title: "Employee Management",
		description:
			"Manage your employees and ensure your organization is protected.",
		cta: "Add your first employee",
		learn_more: "Learn more",
		faqs: {
			question_1: "What is employee management?",
			answer_1:
				"Employee management is the process of tracking, documenting, and managing your organization's workforce, including their roles, access levels, and compliance-related information.",
			question_2: "Why is employee management important?",
			answer_2:
				"Employee management is crucial for compliance because it helps you track who has access to sensitive systems, document employee training and awareness programs, and maintain evidence of your security controls. This is essential for frameworks like SOC 2, ISO 27001, and HIPAA.",
			question_3: "Is employee management required for SOC 2?",
			answer_3:
				"For SOC 2, you need to document employee onboarding/offboarding processes, track access to systems and data, maintain records of security training, and demonstrate that employees understand their security responsibilities. This helps auditors verify your security controls and personnel management practices.",
		},
	},
	cloud_tests: {
		title: "Cloud Compliance - Coming Soon",
		description:
			"Test and validate your cloud infrastructure security with automated tests and reports.",
		cta: "Create your first cloud test",
		learn_more: "Learn more",
		faqs: {
			question_1: "What are cloud security tests?",
			answer_1:
				"Cloud security tests are automated assessments that evaluate your cloud infrastructure for security vulnerabilities, misconfigurations, and compliance with security best practices.",
			question_2: "Why are cloud security tests important?",
			answer_2:
				"Cloud security tests help identify potential security risks in your cloud environment, ensure compliance with security standards, and provide evidence of your security controls for auditors. They're essential for maintaining a strong security posture in cloud environments.",
			question_3: "What types of cloud tests are available?",
			answer_3:
				"Cloud security tests can include infrastructure scanning, configuration analysis, vulnerability assessments, and compliance checks. These tests help ensure your cloud resources are properly secured and configured according to best practices.",
		},
	},
} as const;
