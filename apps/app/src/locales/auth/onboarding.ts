export const onboarding = {
	title: "Create an organization",
	submit: "Finish setup",
	setup: "Welcome to Comp AI",
	description:
		"Tell us a bit about your organization and what framework(s) you want to get started with.",
	trigger: {
		title: "Hold tight, we're creating your organization",
		creating: "This may take a minute or two...",
		completed: "Organization created successfully",
		error: "Something went wrong, please try again.",
	},
	fields: {
		fullName: {
			label: "Your Name",
			placeholder: "Your full name",
		},
		name: {
			label: "Organization Name",
			placeholder: "Your organization name",
		},
		subdomain: {
			label: "Subdomain",
			placeholder: "example",
		},
		website: {
			label: "Website",
			placeholder: "Your organization website",
		},
	},
	success: "Welcome to Comp AI, your organization has been created!",
	error: "Something went wrong, please try again.",
	creating: "Creating your organization...",
	switch: "Switching organization...",
	organization: {
		create: "Add organization",
		current: "Current organization",
		switch_to: "Switch to",
	},
} as const;
