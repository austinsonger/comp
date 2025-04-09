export const frameworks = {
	title: "Frameworks",
	overview: {
		error: "Failed to load frameworks",
		empty: {
			title: "No frameworks selected",
			description:
				"Select frameworks to get started with your compliance journey",
		},
		progress: {
			title: "Framework Progress",
			empty: {
				title: "No frameworks yet",
				description:
					"Get started by adding a compliance framework to track your progress",
				action: "Add Framework",
			},
		},
		grid: {
			welcome: {
				title: "Welcome to Comp AI",
				description:
					"Get started by selecting the compliance frameworks you would like to implement. We'll help you manage and track your compliance journey across multiple standards.",
				action: "Get Started",
			},
			title: "Select Frameworks",
			version: "Version",
			actions: {
				clear: "Clear",
				confirm: "Confirm Selection",
			},
		},
	},
	controls: {
		title: "Controls",
		description: "Review and manage compliance controls",
		table: {
			status: "Status",
			control: "Control",
			artifacts: "Artifacts",
			actions: "Actions",
			requirements: "Linked Requirements",
		},
		statuses: {
			completed: "Completed",
			in_progress: "In Progress",
			not_started: "Not Started",
		},
		search: {
			placeholder: "Search controls...",
		},
	},
	requirements: {
		requirement: "Requirement",
		requirements: "Requirements",
		title: "Linked Requirements",
		description: "Review and manage compliance requirements",
		table: {
			id: "ID",
			name: "Name",
			description: "Description",
			frameworkId: "Framework",
			requirementId: "Requirement ID",
		},
		search: {
			id_placeholder: "Search by ID...",
			name_placeholder: "Search by name...",
			description_placeholder: "Search in description...",
			universal_placeholder: "Search requirements...",
		},
	},
	artifacts: {
		title: "Linked Artifacts",
		table: {
			id: "ID",
			name: "Name",
			type: "Type",
			created_at: "Created At",
		},
		search: {
			id_placeholder: "Search by ID...",
			name_placeholder: "Search by name...",
			type_placeholder: "Filter by type...",
			universal_placeholder: "Search artifacts...",
		},
		no_artifacts: "No Linked Artifacts found",
	},
} as const;
