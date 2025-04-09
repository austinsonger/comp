import type { TemplatePolicy } from "../types";

export const thirdPartyPolicy: TemplatePolicy = {
	type: "doc",
	metadata: {
		id: "thirdparty",
		slug: "thirdparty",
		name: "Third-Party Management Policy",
		description:
			"This policy defines the rules for relationships with the organization's Information Technology (IT) third-parties and partners.",
		frequency: "yearly",
		department: "gov",
	},
	content: [
		{
			type: "heading",
			attrs: { level: 1 },
			content: [{ type: "text", text: "Third-Party Management Policy" }],
		},
		{
			type: "heading",
			attrs: { level: 2 },
			content: [{ type: "text", text: "Policy Information" }],
		},
		{
			type: "table",
			content: [
				{
					type: "tableRow",
					content: [
						{
							type: "tableCell",
							content: [{ type: "text", text: "Organization" }],
						},
						{
							type: "tableCell",
							content: [{ type: "text", text: "Last Review" }],
						},
						{
							type: "tableCell",
							content: [{ type: "text", text: "Review Frequency" }],
						},
						{
							type: "tableCell",
							content: [{ type: "text", text: "Approved By" }],
						},
						{
							type: "tableCell",
							content: [{ type: "text", text: "Classification" }],
						},
					],
				},
				{
					type: "tableRow",
					content: [
						{
							type: "tableCell",
							content: [{ type: "text", text: "{{organization}}" }],
						},
						{
							type: "tableCell",
							content: [{ type: "text", text: "{{date}}" }],
						},
						{
							type: "tableCell",
							content: [{ type: "text", text: "Annual" }],
						},
						{
							type: "tableCell",
							content: [
								{ type: "text", text: "Chief Information Security Officer" },
							],
						},
						{
							type: "tableCell",
							content: [{ type: "text", text: "Confidential" }],
						},
					],
				},
			],
		},
		{
			type: "heading",
			attrs: { level: 2 },
			content: [{ type: "text", text: "Purpose and Scope" }],
		},
		{
			type: "orderedList",
			attrs: { tight: true, start: 1 },
			content: [
				{
					type: "listItem",
					content: [
						{
							type: "paragraph",
							content: [
								{
									type: "text",
									text: "This policy defines the rules for relationships with the organization's Information Technology (IT) third-parties and partners.",
								},
							],
						},
					],
				},
				{
					type: "listItem",
					content: [
						{
							type: "paragraph",
							content: [
								{
									type: "text",
									text: "This policy applies to all IT third-parties and partners who can impact the confidentiality, integrity, and availability of the organization's technology and sensitive information, or who are within the scope of the organization's information security program.",
								},
							],
						},
					],
				},
				{
					type: "listItem",
					content: [
						{
							type: "paragraph",
							content: [
								{
									type: "text",
									text: "This policy applies to all employees and contractors responsible for the management and oversight of IT third-parties and partners of the organization.",
								},
							],
						},
					],
				},
			],
		},
		{
			type: "heading",
			attrs: { level: 2 },
			content: [{ type: "text", text: "Background" }],
		},
		{
			type: "paragraph",
			content: [
				{
					type: "text",
					text: "The overall security of the organization is highly dependent on the security of its contractual relationships with its IT suppliers and partners. This policy defines requirements for effective management and oversight of such suppliers and partners from an information security perspective. It prescribes minimum security standards third-parties must meet, including security clauses, risk assessments, service level agreements, and incident management.",
				},
			],
		},
		{
			type: "heading",
			attrs: { level: 2 },
			content: [{ type: "text", text: "References" }],
		},
		{
			type: "orderedList",
			attrs: { tight: true, start: 1 },
			content: [
				{
					type: "listItem",
					content: [
						{
							type: "paragraph",
							content: [{ type: "text", text: "Information Security Policy" }],
						},
					],
				},
				{
					type: "listItem",
					content: [
						{
							type: "paragraph",
							content: [
								{ type: "text", text: "Security Incident Response Policy" },
							],
						},
					],
				},
			],
		},
		{
			type: "heading",
			attrs: { level: 2 },
			content: [{ type: "text", text: "Policy" }],
		},
		{
			type: "orderedList",
			attrs: { tight: true, start: 1 },
			content: [
				{
					type: "listItem",
					content: [
						{
							type: "paragraph",
							content: [
								{
									type: "text",
									text: "IT third-parties are prohibited from accessing the organization's information security assets until a contract containing security controls is agreed to and signed by the appropriate parties.",
								},
							],
						},
					],
				},
				{
					type: "listItem",
					content: [
						{
							type: "paragraph",
							content: [
								{
									type: "text",
									text: "All IT third-parties must comply with the security policies defined in the Information Security Policy.",
								},
							],
						},
					],
				},
				{
					type: "listItem",
					content: [
						{
							type: "paragraph",
							content: [
								{
									type: "text",
									text: "All security incidents involving IT third-parties or partners must be documented per the Security Incident Response Policy and immediately reported to the Information Security Manager (ISM).",
								},
							],
						},
					],
				},
				{
					type: "listItem",
					content: [
						{
							type: "paragraph",
							content: [
								{
									type: "text",
									text: "The organization must adhere to the terms of all Service Level Agreements (SLAs) entered into with IT third-parties. As SLAs are updated or new agreements are made, necessary changes or controls must be implemented to maintain compliance.",
								},
							],
						},
					],
				},
			],
		},
	],
} as const;
